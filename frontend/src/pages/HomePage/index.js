import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'

import api from '../../api'

function HomePage(props) {
  console.log(props);

  useEffect(() => {
    api.get('userinfo')
      .then(res => {
        console.log(res.data);
        props.history.push('/manage')
      })
      .catch(e => {
      })
  })

  return (
    <div>
      HomePage
      <div>
        <Link to="login">login</Link>
      </div>
      <div>
        <Link to="register">register</Link>
      </div>
    </div>
  )
}

export default HomePage