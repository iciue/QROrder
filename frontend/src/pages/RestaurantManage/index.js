import React, {useEffect, useState } from 'react'
import { Link, Switch, Route, useRouteMatch} from 'react-router-dom'
import api from '../../api'
import Loading from '../../component/Loading'


import OrderManage from './OrderManage/'
import FoodManage from './FoodManage/'
import DeskManage from './DeskManage/'
import AddFood from './AddFood/'

import './style.css'

/**
 * 餐厅管理系统, 页面打开是发送 get 请求获取餐厅信息
 */


function RestaurantInfo ({info}) {
  return (
    <div>
      <h2>{info.title}</h2>
    </div>
  )
}

function RestaurantManage() {
  const {path, url} = useRouteMatch()
  const [info, setInfo] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/userinfo')
      .then(res => {
        console.log('get userinfo');
        setInfo(res.data)
        setLoading(false)
      })
    return () => {}
  }, [])  
  
  return (
    <div className='restaurant-manage'>
      <h2>餐厅管理系统</h2>
      <Loading loading={loading}>
        <RestaurantInfo info={info} />
        <nav>
          <ul>
            <li> <Link to={{pathname: `${url}/order`, state: 1}} >订单管理</Link> </li>
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
      </Loading>
    </div>
  )
}

export default RestaurantManage