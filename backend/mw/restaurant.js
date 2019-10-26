const express = require('express')
const db = require('../db/db-restaurant')

const app = express.Router()

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
  const deskId = await db.getDeskId({rid, did: did.toUpperCase()})
  const desk = await db.getDeskInfo(deskId)
  console.log(desk);
  res.json(desk)
})

// 请求 餐厅的所有菜单
app.get('/menu/restaurant/:rid', async (req, res, next) => {
  const menu = await db.getAllMenu(req.params.rid)
  console.log(1);
  console.log(menu);
  if (menu) {
    res.json(menu)  
  } else {
    res.status(401).json({
      code: -1,
      msg: '没有菜单'
    })
  }
})

// 用户下单
/**
 * excepted:{
 *  rid: 
 *  customCount: 
 *  foods: [{fid, amount}, {}, {}]
 *  deskName:
 * }
 */
app.post('/restaurant/:rid/desk/:did/order', async (req, res, next) => {
  const {rid, did, } = req.params
  const {deskName, customCount} = req.body
  const details = JSON.stringify(req.body.foods)
  const status = deskStatus.PENDING
  const timestamp = new Date().toISOString()

  const orderId = await db.placeOrder({rid, did, deskName, customCount, details, status, timestamp}) // 创建订单
  const order = await db.findOrderById(orderId)
  res.json(order) // 返回已下单的的数据
})

// 菜品管理
app.route('/restaurant/:rid/food')
  // 获取所有菜品列表用于展示
  .get(async (req, res, next) => {
    const uid = req.cookies.uid
    const foodList = await db.getAllFood(uid)
    res.json(foodList)
  })
  // 添加菜品
  .post(async (req, res, next) => {
    const uid = req.cookies.uid 
    const {name, price, status} = req.body
    console.log(name, price, status);
    const foodId = await db.createFood({uid, name, price, status})
    const food = await db.findFoodById(foodId)
    return res.json(food)
  })
  

app.route('/restaurant/:rid/food/:fid')
  // 删除菜品
  .delete(async (req, res, next) => {
    const {fid} = req.params
    const uid = req.cookies.uid
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
  .put(async (req, res, next) => {
    const {fid} = req.params
    const uid = req.cookies.uid
    const food = await db.findFoodById({fid, uid})
    console.log(food);
    if (food) {
      const {name, price, status, desc, category} = req.body
      await db.updateFood({name, price : +price, status, desc, category, fid, uid}) // 修改菜品的信息
      const updatedFood = await db.findFoodById({fid, uid})
      console.log('=====');
      console.log(updatedFood);
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
  // 获取所有菜品列表用于展示
  .get(async (req, res, next) => {
    const deskList = await db.getAllDesk(rid, uid)
    res.json(deskList)
  })
  // 添加菜品
  .post(async (req, res, next) => {
    const {name, capacity} = req.body
    const uid = req.cookies.uid
    const newDesk = dn.createDesk(uid, name, capacity)
    const desk = await db.getLatestDesk(uid)
    res.json(json)
  })


app.route('/restaurant/:rid/desk/:did')
  .delete(async (req, res, next) => {
    const {rid, did} = req.params
    const uid = req.cookies.uid
    const desk = await db.findFoodById(did, uid)
    if (desk) {
      await db.deleteFood(did, uid)
      delete desk.id // 删除 food 的 id
      res.json(desk) // 返回删除的 food 信息(不带 id). 
    } else {
      res.status(403).json({
        code: -1,
        msg: '不存在这样的菜品或无权限删除'
      })
    }
    
  })
  .put(async (req, res, next) => {
    const {did} = req.params
    const uid = req.cookies.uid
    const desk = await db.findDeskById(did, uid)
    if (desk) {
      const updatedDesk = await db.updateFood(did, uid, { name, price, status })  // 修改某菜品的名称,价格,或上架状态
      res.json(updatedDesk)
    } else {
      res.status(403).json({
        code: -1,
        msg: '不存在这样的桌面或无权限删除'
      })
    }
  })


// 订单管理
app.route('/restaurant/:rid/order/:oid')
  .get(async (req, res, next) => {
    const uid = req.cookies.uid
    const orders = await db.findOrdersById(uid, oid)
    order.forEach(order => {
      order.details = JSON.parse(order.details)
    })
    res.json(orders)
  })
  .delete(async (req,res, next) => {
    const oid = req.params
    const order = await db.findOrderById(uid, oid)
    if (order) {
      await db.deleteOrder
      res.json(order)
    } else {
      res.status(401).json({
        code: -1,
        msg: '没有次订单或无权限操作次订单'
      })
    }
  })


module.exports = app