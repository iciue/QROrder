import React, {useEffect, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import api from 'api'
import './index.less'

const Login = (props) => {
  const nameRef = useRef()
  const passRef = useRef()
  const history = useHistory()

  function tryLogin() {
    const name = nameRef.current.value
    const password = passRef.current.value
    api.post('login', {name, password})
      .then(r => {
        console.log('登录成功');
        history.push('/manage/food') 
      })
      .catch(e => console.log)
  }
  
  return (
    <div className="login">
      <h3>Login</h3>
      <div>
        <div>
          <input type="text" placeholder="用户名" name="name" ref={nameRef} />
        </div>
        <div>
          <input type="password" placeholder="密码" name="password" ref={passRef} />
        </div>
        <button onClick={tryLogin} >登录</button>
      </div>
    </div>
  )
}

function HomePage(props) {

  useEffect(() => {
    api.get('userinfo')
      .then(res => {
        props.history.push('/manage')
      })
      .catch(e => console.log)
  })

  return (
    <div className="login-wrap">
      <Login />
      <button className="register" disabled style={{backgroundColor: '#ccc', opacity: '.3'}}>注册</button>
      <span>测试账户:aa. 密码:aa</span>
      {/* <Tip text="测试账户:aa. 密码:aa">
        <span>
          <Link className="register" to="register">register</Link>
        </span>
      </Tip> */}
    </div>
  )
}



export default HomePage