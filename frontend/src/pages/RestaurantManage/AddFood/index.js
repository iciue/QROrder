import React, {} from 'react';
import {useLocation} from 'react-router-dom'
import {
  Form,
  Input,
  Icon,
  Upload,
  Button,
} from 'antd';

import api from 'api';

function AddFood ({form}) {
  const { getFieldDecorator} = form
  const {rid} = useLocation().state.id

  function submit(e) {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
      } else {
        const fd = new FormData()
        console.log(values);
        for (let key in values) {
          let val;
          if (key === 'img' )  val = values[key] && values[key][0].originFileObj
          else val = values[key]
          (typeof val === 'string') && (val = val.trim())
          fd.append(key, val)
        }
        api.post(`/restaurant/${rid}/food`, fd)
        .then(r => {
          console.log('ok');
          console.log(r.data)
        })
        .catch(console.log)
      }
    });
  }

  const normFile = info => {
    return info.fileList.length ? info.fileList.slice(-1) : info.fileList
  };
  
  return (
    <Form onSubmit={submit}>
      <Form.Item label="菜品名称" >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入菜名!' }],
          })(
            <Input />,
          )}
      </Form.Item>
      <Form.Item label="菜品描述">
          {getFieldDecorator('desc', {
            rules: [{ required:  false, message: '请输入菜品描述!' }],
          })(
            <Input />
          )}
      </Form.Item>
      <Form.Item label="价格">
          {getFieldDecorator('price', {
            rules: [{ 
              required: true, 
              type: "integer",
              message: '请输入整数!',
              transform(value) {
                return Number(value);
              }}],
          })(
            <Input type="number" />
          )}
      </Form.Item>
      <Form.Item label="分类">
          {getFieldDecorator('category', {
            
          })(
            <Input />
          )}
      </Form.Item>      
      <Form.Item label="菜品图片" extra="点击上传菜品图片">
          {getFieldDecorator('img', {
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
          })(
            <Upload name="logo" beforeUpload={() => false}  listType="picture"  >
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>,
          )}
        </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" >
          添加菜品
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create({})(AddFood)
