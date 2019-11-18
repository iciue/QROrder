import React, {useState, useEffect, useReducer, useContext, useRef, useMemo, useCallback} from 'react';
import {useLocation} from 'react-router-dom'
import api from '../../../api';
import Loading from '../../../component/Loading';

import {Input, Card, Button} from 'antd'
const {Search} = Input

const DeskDispatch = React.createContext(null)

const deskReducer = (state, action) => {
  switch (action.type) {
    case 'getDeskInfo': // 初始化
      return {
        ...state,
        desks: action.data
      }

    case 'update': // 修改桌面
      return {
        ...state,
        desks: state.desks.map( d => d.id === action.desk.id ? {...action.desk} : d)
      }

    case 'delete': // 修改桌面
      return {
        ...state,
        desks: state.desks.filter(d => d.id !== action.did)
      }

    case 'setLoading': // loading 组件显示状态
      return {
        ...state,
        loading: false
      }
  
    default:
      return state
  }
}


const DeskItem = ({desk}) => {
  const [isModify, setIsModify] = useState(false)
  const [changedDesk, setChangedDesk] = useState({...desk})
  const dispatch = useContext(DeskDispatch)
  const rid = useLocation().state.id

  const changeItem = useCallback((e) => {
    const key = e.target.name
    const val = e.target.value
    setChangedDesk((d) => ({...d, [key]: val}))
  })
  
  const save = () => {
    console.log(changedDesk);
    api.put(`/restaurant/${rid}/desk/${desk.id}`, changedDesk)
      .then(res => {
        dispatch({
          type: 'update',
          desk: changedDesk,
        })
        setIsModify(false)
      })
  }

  const deleteItem = () => {
    api.delete(`/restaurant/${rid}/desk/${desk.id}`)
      .then(r => {
        dispatch({
          type: 'delete',
          did: desk.id
        })
      })
      .catch(console.log)
  }

  const getContent = () => {
    if (isModify) {
      return (
        <div>
          <Input addonBefore="桌号:"  defaultValue={desk.name} onChange={changeItem} name="name" />
          <Input addonBefore="座位数:"  defaultValue={desk.capacity} onChange={changeItem} name="capacity" />
        </div>
      )
    } else {
      return (
        <div>
          <p>桌号: {desk.name}</p>
          <p>座位数: {desk.capacity}</p>
        </div>
      )
    }
  }

  return (
    <Card
      actions={[
        isModify ? 
        <Button onClick={save}>保存</Button> 
        : <Button onClick={() => setIsModify(true)}>修改</Button>,
        <Button onClick={deleteItem}>删除</Button>
      ]}
    >
      {
        getContent()
      }
    </Card>
  )
}

const DeskList = ({desks}) => {

  const findDesk = (e) => {
    console.log(e);
    // desks.find(d => d.name === val)
  }

  return (
    <div>
      <Search 
        placeholder="input search desk" 
        onChange={findDesk} 
        enterButton />
      <div>
        { desks.map(d => <DeskItem key={d.id} desk={d} />)}
      </div>
    </div>
  )
}

const DeskManage = () => {
  const [state, dispatch] = useReducer(deskReducer, {desks: [], loading: true});
  const rid = useLocation().state.id

  useEffect( () => {
    api.get(`/restaurant/${rid}/desk`)
      .then(res => {
        dispatch({type: 'getDeskInfo', data: res.data})
        // dispatch({type: 'setLoading'})
        setTimeout(() => dispatch({type: 'setLoading'}) , 1000);
      }) 
    return () => {}
  }, [])

  return (
    <Loading loading={state.loading}>
      <DeskDispatch.Provider value={dispatch}>
        <DeskList desks={state.desks}></DeskList>
      </DeskDispatch.Provider>
    </Loading>
  )
}


export default DeskManage