import { Form, Input, Icon, Row, Col, Button } from 'antd'
import { formItemLayout, formButtonLayout, ax } from 'utils'
import { browserHistory } from 'react-router'
import MapSelecter from 'components/MapSelecter'
import styles from './StoreAdd.less'

class StoreAdd extends React.Component {
  state = {}

  id = this.props.params.id

  componentDidMount = () => {
    if (this.id == 'new') {

    } else {
      ax.get('/stores/' + this.id)
        .then((data) => {
          data.position = data.position.toString()
          delete data.id
          this.props.form.setFieldsValue(data)
          this.refs.map.setPosition(data.position.split(','))
        })
    }
  }

  handleMapClick = (p) => {
    this.props.form.setFieldsValue({
      position: p,
    })
  }

  handleOnChange = (e) => {
    this.refs.map.setAddr(e.target.value)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.position = values.position.split(',').map(v => Number(v))
        if (this.id == 'new') {
          ax.post('/stores', values).then(d => browserHistory.push('/store/manage'))
        } else {
          ax.patch('/stores/' + this.id, values).then(d => browserHistory.push('/store/manage'))
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="content-inner">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item
            {...formItemLayout}
            label="门店名"
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入门店名', whitespace: true }],
            })(
              <Input />
              )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="地址信息"
          >
            {getFieldDecorator('address', {
              rules: [{ required: true, message: '请输入地址信息', whitespace: true }],
            })(
              <Input onChange={this.handleOnChange} />
              )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="坐标"
            extra="点击地图以获取坐标"
          >
            {getFieldDecorator('position', {
              rules: [{ required: true, message: '请输入坐标', whitespace: true }],
            })(
              <Input disabled={true} />
              )}
          </Form.Item>
          <Form.Item
            {...formButtonLayout}
          >
            <MapSelecter ref='map' onChange={this.handleMapClick}></MapSelecter>
          </Form.Item>
          <Form.Item
            {...formButtonLayout}
          >
            <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
            <Button onClick={() => { browserHistory.push('/store/manage') }}>取消</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create()(StoreAdd);
