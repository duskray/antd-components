import { Form, Row, Col, Input, Button, Spin } from 'antd'
import { formItemLayout, formButtonLayout, ax } from 'utils'
import { browserHistory } from 'react-router'
const FormItem = Form.Item

class Password extends React.Component {
  state = {
    loading: true,
  }
  uid = 0

  componentDidMount() {
    ax.get('/user').then(d => {
      this.uid = d.id
      this.setState({
        loading: false
      })
    })
  }


  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password === values.password2) {
          this.setState({
            loading: true
          })
          ax.patch(`/accounts/${this.uid}/password`, {
            password: values.password
          }).then(_ => {
            browserHistory.push('/')
          })
        } else {
          this.props.message.warn('两次输入的密码不一致')
        }
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">修改密码</div>
          <div className="panel-body">
            <Spin spinning={this.state.loading}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入新密码', whitespace: true }],
                })(
                  <Input type="password" placeholder="请输入新密码"/>
                  )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator('password2', {
                  rules: [{ required: true, message: '请再次输入新密码', whitespace: true }],
                })(
                  <Input type="password" placeholder="请再次输入新密码" />
                  )}
              </Form.Item>
              <hr />
              <FormItem {...formButtonLayout}>
                <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
              </FormItem>
            </Form>
            </Spin>
          </div>
        </div>
      </div>
    )
  }
}


export default Form.create()(Password)
