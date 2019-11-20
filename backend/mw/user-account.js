const fsp = require('fs').promises
const multer = require('multer')
const md5 = require('md5')
const express = require('express')
const sharp = require('sharp')
const svgCaptcha = require('svg-captcha')
const db = require('../db/db-account')

const app = express.Router()

// 注册商户
app.post('/register', async(req, res, next) => {
  const {name, password, email, title} = req.body
  const user = await db.findUserByName(name)
  if (user) {
    res.status(401).json({
      code: -1,
      msg: '用户已存在'
    })
  } else {
    const uid = await db.createUser({name, password:md5(md5(password)), email, title})
    if (uid === -1) {
      res.status(401).json({
        code: -1,
        msg: '注册失败'
      })
    } else {
      res.json({
        code: 0,
        msg: '注册成功'
      })
    }
  }
})

// 登录商户, 返回商户的 登录名 和 展示名
app.post('/login', async(req, res, next) => {
  const {name, password} = req.body
  const user = await db.tryLogin({name, password: md5(md5(password))})
  if (user) {
    res.cookie('uid', user.id, {httpOnly: true, signed: true})
    // res.cookie('uid', user.id)
    res.json({
      name,
      title: user.title,
    })
  } else {
    res.status(401).json({
      code: -1,
      msg: '用户名或密码错误'
    })
  }
})

// 根据 cookie 查找用户信息
app.get('/userinfo', async (req, res, next) => {
  // const uid = req.cookies.uid 
  const uid = req.signedCookies.uid 
  console.log(uid);
  const user = await db.findUserById(uid)
  if(user) {
    res.json(user)
  } else {
    res.status(401).json({
      code: -1,
      msg: '没有此餐厅'
    })
  } 
})

// 登出
app.get('/logout', async (req, res ,next) => {
  res.clearCookie('uid')
  res.end()
})

// 找回密码
// 修改密码

module.exports = app