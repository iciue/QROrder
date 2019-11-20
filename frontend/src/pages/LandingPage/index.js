import React, {useState, Suspense, useCallback} from 'react'
import {Link} from 'react-router-dom'
import createFetcher from '../../utils/createFetcher'
import api from 'api/index'
import './index.less'

import {Layout, Radio, Carousel} from 'antd'

const fetcher = createFetcher(() => api.get(`deskinfo?rid=1&did=a01`))
function DeskInfo() {
  const deskInfo = fetcher.read().data
  const [custom, setCustom] = useState(0)

  const getDeskButton = useCallback((num) => {
    const arr = []
    for(let i = 0; i < num; i++) {
      arr.push(<Radio.Button 
        key={i} 
        value={i + 1}
        onClick={ () => setCustom(i+1)}> {i + 1}人</Radio.Button>)
    }
    return arr
  }, [])
  
  return (
    <Layout theme="light" className="landing">
      <Carousel autoplay className="carousel-box">
        <div>
          <div style={{backgroundImage: `url(/upload/carousel-1.jpg)`}} ></div>
        </div>
        <div>
          <div style={{backgroundImage: `url(/upload/carousel-2.jpg)`}} ></div>
        </div>
        <div>
          <div style={{backgroundImage: `url(/upload/carousel-3.jpg)`}} ></div>
        </div>
      </Carousel>
      <Layout.Content className="content">
        <h3>选择就餐人数:</h3>
        <Radio.Group buttonStyle="solid">
          { getDeskButton(deskInfo.capacity) }
        </Radio.Group>
        <div className="button">
          <Link to={`/r/1/d/${deskInfo.name}/orderPage?custom=${custom}`}>开始点餐</Link>
        </div>
      </Layout.Content>
    </Layout>
  )
}

function LandingPage() {
  return (
      <Suspense fallback={<div>loading...</div>}>
        <DeskInfo />
      </Suspense>
  )
}

export default LandingPage