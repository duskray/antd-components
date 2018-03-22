import { Form, Input, Button, Checkbox } from 'antd';
import { browserHistory } from 'react-router'
import { formItemLayout, formButtonLayout } from 'utils';
import { arrayToTree, ax } from 'utils'

class RoleAdd extends React.Component {

  state = {
    menus: []
  }
  sid = this.props.params.sid
  rid = this.props.params.rid

  componentDidMount() {
    if (this.rid != 'new') {
      ax.get(`/stores/${this.sid}/rooms/${this.rid}`)
      .then(d => {
        this.rid = d.id
        delete d.id
        this.props.form.setFieldsValue(d)
      })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.props.form.getFieldsValue())
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (this.rid == 'new') {
          ax.post(`/stores/${this.sid}/rooms`, values).then(d => browserHistory.push('/room/manage'))
        } else {
          ax.patch(`/stores/${this.sid}/rooms/${this.rid}`, values).then(d => browserHistory.push('/room/manage'))
        }
      }
    });
  }

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">填写房间信息</div>
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <Form.Item {...formItemLayout} label="房间名">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入房间名', whitespace: true }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="床位数">
                {getFieldDecorator('bedQuantity', {
                  rules: [{ 
                    required: true, message: '请输入床位数', whitespace: true
                  },{
                    pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数'
                  }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...formButtonLayout}>
                <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                <Button onClick={() => { browserHistory.push('/room/manage') }}>取消</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(RoleAdd);
