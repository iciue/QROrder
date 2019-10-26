import React, {Suspense, } from 'react'
import { Link, Switch, Route, useRouteMatch} from 'react-router-dom'
import createFetcher from '../../utils/createFetcher'
import api from '../../api'

import OrderManage from './OrderManage/'
import FoodManage from './FoodManage/'
import DeskManage from './DeskManage/'
import AddFood from './AddFood/'

import './style.css'

/**
 * 餐厅管理系统, 页面打开是发送 get 请求获取餐厅信息
 */

const fetcher = createFetcher( () => {
  return api.get('/userinfo')
})

function RestaurantInfo () {
  const info = fetcher.read().data
  console.log(info);

  return (
    <div>
      <h2>{info.title}</h2>
    </div>
  )
}

function RestaurantManage() {
  const {path, url} = useRouteMatch()
  console.log(path, url);
  return (
    <div className='restaurant-manage'>
      <h2>餐厅管理系统</h2>
      <Suspense fallback={<div>loading...</div>} >
        <RestaurantInfo></RestaurantInfo>
        <nav>
          <ul>
            <li> <Link to={`${url}/order`} >订单管理</Link> </li>
            <li> <Link to={`${url}/food`} >菜品管理</Link> </li>
            <li> <Link to={`${url}/desk`} >桌面管理</Link> </li>
          </ul>
        </nav>
        <Switch>
            <Route path={`${path}/order`} component={OrderManage} />
            <Route path={`${path}/food`} component={FoodManage} />
            <Route path={`${path}/desk`} component={DeskManage} />
            <Route path={`${path}/add-food`} component={AddFood} />
        </Switch>
      </Suspense>
    </div>
  )
}

export default RestaurantManage