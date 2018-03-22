import { Form, Input, Button, Select, Rate, Spin } from 'antd'
import { formItemLayout, formButtonLayout, getPopupContainer } from 'utils'
import { ax } from 'utils'
const FormItem = Form.Item

class EvaluationRules extends React.Component {

  state = {
    loading: false
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    ax.get('/system/evaluation-rules')
    .then(d => {
      this.props.form.setFieldsValue(d)
      this.setState({
        loading: false
      })
    })
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      loading: true
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        ax.patch(`/system/evaluation-rules`, {
          data: JSON.stringify(values)
        }).then(_ => {
          ax.get('/system/evaluation-rules')
          .then(d => {
            this.props.form.setFieldsValue(d)
            this.setState({
              loading: false
            })
          }).catch(e => {
            this.setState({
              loading: false
            })
          })
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
          <div className="panel-body">
            <Spin spinning={this.state.loading}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="评价有效期"
              >
                {getFieldDecorator(`validPeriod`, {
                  rules:[{pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数'}],
                  initialValue: ''
                })(
                  <Input addonAfter="天" style={{width: '100%'}}/>
                )}
              </FormItem>
              <hr />
              <FormItem
                {...formItemLayout}
                label="迎宾评价"
              >
                <Rate disabled defaultValue={1} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`receptionist.one`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={2} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`receptionist.two`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={3} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`receptionist.three`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={4} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`receptionist.four`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={5} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`receptionist.five`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <hr />

              <FormItem
                {...formItemLayout}
                label="技师评价"
              >
                <Rate disabled defaultValue={1} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`waiter.one`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={2} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`waiter.two`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={3} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`waiter.three`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={4} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`waiter.four`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={5} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`waiter.five`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <hr />

              <FormItem
                {...formItemLayout}
                label="卫生评价"
              >
                <Rate disabled defaultValue={1} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`health.one`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={2} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`health.two`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={3} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`health.three`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={4} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`health.four`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={5} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`health.five`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              {/* <hr />
              <FormItem
                {...formItemLayout}
                label="商品配送"
              >
                <Rate disabled defaultValue={1} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`distribution.one`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={2} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`distribution.two`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={3} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`distribution.three`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={4} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`distribution.four`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                <Rate disabled defaultValue={5} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator(`distribution.five`)(
                  <Select {...getPopupContainer} mode="tags" style={{ width: '100%' }} placeholder="请输入标签" ></Select>
                )}
              </FormItem> */}
              <hr />
              <FormItem
                {...formButtonLayout}
              >
                {getFieldDecorator(`distribution.five`)(
                  <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                )}
              </FormItem>
            </Form>
            </Spin>
          </div>
        </div>
      </div>
    )
  }
}


export default Form.create()(EvaluationRules)
