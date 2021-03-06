import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch, Provider } from "react-redux";
import {useParams, } from 'react-router-dom'

import MenuList from './MenuList'
import Cart from './Cart'

import api from '../../api/index'
import store from './store'

import Loading from '../../component/Loading'
import { Layout } from 'antd'

import './index.less'

const OrderPage = (props) => {
  const [loading, setLoading] = useState(true)
  const orderSuccess = useSelector(state => state.cartReducer.orderSuccess)
  const dispatch = useDispatch()
  const {did} = useParams()

  useEffect(() => {
    api.get('/menu/restaurant/1')
      .then(res => {
        dispatch({
          type: 'getMenu',
          menu: res.data
        })
        setLoading(false)
      })

      dispatch({
        type: 'createSocket',
        did,
        dispatch,
      })
  
      return () => {
        dispatch({
          type: 'closeSocket'
        })
      }
  }, [])

  return (
    <Layout className="container">
      <Loading loading={loading} >
      {
        orderSuccess ?
        <div class="signboard order-success">
          <div class="sign">下单成功</div>
          <div class="strings"></div>
          <div class="pin top"></div>
          <div class="pin left"></div>
          <div class="pin right"></div>
        </div>
        :
        <>
          <MenuList />
          <Cart />
        </>
      }
      </Loading>
    </Layout>
  )
}

export default () => {
  return (
    <Provider store={store}>
      <OrderPage></OrderPage>
    </Provider>
  )
}