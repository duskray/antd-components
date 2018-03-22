import { Form, Row, Col, Input, Button, Select } from 'antd'
import { formItemLayout, formButtonLayout, getPopupContainer, ax } from 'utils'
import _ from 'lodash'
const FormItem = Form.Item


class BehaviorEntryRules extends React.Component {

  state = {
    loading: false,
    receptionist: [],
    waiter: [],
  }
  typeIndex = {
    receptionist: 0,
    waiter: 0,
  }

  getRules = () => {
    this.typeIndex = {
      receptionist: 0,
      waiter: 0,
    }
    this.setState({
      loading: true,
      receptionist: [],
      waiter: [],
    })
    ax.get(`/system/behavior-entry-rules`)
    .then(d => {
      const fv = d
      d.waiter = d.waiter.map(v => {
        v.id = this.typeIndex.waiter++
        return v
      })
      d.receptionist = d.receptionist.map(v => {
        v.id = this.typeIndex.receptionist++
        return v
      })
      
      this.setState({
        loading: false,
        receptionist: d.receptionist,
        waiter: d.waiter,
      }, _ => {
        console.log(fv)
        this.props.form.setFieldsValue({
          receptionist: fv.receptionist || undefined,
          waiter: fv.waiter || undefined,
        })
      })
      // setTimeout(e => {
      //   this.props.form.setFieldsValue(fv)
      // }, 3000)
      
    }).catch(_ => {
      this.setState({
        loading: false,
      })
    })
  }

  componentDidMount() {
    this.getRules()
  }


  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {

        values.receptionist = values.receptionist ? values.receptionist.filter(v => v && v.name && v.tags && v.tags.length > 0) : []

        values.waiter = values.waiter ? values.waiter.filter(v => v && v.name && v.tags && v.tags.length > 0) : []
        console.log('Received values of form: ', values)
        ax.patch(`/system/behavior-entry-rules`, {
          data: JSON.stringify(values)
        }).then(_ => {
          // this.getRules()

          // ax.get(`/system/behavior-entry-rules`)
          // .then(d => {
          //   typeIndex = {
          //     receptionist: 0,
          //     waiter: 0,
          //   }
          //   d.waiter = d.waiter.map(v => {
          //           v.id = typeIndex.waiter++
          //           return v
          //         })
          //         d.receptionist = d.receptionist.map(v => {
          //           v.id = typeIndex.receptionist++
          //           return v
          //         })


          //         this.setState({
          //           loading: false,
          //           receptionist: d.receptionist,
          //           waiter: d.waiter,
          //         }, _ => {
          //           this.props.form.setFieldsValue(d)
          //         })

          // })

        }).catch(e => {
          this.setState({
            loading: false
          })
        })
      }
    });
  }

  addType = (k) => {
    this.setState((prevState, props) => {
      let newState = _.clone(prevState)
      newState[k].push({
        id: this.typeIndex[k]++,
        name: '',
        tags: [],
      })
      return newState
    })
  }

  removeType = (k, id) => {
    if (this.state[k].length <= 1) {
      return;
    }

    this.setState((prevState, props) => {
      let newState = _.clone(prevState)
      newState[k] = _.filter(newState[k], (o) => (o.id !== id))

      return newState
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayoutExtra = {
      wrapperCol: { xs: { span: 24 }, sm: { span: 20 } }
    }

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <Row gutter={8}>
                <Col span={4}>
                  <div style={{ width: '100%', height: '28px', lineHeight: '28px', fontWeight: 'bold', fontSize: '14px'}}>
                    <span>迎宾录入</span>
                  </div>
                </Col>  
                <Col span={16}>
                </Col>
                <Col span={4} style={{textAlign: 'center'}}>
                  <Button type="primary" onClick={this.addType.bind(null, 'receptionist')}>新建类别</Button>
                </Col>
              </Row>
              <hr />
              {this.state.receptionist.map((v, i, list) => (
                <div key={'receptionist' + v.id}>
                  <Row gutter={8} style={{ marginBottom: '10px' }}>
                    <Col span={4}>
                      <div style={{ width: '100%', textAlign: 'right', height: '28px', lineHeight: '28px' }}>
                        <label htmlFor={`receptionist[${v.id}].name`} title="类别名称">类别名称</label>
                      </div>
                    </Col>
                    <Col span={16}>
                      {getFieldDecorator(`receptionist[${v.id}].name`)(
                        <Input />
                        )}
                    </Col>
                    <Col span={4} style={{textAlign: 'center'}}>
                      {list.length <= 1 ? null : <Button onClick={this.removeType.bind(null, 'receptionist', v.id)}>删除类别</Button>}
                    </Col>
                  </Row>
                  <Row gutter={8} style={{ marginBottom: '10px' }}>
                    <Col span={4}>
                      <div style={{ width: '100%', textAlign: 'right', height: '28px', lineHeight: '28px' }}>
                        <label htmlFor={`receptionist[${v.id}].tags`} title="类别词汇">类别词汇</label>
                      </div>
                    </Col>
                    <Col span={16}>
                      {getFieldDecorator(`receptionist[${v.id}].tags`)(
                        <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签">
                        </Select>
                        )}
                    </Col>
                    <Col span={4}>
                    </Col>
                  </Row>
                  <hr />
                </div>
              ))}
              <Row gutter={8}>
                <Col span={4}>
                  <div style={{ width: '100%', height: '28px', lineHeight: '28px', fontWeight: 'bold', fontSize: '14px'}}>
                    <span>技师录入</span>
                  </div>
                </Col>
                <Col span={16}>
                </Col>
                <Col span={4} style={{textAlign: 'center'}}>
                  <Button type="primary" onClick={this.addType.bind(null, 'waiter')}>新建类别</Button>
                </Col>
              </Row>
              <hr /> 
              {
                this.state.waiter.map((v, i, list) => (
                  <div key={'waiter' + v.id}>
                    <Row gutter={8} style={{ marginBottom: '10px' }}>
                      <Col span={4}>
                        <div style={{ width: '100%', textAlign: 'right', height: '28px', lineHeight: '28px' }}>
                          <label htmlFor={`waiter[${v.id}].name`} title="类别名称">类别名称</label>
                        </div>
                      </Col>
                      <Col span={16}>
                        {getFieldDecorator(`waiter[${v.id}].name`)(
                          <Input />
                          )}
                      </Col>
                      <Col span={4} style={{textAlign: 'center'}}>
                        {list.length <= 1 ? null : <Button onClick={this.removeType.bind(null, 'waiter', v.id)}>删除类别</Button>}
                      </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: '10px' }}>
                      <Col span={4}>
                        <div style={{ width: '100%', textAlign: 'right', height: '28px', lineHeight: '28px' }}>
                          <label htmlFor={`waiter[${v.id}].tags`} title="类别词汇">类别词汇</label>
                        </div>
                      </Col>
                      <Col span={16}>
                        {getFieldDecorator(`waiter[${v.id}].tags`)(
                          <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                          )}
                      </Col>
                      <Col span={4}>
                      </Col>
                    </Row>
                    <hr />
                  </div>
                ))
              }
              <Row gutter={8}>
                <Col span={4}>
                </Col>
                <Col span={16}>
                  <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                </Col>
                <Col span={4}>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}


export default Form.create()(BehaviorEntryRules)
