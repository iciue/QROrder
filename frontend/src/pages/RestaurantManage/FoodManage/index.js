import React, {Suspense, useState} from 'react';
import { Link } from 'react-router-dom'
import createFetcher from '../../../utils/createFetcher';
import api from '../../../api';
import { isEqual } from '../../../utils/helper'

import './foodManage.css'

/**
 * TODO: 按是否上架排序
 * TODO: 修改时防抖
 */

function FoodItem({foodData}) {
  const [food, setFood] = useState(foodData)
  const [isModify, setModify] = useState(false)
  const [changedFood, setChangedFood] = useState({...food})

  function changeStatus(flag) {
    api.put('/restaurant/1/food/' + food.id, {
      ...food,
      status: flag ? 'on' : 'off' ,
    }).then(res => {
      console.log(res.data);
      setFood(res.data)
    })
  }
  function change(e) {
    const foodProp = e.target.name
    const newVal = e.target.value
    setChangedFood({
      ...changedFood,
      [foodProp]: newVal,
    })
  }
  function save() {
    // save 时对比 修改后的菜品信息是否和原来的一样
    if (isEqual(changedFood, food)) {
      console.log('未修改')
      setModify(false)
    } else {
      api.put(`/restaurant/1/food/${food.id}`, {...changedFood})
        .then((res) => {
          setModify(false)
          setFood(res.data)
        })
    }
  }

  function getContent() {
    if (isModify) {
      return (
        <div>
          <div>
            <span>名称: </span>
            <input type="text" onChange={change} defaultValue={food.name} name="name"/>
          </div>
          <div>
            <span>描述: </span>
            <input type="text" onChange={change} defaultValue={food.desc} name="desc"/>
          </div>
          <div>
            <span>价格: </span>
            <input type="text" onChange={change} defaultValue={food.price} name="price"/>
          </div>
          <div>
            <span>分类: </span>
            <input type="text" onChange={change} defaultValue={food.category} name="category"/>
          </div>
          <div>
            <span>图片: </span>
            <input type="text" onChange={change} defaultValue={food.img} name="img"/>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div>
            <img src="http://localhost:8888/upload/default.png" alt={food.name}></img>
          </div>
          <div>
            <p>名称: {food.name}</p>
            <p>描述: {food.desc}</p>
            <p>价格: {food.price}</p>
            <p>分类: {food.category}</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="food-item">
      {getContent()}

      <div className="control">
        { isModify ? <button onClick={save}>保存菜品</button>
                   : <button onClick={() => setModify(true)}>修改菜品</button>
        }

        {food.status === 'on' && <button onClick={ () => changeStatus(false)} >下架</button>}
        {food.status === 'off' && <button onClick={ () => changeStatus(true)} >上架</button>}
        
      </div>
    </div>
  )
}

const fetcher = createFetcher( () => api.get('/restaurant/1/food'))
function FoodList() {
  const foods = fetcher.read().data

  return (
    <div>
      {
        foods.map((food, idx) => <FoodItem key={idx} foodData={food} /> )
      }
    </div>
  )
}

function FoodManage() {

  return (
    <div>
      <h2>FoodManage</h2>
      <Link to="manage/add-food">添加菜品</Link>

      <div>
        <Suspense fallback={<div>正在加载...</div>}>
          <FoodList></FoodList>
        </Suspense>
      </div>
    </div>
  )
}

export default FoodManage