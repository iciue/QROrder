import React, {useState, Suspense} from 'react';
import api from '../../../api';

import { isEqual } from '../../../utils/helper'
import createFetcher from '../../../utils/createFetcher';


/**
 * 桌面管理, 进入页面时请求桌面数据. 数据未请求到时展示 fallback 组件
 * 
 * TODO: 商户的后台管理应显示当前桌面是否有人就餐 ( >> 根据桌面查询订单表是否有人正在就餐)
 */

function DeskItem({deskInfo, deleteItem}) {
  const [desk, setDesk] = useState(deskInfo)
  const [isModify, setIsModify] = useState(false)

  let changedDesk = {...desk};

  function changeItem(e) {
    const key = e.target.name
    const val = e.target.value
    changedDesk[key] = val
    }

  function save() {
    if (isEqual(changedDesk, deskInfo)) {
      console.log('未修改')
      setIsModify(false)
    } else {
      console.log(`/restaurant/1/desk/${desk.id}`);
      api.put(`/restaurant/1/desk/${desk.id}`, changedDesk)
        .then((res) => {
          setIsModify(false)
          console.log(res.data);
          setDesk(res.data)
        })
        .catch(e => {
          alert(`网络错误`)
          setIsModify(false)
        })
    }
  }

  function getContent() {
    if(isModify) {
      return (
        <div>
          <div>
            <span>桌号:</span> <input type="text" onChange={changeItem} defaultValue={desk.name} name="name" />
          </div>
          <div>
            <span>座位:</span> <input type="text" onChange={changeItem} defaultValue={desk.capacity} name="capacity" />
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <p>桌号: {desk.name}</p>
          <p>座位: {desk.capacity}</p>
        </div>
      )
    }
  }

  return (
    <li>
      {getContent()}
      {
        isModify ? <button onClick={save} >保存</button>
                 : <button onClick={() => setIsModify(true)} >修改</button>
      }
      <button onClick={ () => deleteItem(desk.id) } >删除</button>
    </li>
  )
}

const fetcher = createFetcher(() => api.get(`/restaurant/1/desk`))
function DeskList() {
  const desks = fetcher.read().data

  function deleteItem(deskId) {
    api.delete(`/restaurant/1/desk/${deskId}`)
    .then(r => {
      console.log('删除成功');
    })
    .catch(console.log)
  }


  return (
    <div>
      <ul>
        { desks.map( (desk, idx) => <DeskItem key={idx} deskInfo={desk} deleteItem={deleteItem}/>)}
      </ul>
    </div>
  )
}

function DeskManage() {

  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        <DeskList></DeskList>
      </Suspense>
    </div>
  )
}

export default DeskManage