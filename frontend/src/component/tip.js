import React, {useState, seEffect, useRef} from 'react'

const tipStyle = {
  position: 'absolute',
  transition: 'all 0.2s ease'
}

const tipwrap = {
  position: 'relative'
}

/**
 * 1. 定位在父元素
 * 2. 计算位置, 再赋值给元素 (✔️)
 */

const Tip = (props) => {
  console.log(props)
  const [visible, setVisible] = useState(props.visible || true)

  return (
    <div className={props.className} style={tipwrap}>
      {visible && <span style={tipStyle} >{props.text}</span>}
      {props.children}
    </div>
  )
}


export default Tip