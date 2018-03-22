import { Form, Row, Col, Input, Button, Icon, InputNumber } from 'antd'
import { formItemLayout, formButtonLayout } from 'utils';
const FormItem = Form.Item

class AttendanceRules extends React.Component {

  componentDidMount() {

  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">考勤设置</div>
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label={`上班打卡提前有效时长`} extra={<span><Icon type="exclamation-circle" /> 上班前x分钟可以打卡</span>} >
                {getFieldDecorator(`before`, {
                  rules: [{ required:true, pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数' }]
                })(
                  <Input addonAfter={'分钟'} style={{ width: '100%' }} />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label={`下班打卡提前有效时长`} extra={<span><Icon type="exclamation-circle" /> 下班后x分钟可以打卡</span>} >
                {getFieldDecorator(`after`, {
                  rules: [{ required:true, pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数' }]
                })(
                  <Input addonAfter={'分钟'} style={{ width: '100%' }} />
                  )}
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


export default Form.create()(AttendanceRules)
