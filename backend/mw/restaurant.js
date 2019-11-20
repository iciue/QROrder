const path = require('path')
const express = require('express')
const db = require('../db/db-restaurant')
const multer  = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const io  = require('../io-server')

const app = express.Router()

var deskCartMap = new Map()

io.restaurant.on('connection', socket => {
  console.log('restaurant client in')

  const restaurant = socket.handshake.query.restaurant
  socket.join(restaurant)
  console.log('restaurant client in ' + restaurant);
})

io.desk.on('connection', socket => {
  console.log('desk client in')
  const desk = socket.handshake.query.desk
  if (!desk) {
    console.log('no desk param');
    socket.closed()
    return
  }
  socket.join(desk)
  console.log('desk client join ' + desk)
  let cartFood = deskCartMap.get(desk)
  if (!cartFood) {
    cartFood = []
    deskCartMap.set(desk, cartFood)
  }
  socket.emit('cart food', cartFood)  // 向加入 desk 的顾客发送购物车信息
  socket.on('new food', info => {   // 顾客 A 点餐, 更新购物车信息并广播
    const cartStatus = deskCartMap.get(info.desk)
    const idx = cartStatus.findIndex(it => it.food.id === info.food.id)

    if (idx >= 0) {
      if (info.amount === 0) {
        cartStatus.splice(idx, 1)
      } else {
        cartStatus[idx].amount = info.amount
        cartStatus[idx].totalPrice = info.amount * info.food.price
      }
    } else {
      cartStatus.push({
        food: info.food,
        amount: info.amount,
        totalPrice : info.amount * info.food.price
      })
    }

    io.desk.in(desk).emit('new food', info)
  })
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({storage})


const deskStatus = {
  PENDING: 'PENDING',    // 未下单, 正在点餐
  ACTIVE: 'ACTIVE',      // 已下单, 等待服务员确认
  CONFIRMED: 'CONFIRMED',// 服务员已确认
  COMPLETED: 'COMPLETED' // 已结账
}

// 获取 桌面信息 餐厅名称, 桌面名称; 将会在 landing 页面请求并展示
// desinfo?rid=5&did=8
app.get('/deskinfo', async (req, res ,next) => {
  const {rid, did} = req.query
  const desk = await db.getDeskInfo({rid, did: did.toUpperCase()})
  res.json(desk)
})

// 请求 餐厅的所有菜单
app.get('/menu/restaurant/:rid', async (req, res, next) => {
  const menu = await db.getAllMenu(req.params.rid)
  if (menu) {
    res.json(menu)  
  } else {
    res.status(401).json({
      code: -1,
      msg: '没有菜单'
    })
  }
})


/**
 * 用户下单
 * excepted:{
 *  rid: 
 *  customCount: 
 *  foods: [{fid, amount}, {...}, {...}]
 *  deskName:
 * }
 */
app.post('/restaurant/:rid/desk/:did/order', async (req, res, next) => {
  const {rid} = req.params
  const {deskName, customCount, totalPrice, status} = req.body
  const details = JSON.stringify(req.body.details)
  const timestamp = new Date().toISOString()
  const desk = await db.findDeskByName({rid, deskName: deskName.toUpperCase()})
  let did
  if (desk) did = desk.id
  try {
    await db.placeOrder({rid, did, deskName, totalPrice, customCount, details, status, timestamp}) // 创建订单
  } catch (error) {
    next(error)
  }
  const order = await db.findNewestOrder({rid, did})
  res.json(order) // 返回已下单的的数据

  deskCartMap.set(deskName, []) //清空当前桌已点菜数据
  io.desk.in(deskName).emit('placeOrder success', order)  //通知其他顾客下单成功
  io.restaurant.in(rid).emit('new order', order) //通知餐厅新订单
})

// 菜品管理
app.route('/restaurant/:rid/food')
  // 获取所有菜品列表用于展示
  .get(async (req, res, next) => {
    const uid = req.signedCookies.uid
    const foodList = await db.getAllFood(uid)
    res.json(foodList)
  })
  // 添加菜品
  .post(upload.single('img'))
  .post(async (req, res, next) => {
    let img = 'default.png'
    if (req.file) {
      console.log('上传了图片');
      const image = req.file.filename
      await sharp(path.resolve(req.file.destination, image))
      .resize(300, 300)
      .toFile(path.resolve(req.file.destination, `resized${image}`))
      .catch(console.log)
      fs.unlinkSync(path.resolve(req.file.destination, image))
      img = `resized${image}`
    }
    
    const uid = req.signedCookies.uid 
    const {name, desc, price, category, status} = req.body
    console.log({uid, name, desc, price, category, status, img});
    await db.createFood({uid, name, desc, price, category, status, img})
    const food = await db.findNewestFood(uid)
    console.log(food);
    return res.json(food)
  })

app.route('/restaurant/:rid/food/:fid')
  // 删除菜品
  .delete(async (req, res, next) => {
    const {fid} = req.params
    const uid = req.signedCookies.uid
    const food = await db.findFoodById({fid, uid})
    if (food) {
      await db.deleteFood(fid, uid)
      delete food.id // 删除 food 的 id
      res.json(food) // 返回删除的 food 信息(不带 id). 
    } else {
      res.status(403).json({
        code: -1,
        msg: '不存在这样的菜品或无权限删除'
      })
    }
    
  })
  // 修改菜品
  .put(upload.single('img'))
  .put(async (req, res, next) => {
    let img = req.body.img || (req.file && req.file.filename)
    if (req.file) {
      await sharp(path.resolve(req.file.destination, img))
      .resize(300, 300)
      .toFile(path.resolve(req.file.destination, `resized${img}`))
      .catch(console.log)
      fs.unlinkSync(path.resolve(req.file.destination, img))
      img = `resized${img}`
    }
    
    const {fid} = req.params
    const uid = req.signedCookies.uid
    const food = await db.findFoodById({fid, uid})
    if (food) {
      // TODO: 更新菜品图片后删除原图片, 如果是默认图片则不删除文件
      const {name, price, status, desc, category} = req.body
      await db.updateFood({name, price : +price, status, desc, category, fid, uid, img}) // 修改菜品的信息
      const updatedFood = await db.findFoodById({fid, uid})
      res.json(updatedFood)
    } else {
      res.status(403).json({
        code: -1,
        msg: '不存在这样的菜品或无权限删除'
      })
    }
  })


// 桌面管理
app.route('/restaurant/:rid/desk')
  // 获取所有桌面列表
  .get(async (req, res, next) => {
    const uid = req.signedCookies.uid
    const deskList = await db.getAllDesk(uid)
    res.json(deskList)
  })
  // 添加桌面
  .post(async (req, res, next) => {
    const {name, capacity} = req.body
    const uid = req.signedCookies.uid
    dn.createDesk({uid, name, capacity})
    const desk = await db.findNewestDesk(uid)
    res.json(desk)
  })


app.route('/restaurant/:rid/desk/:did')
  // 删除桌面
  .delete(async (req, res, next) => {
    const {did} = req.params
    const uid = req.signedCookies.uid
    const desk = await db.findDeskById({did, uid})
    if (desk) {
      await db.deleteDesk({uid, did})
      delete desk.id // 删除 Desk 的 id
      res.json(desk) // 返回删除的 Desk 信息(不带 id). 
    } else {
      res.status(403).json({
        code: -1,
        msg: '不存在这样的菜品或无权限删除'
      })
    }
    
  })
  // 修改桌面
  .put(async (req, res, next) => {
    const {did} = req.params
    const uid = req.signedCookies.uid
    const desk = await db.findDeskById({did, uid})
    if (desk) {
      const {name, capacity} = req.body
      await db.updateDesk({uid, did, name, capacity})
      const updatedDesk = await db.findDeskById({did, uid})
      res.json(updatedDesk)
    } else {
      res.status(403).json({
        code: -1,
        msg: '不存在这样的桌面或无权限删除'
      })
    }
  })


// 订单管理
// /restaurant/1/order/${order.id}/status
app.route('/restaurant/:rid/order')
  // 获取所有订单
  .get(async (req, res, next) => {
    const uid = req.signedCookies.uid
    const orders = await db.getAllOrder(uid)
    res.json(orders)
  })

app.put('/restaurant/:rid/order/:oid/status', async (req, res, next) => {
  const {status} = req.body
  const uid = req.signedCookies.uid
  const {oid} = req.params
  try {
    await db.updateOrder({status, oid, uid})
    res.json(order)
  } catch (error) {
    res.json({
      code: -1,
      msg: '服务器错误'
    })
  }
}) 



module.exports = app