import { Steps, Form, Button, Select, DatePicker, Modal } from 'antd'
import { browserHistory } from 'react-router'
import { formItemLayout, formButtonLayout, ax } from 'utils'
import styles from './WageCreate.less'
const Step = Steps.Step
const FormItem = Form.Item
const MonthPicker = DatePicker.MonthPicker
const RangePicker = DatePicker.RangePicker
const confirm = Modal.confirm

class WageCreate extends React.Component {
  state = {
    stores: []
  }

  componentDidMount = () => {
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
        }, _ => {

        })
      })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.month = values.month.format('YYYY-MM')
        values.time = values.time.map(t => t.format('YYYY-MM-DD'))
        ax.post(`/stores/${values.store}/wages`, {
          month: values.month,
          time: values.time,
          force: 0
        }).then(_ => {
          browserHistory.push('/wage/search')
        }).catch(e => {
          if (e && e.response && e.response.data && e.response.data.exist === 1) {
            confirm({
              title: '工资计算',
              content: '该月工资表已存在，要重新计算并覆盖么？',
              onOk() {
                return (ax.post(`/stores/${values.store}/wages`, {
                  month: values.month,
                  time: values.time,
                  force: 1 // 覆盖已存在
                }).then(_ => {
                  browserHistory.push('/wage/search')
                }))
              },
              onCancel() { },
            })
          } else {
            console.error(e)
          }
        })
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">

          </div>
          <div className="panel-body">
            {/* <Steps current={1}>
              <Step title="Finished" description="This is a description." />
              <Step title="In Progress" description="This is a description." />
              <Step title="Waiting" description="This is a description." />
            </Steps> */}

            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="选择门店"
              >
                {getFieldDecorator('store', {
                  rules: [{ required: true, message: '请输入WiFi名称', whitespace: true }]
                })(
                  <Select>
                    {
                      this.state.stores.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)
                    }
                  </Select>
                  )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="选择月份"
              >
                {getFieldDecorator('month', {
                  rules: [{ required: true, message: '请选择月份', whitespace: true, type: 'object' }]
                })(
                  <MonthPicker style={{ width: '286px' }} className={styles.monthSelect} />
                  )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="工资周期"
              >
                {getFieldDecorator('time', {
                  rules: [{ required: true, message: '请选择工资周期', whitespace: true, type: 'array' }]
                })(
                  <RangePicker />
                  )}
              </FormItem>
              <FormItem {...formButtonLayout}>
                <Button type="primary" htmlType="submit" className="margin-right">计算工资</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )

  }
}

export default Form.create()(WageCreate)