import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import HomePage from './pages/HomePage/index'
import LandingPage from './pages/LandingPage/index';
import FoodCart from './pages/FoodCart/index';
import RestaurantManage from './pages/RestaurantManage/index';
import Login from './pages/Login/index';

/**
 * 路由:
 * 客户侧: 
 *  扫码进入落地页选择就餐人数  /landing/r/1/a01 
 *  点餐页面: /r/1/d/a01
 *  
 * 商户侧:
 *  登录/注册入口   /
 *  订单管理       /manage/order
 *  订单详情页     /manage/order/12
 *  菜品管理      /manage/food
 *  桌面管理      /manage/desk
 */

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage}></Route>
        <Route path="/landing/r/:rid/d/:did" component={LandingPage} ></Route>
        <Route path="/r/:rid/d/:did" component={FoodCart} ></Route>
        <Route path="/manage" component={RestaurantManage} ></Route>
        <Route path="/login" component={Login} ></Route>
      </Switch>
    </Router>
  );
}

export default App;
