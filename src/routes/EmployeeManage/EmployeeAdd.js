import { Form, Input, Button, DatePicker, Radio, Select } from 'antd'
import { browserHistory } from 'react-router'
import { PicturesWall, StoreSelecter } from 'components'
import { formItemLayout, formButtonLayout, ax } from 'utils'
import moment from 'moment'
const Item = Form.Item
const { TextArea } = Input  
const RadioButton = Radio.Button  
const RadioGroup = Radio.Group  
const Option = Select.Option  

class EmployeeAdd extends React.Component {

  state = {
    type:'0',
    services: [],
    employees: [],
  }

  id = this.props.params.id
  sid = this.props.params.sid

  renderService = () => this.state.services.map(v => <Select.Option key={v.id} value={v.id.toString()}>{v.name}</Select.Option>)
  renderEmployee = (ts) => {
    if (ts == 'teacher') {

      return this.state.employees.filter(v => v.id != this.id && v.type == 1).map(v => <Select.Option key={v.id} value={v.id.toString()}>{v.name}</Select.Option>)
    } else {
      return this.state.employees.filter(v => v.id != this.id && v.type == 0).map(v => <Select.Option key={v.id} value={v.id.toString()}>{v.name}</Select.Option>)      
    }
  } 

  componentDidMount = () => {
    ax.all([ax.get(`/stores/${this.sid}/services`), ax.get(`/stores/${this.sid}/employees`, {
      keyword: '',    
      current: 1,     
      pageSize: 999,  
      field:'',   
      order: '' 
    })])
      .then(ax.spread((services, employees) => {
        this.setState({
          services: services.services ? services.services : [],
          employees: employees.employees ? employees.employees : [],
        }, () => {
          if (this.id == 'new') {

          } else {
            console.log(3)
            ax.get(`/stores/${this.sid}/employees/${this.id}`)
              .then((d) => {
                this.id = d.id
                delete d.id
                // d.roleId = d.roleId.toString()
                d.entryTime = moment(d.entryTime)
                
                this.setState({
                  type: d.type
                }, _ => {
                  this.refs.img.setImg([d.img])
                  this.props.form.setFieldsValue(d)
                })
                
              })
          }
        })
      }))
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      fieldsValue.entryTime = fieldsValue['entryTime'].format('YYYY-MM-DD')
      fieldsValue.img = this.refs.img.getImgId()[0]
      console.log(fieldsValue)
      if (this.id == 'new') {
        ax.post(`/stores/${this.sid}/employees`, fieldsValue).then(d => browserHistory.push('/employee/manage'))
      } else {
        ax.patch(`/stores/${this.sid}/employees/${this.id}`, fieldsValue).then(d => browserHistory.push('/employee/manage'))
      }
    })
  }

  handleRadioChange = (e) => {
    this.setState({type: e.target.value})
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const otherItems = () => {
      switch(this.state.type) {
        case '0': return (
          <div>
            <Item
              {...formItemLayout}
              label="技师介绍"
            >
              {getFieldDecorator('des')(
                <TextArea rows={4} />
              )}
            </Item>
            <Item
              {...formItemLayout}
              label="服务项目"
            >
              {getFieldDecorator('service')( 
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择服务项目"
                >
                  {this.renderService()}
                </Select>
              )}
            </Item>
            <Item
            {...formItemLayout}
            label="老师"
            >
              {getFieldDecorator('teacher')(
                <Select
                  showSearch
                  placeholder="请选择老师"
                >
                  {this.renderEmployee('teacher')}
                </Select>
              )}
            </Item>
            <Item
            {...formItemLayout}
            label="从业时间"
            >
              {getFieldDecorator('workTime', {
                  rules: [{ required: true, message: '请输入从业时间', whitespace: true }],
                })(
                <Input />
              )}
            </Item>
          </div>
        )
        case '1': return (
          <div>
            <Item
              {...formItemLayout}
              label="技师介绍"
            >
              {getFieldDecorator('des')(
                <TextArea rows={4} />
              )}
            </Item>
            <Item
              {...formItemLayout}
              label="服务项目"
            >
              {getFieldDecorator('service')( 
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择服务项目"
                >
                  {this.renderService()}
                </Select>
              )}
            </Item>
            <Item
            {...formItemLayout}
            label="下属技师"
            >
              {getFieldDecorator('student')(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择下属技师"
                >
                  {this.renderEmployee('student')}
                </Select>
              )}
            </Item>
            <Item
            {...formItemLayout}
            label="从业时间"
            >
              {getFieldDecorator('workTime', {
                  rules: [{ required: true, message: '请输入从业时间', whitespace: true }],
                })(
                <Input />
              )}
            </Item>
          </div>
        )
        default: return (<div></div>)
      }
    }
  

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>填写员工信息</span>
            <Button type="primary" style={{float:'right', marginTop: '-3px'}} onClick={() => { browserHistory.push(`/employee/transfer/${this.sid}`) }}>调入其他门店员工</Button>
          </div>
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <Item
                {...formItemLayout}
                label="手机号码"
              >
                {getFieldDecorator('tel', {
                  rules: [{ required: true, message: '请输入手机号码', whitespace: true }],
                })(
                  <Input />
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="姓名"
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入姓名', whitespace: true }],
                })(
                  <Input />
                )}
              </Item>
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
              <Item
                {...formItemLayout}
                label="身份证号码"
              >
                {getFieldDecorator('idNumber', {
                  rules: [{ required: true, message: '请输入身份证号码', whitespace: true }],
                })(
                  <Input />
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="入职时间"
              >
                {getFieldDecorator('entryTime', {
                  rules: [{ type: 'object', required: true, message: '请选择入职时间', whitespace: true }],
                })(
                  <DatePicker />
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="工号"
              >
                {getFieldDecorator('employeeNum', {
                  rules: [{ required: true, message: '请输入工号', whitespace: true }],
                })(
                  <Input />
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="员工照片"
              >
                  <PicturesWall ref="img" limit="1"></PicturesWall>
              </Item>
              <Item
                {...formItemLayout}
                label="职位"
              >
                {getFieldDecorator('type', {
                  initialValue: '0'
                })(
                  <RadioGroup onChange={this.handleRadioChange}>
                    <RadioButton value="0">技师</RadioButton>
                    <RadioButton value="1">技师老师</RadioButton>
                    <RadioButton value="2">迎宾</RadioButton>
                    <RadioButton value="3">保洁</RadioButton>
                    <RadioButton value="4">吧台</RadioButton>
                    <RadioButton value="5">店长</RadioButton>
                    <RadioButton value="6">店长助理</RadioButton>
                  </RadioGroup>
                )}
              </Item>
              
              {otherItems()}
              
              
              
              
              <Item
                {...formButtonLayout}
              >
                <Button onClick={_=>browserHistory.push('/employee/manage')} className="margin-right">取消</Button>
                <Button type="primary" htmlType="submit" >保存</Button>
              </Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(EmployeeAdd)