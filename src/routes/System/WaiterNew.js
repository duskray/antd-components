import { Form, Input, Button, Icon, InputNumber } from 'antd'
import { formItemLayout, formButtonLayout, ax } from 'utils';
const FormItem = Form.Item

class WaiterNew extends React.Component {
  
  componentDidMount() {
    ax.get(`/system/new-waiter-rules`)
    .then(d => {
      this.props.form.setFieldsValue(d)
    })
  } 


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        ax.patch(`/system/new-waiter-rules`, values)
      }
    });
  }


  render () {
    const { getFieldDecorator } = this.props.form
    
    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">技师推新规则</div>
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                help={<span><Icon type="exclamation-circle" /> 入职后设定天数内会有新技师标签</span>}
                label="推新天数"
              >
                {getFieldDecorator(`days`)(
                  <InputNumber min={0} style={{width: '200px'}}/>
                )}
                天
              </FormItem>
              <hr />
              <FormItem {...formButtonLayout}>
                <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}


export default Form.create()(WaiterNew)
