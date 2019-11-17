import React, { useCallback, useEffect, useRef, useMemo, useState }  from 'react';
import { useSelector, useDispatch } from "react-redux";
import {useParams } from 'react-router-dom';
import {groupBy} from 'utils/helper';

import {Layout, Card, Icon, Menu} from 'antd';

const MenuList = () => {
  console.log(`list refresh`);
  const menu = useSelector(state => state.cartReducer.menu )
  const categories = groupBy(menu, 'category')
  const categoriesNames = Object.keys(categories)
  const MenuRef = useRef()
  const isLock = useRef(false)

  const [categoryInfo, setCategoryInfo] = useState([])
  const [selectedKeys, setSelectedKeys] = useState('1')

  const scrollHandler = useCallback((e) => {
    if (isLock.current) {
      isLock.current = false;
      return
    }
    const pageY = MenuRef.current.scrollTop + 10
    const target = categoryInfo.find(it => pageY >= it.offsetTop)
    target && target.dataset.category === selectedKeys || setSelectedKeys(target.dataset.category)
  }, [categoryInfo])

  const scrollTo = (e) => {
    const t = categoryInfo.find(it => it.dataset.category === e.key)
    const d = t.offsetTop
    isLock.current = true
    MenuRef.current.scrollTo(0, d)
    setSelectedKeys(e.key)
  }
  
  useEffect(() => {
    console.log(`didMount`);
    setCategoryInfo(() => categoriesNames.map(name => document.querySelector(`[data-category="${name}"]`)).reverse())
    return () => {console.log(`unMount`);}
  }, [])

  useEffect(() => {
    console.log(`重新绑定了事件`);
    MenuRef.current.addEventListener('scroll', scrollHandler)
    return () => {
      MenuRef.current.removeEventListener('scroll', scrollHandler)
    }
  }, [scrollHandler])
  
  return (
    <>
      <Menu className="aside" selectedKeys={selectedKeys} >
        { categoriesNames.map(it => (
          <Menu.Item key={it} onClick={scrollTo}>
            <span>{it === '1' ? "置顶" : it}</span>
          </Menu.Item>
          ))
        }
      </Menu>
      <Layout.Content className="menu-wrap"  >
        <div ref={MenuRef}>
        {
          categoriesNames.map((name, i) => (
            <div key={name} className = {name} data-category={name} >
              <h4 className="title">{name}</h4>
              {categories[name].map(food => <MenuItem key={food.id} food={food}/>)}
            </div>
          ))
        }
        </div>
      </Layout.Content>
    </>
  )
}


const MenuItem = ({food}) => {
  const cartStatus = useSelector(state => state.cartReducer.cartStatus)
  const FoodInCart = cartStatus.find(it => it.food.id === food.id) 
  const count = FoodInCart ? FoodInCart.amount : 0

  const dispatch = useDispatch()
  const {did} = useParams()

  const foodCounter = useCallback((n) => {
    const newCount = count + n
    if (newCount < 0 ) return; 
    dispatch({
      type: 'newFood',
      food,
      amount: newCount,
      total: newCount * food.price,
      desk: did
    })
  }, [count])

  return (
    <Card
      className="food-card"
      hoverable
    >
      <div className="img-box">
        <img src={`http://localhost:8888/upload/${food.img}`} alt={food.name}></img>
      </div>

      <div className="details">
        <h3>{food.name}</h3>
        <p className="desc">{food.desc || 'Lorem ipsum dolor sit amet'}</p>
        
        <div className="wrap">
          <span className="price"><Icon type="money-collect" /> {food.price}</span>
          <div className="control">
            {
              count !== 0 && 
              <>
                <button className="dec" onClick={() => foodCounter(-1)}></button> 
                <span> {count} </span>
              </>
            }
            <button className="inc" onClick={() => foodCounter(+1)}></button>
          </div>
        </div>
      </div>
    </Card>
  )

}

export default MenuList