import { Form, Input, Button, Select, Icon, Spin } from 'antd';
import { formItemLayout, formButtonLayout } from 'utils';
import { browserHistory } from 'react-router'
import { ax } from 'utils'

class AccountAdd extends React.Component {
  state = {
    loading: true,
    roles: [],
    stores: [],
  }

  id = this.props.params.id

  renderRoles = (roles) => roles.map(v => <Select.Option key={v.id} value={v.id.toString()}>{v.name}</Select.Option>)
  renderStores = (roles) => roles.map(v => <Select.Option key={v.id} value={v.id.toString()}>{v.name}</Select.Option>)

  componentDidMount = () => {
    ax.all([ax.get('/roles'), ax.get('/stores')])
      .then(ax.spread((roles, stores) => {
        this.setState({
          roles: roles.roles,
          stores: stores.stores,
        }, () => {
          if (this.id == 'new') {

          } else {
            ax.get('/accounts/' + this.id)
              .then((d) => {
                this.id = d.id
                delete d.id
                d.roleId = d.roleId.toString()
                this.props.form.setFieldsValue(d)
              })
          }
          this.setState({
            loading: false
          })
        })
      })
    ).catch(e => {
      this.setState({
        loading: false
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.id == 'new') {
          ax.post('/accounts', values).then(d => browserHistory.push('/account/manage'))
        } else {
          values.id = this.id
          ax.patch('/accounts/' + this.id, values).then(d => browserHistory.push('/account/manage'))
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="content-inner">
        <Spin spinning={this.state.loading}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              {...formItemLayout}
              label="账号"
            >
              {getFieldDecorator('account', {
                rules: [{ required: true, message: '请输入账号', whitespace: true }],
              })(
                <Input />
                )}
            </Form.Item>
            {this.id == 'new' ? (
              <Form.Item
                {...formItemLayout}
                label="密码"
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码', whitespace: true }],
                })(
                  <Input type="password" />
                  )}
              </Form.Item>
            ) : null}
            <Form.Item
              {...formItemLayout}
              label="手机号"
            >
              {getFieldDecorator('cellNumber')(
                <Input addonBefore="+86" style={{ width: '100%' }} />
                )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="姓名"
            >
              {getFieldDecorator('name')(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="角色"
            >
              {getFieldDecorator('roleId', {
                rules: [{ required: true, message: '请选择角色' }],
              })(
                <Select placeholder="请选择角色">
                  {this.renderRoles(this.state.roles)}
                </Select>
                )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="所属部门"
              help={<span><Icon type="exclamation-circle" /> 如果没有门店信息，请在<a href="javascript:;" onClick={_ => { browserHistory.push('/store/manage') }}>门店管理</a>中添加</span>}
            >
              {getFieldDecorator('storeId', {
                rules: [{ required: true, message: '请选择所属部门' }],
              })(
                <Select placeholder="请选择所属部门">
                  {this.renderStores(this.state.stores)}
                </Select>
                )}
            </Form.Item>


            <Form.Item
              {...formButtonLayout}
            >
              <Button className="margin-right" type="primary" htmlType="submit" >保存</Button>
              <Button onClick={() => { browserHistory.push('/account/manage') }}>取消</Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    )
  }
}

export default Form.create()(AccountAdd);
