import React, {useEffect, useState } from 'react'
import { Link, Switch, Route, useRouteMatch} from 'react-router-dom'
import api from 'api'
import Loading from 'component/Loading'

import './index.less'

import OrderManage from './OrderManage/'
import FoodManage from './FoodManage/'
import DeskManage from './DeskManage/'
import AddFood from './AddFood/'


import { Layout, Menu, Affix } from 'antd';
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;


function RestaurantInfo ({info}) {
  return (
    <>
      <h1 style={{color: "white"}}>餐厅管理系统: {info.title}</h1>
    </>
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
      })
    return () => {}
  }, [])  

  useEffect(() => {
    info && setLoading(false)
  }, [info])

  console.log(path, url);
  
  return (
    <Layout className="manage" >
      <Loading loading={loading}>
        <Header style={{paddingLeft: "16px", backgroundColor: "rgba(1, 1, 1, 0.8)"}} >
          <Loading loading={loading}>
            <RestaurantInfo info={info} />
          </Loading>
        </Header>
        <Layout className="main" hasSider mode="inline">
          <Sider theme="light" className="aside" width="25%">
            <Affix>
              <Menu 
                mode="inline"
                // defaultSelectedKeys={['2']}
                // defaultOpenKeys={['sub1']}
              >
                <Menu.Item key="1">
                  <Link to={{pathname: `${url}/order`, state: 1}} >订单管理</Link>  
                </Menu.Item>

                <SubMenu key='sub1' title={"菜品管理"} inlineIndent={12} >
                  <Menu.Item key="2">
                    <Link to={`${url}/food`} >修改菜品</Link>
                  </Menu.Item>
                  <Menu.Item key="3"> 
                    <Link to={{pathname: `${url}/add-food`, state: info}}>添加菜品</Link> 
                  </Menu.Item>
                </SubMenu>

                <Menu.Item key="4">
                  <Link to={{pathname: `${url}/desk`, state: info}} >桌面管理</Link>  
                </Menu.Item>
              </Menu>
            </Affix>
          </Sider>
          <Content>
            <Switch>
              <Route path={`${path}/order`} component={OrderManage} />
              <Route path={`${path}/food`} component={FoodManage} />
              <Route path={`${path}/desk`} component={DeskManage} />
              <Route path={`${path}/add-food`} component={AddFood} />
            </Switch>
          </Content>
        </Layout>
      </Loading>
    </Layout>
  )
}

export default RestaurantManage