import React, {useRef, useState} from 'react';
import api from '../../../api';


function AddFood () {
  const inputFile = useRef()
  const [food, setFood] = useState({})
  
  function change(e) {
    const prop = e.target.name
    const value = prop === 'img' ? e.target.files[0] :e.target.value
    setFood({
      ...food,
      [prop]: value
    })
  }

  function submit() {
    const fd = new FormData()
    for (let key in food) {
      fd.append(key, food[key])
    }
    console.log(fd);
    api.post(`/restaurant/1/food`, fd)
    .then(r => console.log(r.data))
    .catch(console.log)
  }
  
  return (
    <div>
      
      <div>
        <span>名称: </span>
        <input type="text" onChange={change}  name="name"/>
      </div>
      <div>
        <span>描述: </span>
        <input type="text" onChange={change}  name="desc"/>
      </div>
      <div>
        <span>价格: </span>
        <input type="number" onChange={change}  name="price"/>
      </div>
      <div>
        <span>分类: </span>
        <input type="text" onChange={change}  name="category"/>
      </div>
      <div>
        <span>图片: </span>
        <input type="file" onChange={change}  name="img" ref={inputFile} />
      </div>
      <button onClick={submit} >提交</button>
    </div>
  )
}

export default AddFood
