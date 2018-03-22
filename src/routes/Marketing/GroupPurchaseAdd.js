import { Form, Input, Button, Icon, InputNumber, Select, Spin, message } from 'antd'
import { formItemLayout, formButtonLayout, getPopupContainer, ax } from 'utils';
import { browserHistory } from 'react-router'
const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option

class GroupPurchaseAdd extends React.Component {

  state = {
    loading: false,
    stores: [],
    services: [],
    items: [],
    dealId: [],
    keys: [],
  }
  id = this.props.params.id
  uuid = 0

  addItem = () => {
    const keys = this.state.keys
    this.setState({
      keys: keys.concat(this.uuid++),
    })
  }

  removeItem = (id) => {
    const keys = this.state.keys
    if (keys.length <= 0) {
      return
    }
    this.setState({
      keys: keys.filter(v => v !== id),
    })
  }

  getPurchaseId = (storeId) => {  
    this.setState({
      loading: true
    })
    ax.get(`/purchases/deals/${storeId}`)
      .then(d => {
        this.setState({
          loading: false,
          dealId: d
        })
      }).catch(e => {
        this.setState({
          loading: false,
        })
      })
  }



  init = async () => {
    const to = (promise) => {
      return promise.then(data => {
        return [null, data]
      }).catch(err => [err])
    }

    this.setState({
      loading: true
    })

    const [err, [{ stores }, { services }, { items }]] = await to(Promise.all([ax.get('/stores'), ax.get('/services'), ax.get('/items')]))
    if (err) {
      this.setState({
        loading: false
      })
      console.error(err)
      message.error(`获取基础信息时发生了一个错误`)
      return
    }

    if (this.id == 'new') {
      this.setState({
        stores: stores,
        services: services,
        items: items,
        loading: false
      })
    } else {
      let thisPurchase, dealId
      try {
        thisPurchase = await ax.get(`/purchases/${this.id}`)
        dealId = await ax.get(`/purchases/deals/${thisPurchase.store[0]}`)
      } catch (e) {
        this.setState({
          loading: false
        })
        console.error(e)
        message.error(`获取团购信息时发生了一个错误`)
        return
      }

      this.setState({
        stores: stores,
        services: services,
        items: items,
        dealId,
        keys: thisPurchase.item.map(v => this.uuid++),
        loading: false,
      }, _ => {
        delete thisPurchase.id
        thisPurchase.nop = String(thisPurchase.nop)
        thisPurchase.store = thisPurchase.store[0]
        this.props.form.setFieldsValue({
          ...thisPurchase,
        })
      })
    }

  }

  componentDidMount() {
    this.init()
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.item = values.item ? values.item.filter(v => v ? true : false) : []
        values.store = [values.store]
        console.log('Received values of form: ', values)
        if (this.id == 'new') {
          ax.post(`/purchases`, {
            data: JSON.stringify(values)
          }).then(v => browserHistory.push('/group-purchase'))
        } else {
          ax.patch(`/purchases/${this.id}`, {
            data: JSON.stringify(values)
          }).then(v => browserHistory.push('/group-purchase'))
        }
      }
    })
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    // getFieldDecorator('keys', { initialValue: [] })
    const { keys } = this.state


    const storeOptions = this.state.stores.map(v => {
      if (v.status == 1) {
        return <Option key={v.id} value={v.id}>{v.name}</Option>
      } else {
        return ''
      }
    })

    const serviceOptions = this.state.services.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)
    const itemOptions = this.state.items.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)
    const dealOptions = this.state.dealId.map((v, i) => <Option key={v.dealId.toString()} value={v.dealId.toString()}>{v.name}</Option>)
    // const dealOptions = <Option value="1">测试团购</Option>

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">新建团购绑定</div>
          <div className="panel-body">
            <Spin spinning={this.state.loading}>
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="团购平台">
                  {getFieldDecorator('platform', {
                    rules: [{ required: true, message: '请选择团购平台', whitespace: true }],
                    initialValue: '1'
                  })(
                    <Select placeholder="请选择团购平台" {...getPopupContainer}>
                      <Option value="1">大众点评</Option>
                    </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="可用门店" >
                  {getFieldDecorator('store', {
                    rules: [{ required: true, message: '请选择可用门店', whitespace: true }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择门店"
                      {...getPopupContainer}
                      onChange={this.getPurchaseId}
                    >
                      {storeOptions}
                    </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={`绑定团购`}>
                  {getFieldDecorator(`bind`, {
                    rules: [{ required: true, message: '请选择团购', whitespace: true }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择团购"
                      {...getPopupContainer}
                    >
                      {dealOptions}
                    </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="项目">
                  {getFieldDecorator('service', {
                    rules: [{ required: true, message: '请选择项目', whitespace: true }],
                  })(
                    <Select placeholder="请选择项目" {...getPopupContainer}>
                      {serviceOptions}
                    </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="服务人数">
                  {getFieldDecorator('nop', {
                    rules: [{ required: true, message: '请选择服务人数', whitespace: true }],
                  })(
                    <Select placeholder="请选择服务人数" {...getPopupContainer}>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                    </Select>
                    )}
                </FormItem>
                <hr />
                {
                  keys.map((v, i) =>
                    (
                      <div key={v}>
                        <FormItem {...formItemLayout} label="商品" >
                          {getFieldDecorator(`item[${v}].itemId`, {
                            rules: [{ required: true, message: '请选择商品', whitespace: true }],
                          })(
                            <Select
                              style={{ width: '50%', marginRight: '8px' }}
                              placeholder="请选择商品"
                              {...getPopupContainer}
                            >
                              {itemOptions}
                            </Select>
                            )}
                          {
                            keys.length > 0 ? (
                              <Button onClick={() => this.removeItem(v)}>删除商品</Button>
                            ) : null
                          }
                        </FormItem>
                        <FormItem {...formItemLayout} label="数量" >
                          {getFieldDecorator(`item[${v}].number`, {
                            rules: [{ required: true, message: '请输入商品数量', whitespace: true, type: 'number' }],
                            initialValue: 1
                          })(
                            <InputNumber min={0} precision={0} style={{ width: '50%' }}></InputNumber>
                            )}
                        </FormItem>
                        <hr />
                      </div>
                    ))
                }
                <FormItem {...formButtonLayout}>
                  <Button type="dashed" onClick={this.addItem} style={{ width: '100%' }}>
                    <Icon type="plus" /> 新增商品
                  </Button>
                </FormItem>

                <hr />
                <FormItem {...formButtonLayout}>
                  <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                  <Button onClick={() => { browserHistory.push('/group-purchase') }}>取消</Button>
                </FormItem>
              </Form>
            </Spin>
          </div>
        </div>
      </div>
    )
  }
}


export default Form.create()(GroupPurchaseAdd)
