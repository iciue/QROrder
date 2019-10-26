import React, {useRef} from 'react'
import api from '../../api/';

function Login(props) {
  const nameRef = useRef()
  const passRef = useRef()

  function tryLogin() {
    const name = nameRef.current.value
    const password = passRef.current.value
    api.post('login', {name, password})
      .then(r => props.history.push('/manage') )
      .catch(e => alert('登录失败'))
  }
  
  return (
    <div>
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

export default Login