import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {useLocation} from 'react-router-dom'
import io from 'socket.io-client'

import Loading from '../../../component/Loading'

import api from '../../../api'

/**
 * 1. 获取所有订单数据
 * 2. socket.on(''), 监听同步过来的新数据
 * 3. 刚下单的订单状态为 active. 服务员手动确认订单. 顾客结账后结束订单
 */

const OrderItem = React.memo(({order, onChangeStatus}) => {

  const print = useCallback(() => {

  }, [])

  function changeStatus(e) {
    const status = e.target.dataset.status
    if (status === order.status) return;
    api.put(`/restaurant/1/order/${order.id}/status`, {status})
      .then(res => onChangeStatus(order.id, status))
  }
  
  return (
    <div>
      <h3>{order.deskName}</h3>
      <div>就餐人数: {order.customCount}</div>
      <div>总价格: {order.totalPrice}</div>
      <div>下单时间: { new Date(order.timestamp).toLocaleString()}</div>
      <div>订单状态: {order.status}</div>

      <div>
        <button onClick={print} >打印</button>
        <button onClick={changeStatus} data-status="confirmed" >确认</button>
        <button onClick={changeStatus} data-status="completed" >完成</button>
      </div>
    </div>
  )
}, (prev, next) => prev.order === next.order)

const OrderList = ({orders, onChangeStatus}) => {

  const filteredOrders = useMemo( () => {
    const filteredOrders = orders.sort((a, b) =>  - new Date(b.timestamp) - new Date(a.timestamp))
    console.log(filteredOrders);
    return filteredOrders
  }, [orders.length])

  return (
    <div>
      <ul>
        {filteredOrders.map(order => <OrderItem order={order} key={order.id} onChangeStatus={onChangeStatus} />)}
      </ul>
    </div>
  )
  
}

const OrderManage = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState()
  const rid = useLocation().state
  
  useEffect(() => {
    console.log(`请求数据, 绑定 socket`);
    api.get('/restaurant/1/order/')
      .then(res => {
        setOrders(res.data)
        setLoading(false)
      })
    const socket = io('http://localhost:8888', {
      path: '/restaurant',
      query: {
        restaurant: rid
      }
    })
    socket.on('new order', (order) => {
      setOrders( (oldOrders) => {
        return [...oldOrders, order]
      })
    })
    
    return () => {
      console.log(`OrderManage didMount`);
      socket.close()
    }
  }, [])
  
  function onChangeStatus(oid, status) {
    setOrders(orders =>  orders.map(o =>  o.id === oid ? {...o, status} : o ))
  }
  
  return (
    <div>
      <Loading loading={loading}>
        {
          <OrderList orders={orders} onChangeStatus={onChangeStatus} />
        }
      </Loading>
    </div>
  )
  
}

export default OrderManage