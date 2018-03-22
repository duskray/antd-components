import { Form, Row, Col, Input, Button, Icon, InputNumber, Spin } from 'antd'
import { formItemLayout, formButtonLayout, ax } from 'utils';
const FormItem = Form.Item

class Member extends React.Component {
  state = {
    loading: false,
  }

  getRules = () => {
    this.setState({
      loading: true
    })
    ax.get(`/system/member`)
    .then(d => {
      this.props.form.setFieldsValue(d)
      this.setState({
        loading: false
      })
    }).catch(_ => {
      this.setState({
        loading: false
      })
    })
  }

  componentDidMount() {
    this.getRules()
  }


  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        ax.patch(`/system/member`, values)
        .then(d => {
          this.getRules()
        }).catch(e => {
          this.setState({
            loading: false
          })
        })
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">会员年费设置</div>
          <div className="panel-body">
            <Spin spinning={this.state.loading}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label={`会员年费原价`}>
                {getFieldDecorator(`originalPrice`, {
                  rules: [{ pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数' }]
                })(
                  <Input addonAfter={'.00'} style={{ width: '100%' }} />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label={`会员年费执行价`}>
                {getFieldDecorator(`price`, {
                  rules: [{ required:true, pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数' }]
                })(
                  <Input addonAfter={'.00'} style={{ width: '100%' }} />
                  )}
              </FormItem>
              <Form.Item
                {...formItemLayout}
                label="会员购买说明"
              >
                {getFieldDecorator('description')(
                  <Input.TextArea rows={4} />
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


export default Form.create()(Member)
