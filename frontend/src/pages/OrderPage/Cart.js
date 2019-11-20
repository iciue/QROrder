import React, {useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import {useParams, useLocation} from 'react-router-dom'

import api from '../../api/index'

import {Layout, Icon, List} from 'antd'

const CartDetails = ({setShowCart}) => {
  const cartStatus = useSelector(state => state.cartReducer.cartStatus)
  const dispatch = useDispatch()
  const {did} = useParams()
  console.log(`===`, cartStatus);

  const foodCounter = ({amount, food}, n) => {
    dispatch({
      type: 'newFood',
      food,
      amount: amount + n,
      desk: did
    })
  }

  return (
    <div className="cart-model" onClick={() => setShowCart(false)}>
    <List
      className="cart-details"
      onClick={e => e.stopPropagation()}

      bordered
      itemLayout="horizontal"
      dataSource={cartStatus}
      renderItem={it => (
        <List.Item>
          <span className="name">{it.food.name}</span>
          <div>
            <span className="price">{it.totalPrice ? `¥: ${it.totalPrice}` : false} </span>
            <button className="dec" onClick={() => foodCounter(it, -1)} ></button>
            <span>{it.amount}</span>
            <button className="inc" onClick={() => foodCounter(it, 1)}></button>
          </div>
        </List.Item>
      )}
    />
  </div>
  )
}

const Cart = () => {
  const cartStatus = useSelector(state => state.cartReducer.cartStatus)
  const [showCart, setShowCart] = useState(false)
  const {rid, did} = useParams()
  const query = new URLSearchParams(useLocation().search)
  const totalPrice = cartStatus.reduce((sum, it) => (it.amount * it.food.price) + sum, 0)

  function placeOrder() {
    const info = {
      deskName: did,
      customCount: query.get("custom"),
      details: cartStatus.map(it => ({fid: it.food.id, amount: it.amount})),
      totalPrice: totalPrice,
      status: "active",
    }
    api.post(`/restaurant/${rid}/desk/${did}/order`, info)
      .then(res => {
        console.log(`下单成功`);
        console.log(res.data);
      })
  }

  function changeShowCart() {
    setShowCart(!showCart)
  }

  return (
    <Layout.Footer className="cart-wrap" >
      {
        cartStatus.length > 0 && showCart && <CartDetails setShowCart={setShowCart} />
      }
      <div className="cart-status" onClick={changeShowCart}>
        <i><Icon type="shopping-cart" /></i>
        <div>
          <span>总价: {totalPrice}</span>
          <button onClick={placeOrder}>下单</button>
        </div>
      </div>
    </Layout.Footer>
  )
}

export default Cart