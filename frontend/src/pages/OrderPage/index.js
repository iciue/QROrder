import React, {useState, Suspense, useEffect} from 'react'
import { useSelector, useDispatch, Provider } from "react-redux";
import {useParams, useLocation} from 'react-router-dom'

import Loading from '../../component/Loading'

import api from '../../api/index'
import store from './store'

function OrderPage(props) {
  const [loading, setLoading]   = useState(true)
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
  })

  return (
      <Loading loading={loading} >
        <Menu />
        <CartStatus />
      </Loading>
  )
}

function Menu() {
  const menu = useSelector(state => state.cartReducer.menu )
  
  return (
   <div>
      { menu.map(food => <MenuItem key={food.id} food={food} />) }
   </div>
  )
}

const MenuItem = ({food}) => {
  const cartStatus = useSelector(state => state.cartReducer.cartStatus)
  const currFoodInCart = cartStatus.find(it => it.food.id === food.id) 
  const count = currFoodInCart ? currFoodInCart.amount : 0

  const dispatch = useDispatch()
  const {did} = useParams()

  function foodCounter(n) {
    const newCount = count + n
    if (newCount < 0 ) return; 
    dispatch({
      type: 'updateFood',
      food,
      amount: newCount
    })
    dispatch({
      type: 'newFood',
      food,
      amount: newCount,
      desk: did
    })
  }

  return (
    <div>
      <div>
        <img width="100" src={`http://localhost:8888/upload/${food.img}`} alt={food.name}></img>
      </div>
      <div>
        <p>{food.name}</p>
        <p>{food.desc}</p>
        <p>{food.price}</p>
      </div>
      <div>
        <button onClick={() => foodCounter(-1)}>-</button>
        <span>{count}</span>
        <button onClick={() => foodCounter(+1)}>+</button>
      </div>
    </div>
  )

}

const CartStatus = () => {
  const cartStatus = useSelector(state => state.cartReducer.cartStatus)
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

  return (
    <div>
      <div>购物车: {totalPrice}</div>
      <div>
        <button onClick={placeOrder}>下单</button>
      </div>
    </div>
  )

}


export default () => {
  return (
    <Provider store={store}>
      <OrderPage></OrderPage>
    </Provider>
  )
}