import React, {useState, Suspense} from 'react'
import {Link} from 'react-router-dom'
import createFetcher from '../../utils/createFetcher'
import api from './../../api/index'


/**
 * 顾客扫码后进入该落地页, 显示当前桌面的信息和开始点餐按钮.
 */

const fetcher = createFetcher(() => api.get(`deskinfo?rid=1&did=a01`))
function DeskInfo() {
  const deskInfo = fetcher.read().data
  const [custom, setCustom] = useState(0)

  function getDeskButton(num) {
    const arr = []
    for(let i = 0; i < num; i++) {
      arr.push(React.createElement('li', {
        key: i,
        className: (custom === i + 1 ? 'active' : null),
        onClick: ()  => {setCustom(i + 1)}
      } , `${i+1}人`))
    }
    return arr
  }
  
  return (
    <div>
      <h3>请选择就餐人数:</h3>
      <ul>
        { getDeskButton(deskInfo.capacity) }
      </ul>
      <Link to={`/r/1/d/${deskInfo.name}/orderPage?custom=${custom}`}>开始点餐</Link>
    </div>
  )
}

function LandingPage() {
  return (
    <div>
      LandingPage
      <Suspense fallback={<div>loading...</div>}>
        <DeskInfo />
      </Suspense>
    </div>
  )
}

export default LandingPage