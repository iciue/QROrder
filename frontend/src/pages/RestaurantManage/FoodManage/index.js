import React, {Suspense, useState} from 'react';
import createFetcher from '../../../utils/createFetcher';
import api from '../../../api';
import { isEqual } from '../../../utils/helper'
import './foodManage.less'
import { Modal, Card, Button, Input, Tooltip  } from 'antd';




/**
 * TODO: 按是否上架排序
 * TODO: 修改时节流
 */

function FoodItem({foodData}) {
  const [food, setFood] = useState(foodData)
  const [isInteger, setIsInteger] = useState(false)
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
    const newVal = foodProp === 'img' ? e.target.files[0] : e.target.value
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
      const fd = new FormData()
      for (const key in changedFood) {
        fd.append(key, changedFood[key])
      }
      console.log(fd);
      api.put(`/restaurant/1/food/${food.id}`, fd)
        .then((res) => {
          setModify(false)
          setFood(res.data)
        })
    }
  }

  function handleCancel() {
    console.log(`cancel`);
    setModify(false)
  }

  function changePrice(e) {
    const val = e.target.value
    const r = /^\d{0,}$/
    if (r.test(val) || val === "") {
      setChangedFood({
        ...changedFood,
        price: val,
      })
    } else {
      setIsInteger(true)
    }
  }

  function getContent() {
    if (isModify) {
      return (
        <Modal 
          title="修改菜品"
          visible={isModify}
          onOk={save}
          onCancel={handleCancel}
        >
          <Input addonBefore="名称" type="text" onChange={change} defaultValue={food.name} name="name"/>
          <Input addonBefore="描述" type="text" onChange={change} defaultValue={food.desc} name="desc"/>
          <Tooltip
            trigger={['focus']}
            visible={isInteger}
            title="请输入整数"
          >
            <Input addonBefore="价格" type="text" onChange={changePrice}  value={changedFood.price} name="price" />
          </Tooltip>
          <Input addonBefore="分类" type="text" onChange={change} defaultValue={food.category} name="category"/>
          <Input type="file" onChange={change}  name="img"/>
        </Modal>
      )
    } else {
      return (
        <div className="content">
          <div className="img-box">
            <img src={`http://localhost:8888/upload/${food.img}`} alt={food.name}></img>
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
    <Card 
      className="food-item"
      actions = {[
      <div>
        <Button onClick={() => setModify(true)}>修改菜品</Button>
        {food.status === 'on' && <Button onClick={ () => changeStatus(false)} >下架</Button>}
        {food.status === 'off' && <Button onClick={ () => changeStatus(true)} >上架</Button>}
        
      </div>
      ]}
    >
      {getContent()}

    </Card>
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
  console.log('foodManage');
  return (
    <div>
      

      <div>
        <Suspense fallback={<div>正在加载...</div>}>
          <FoodList></FoodList>
        </Suspense>
      </div>
    </div>
  )
}

export default FoodManage