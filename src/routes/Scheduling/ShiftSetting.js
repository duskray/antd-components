import StoreSelecter from 'components/StoreSelecter'
import { browserHistory } from 'react-router'
import { Form, Input, Button, Icon, TimePicker, Modal, message, Spin } from 'antd'
import { formItemLayout, formButtonLayout, ax } from 'utils';
import moment from 'moment'
const FormItem = Form.Item
const confirm = Modal.confirm

class ShiftSetting extends React.Component {
  state = {
    loading: false,
    shift: [],
  }
  sid = this.props.params.sid
  shiftIndex = 0

  getData = () => {
    this.setState({
      loading: true
    })
    ax.get(`/stores/${this.sid}/shiftSetting`)
    .then(d => {
      this.setState({
        loading: false,
        shift: d.shift.map(v => ({
          id: this.shiftIndex++,
          name: v.name,
          from: moment(v.from, 'HH:mm'),
          to: moment(v.to, 'HH:mm'),
        }))
      })
    })
  }

  componentDidMount() {
    this.getData()
	}


  showConfirm = () => {
    const pass = this.state.shift.every(v => v.name && v.from && v.to)
    if (pass) {
      const _this = this
      confirm({
        title: '是否要保存更改？',
        content: <div><p>更改班次设置后，以后所有的排班都将失效，</p><p>请务必在排班设置中重新排班。</p></div>,
        okType: 'danger',
        onOk: () => {
          let shift = JSON.stringify(this.state.shift.map(v => ({
            name: v.name,
            from: v.from.format('HH:mm'),
            to: v.to.format('HH:mm'),
          })))
          return new Promise((resolve, reject) => {
            ax.put(`/stores/${_this.sid}/shiftSetting`, {
              shift,
            }).then(_ => {
              _this.getData()
              resolve()
            }).catch(reject)
          })
        },
        onCancel() {

        },
      });
    } else {
      message.error('请补全班次信息')
    }
    
  }

  addShift = () => {
    this.setState({
      shift: [
        ...this.state.shift,
        {
          id: this.shiftIndex++,
          name: '',
          from: null,
          to: null,
        },
      ]
    })
  }

  removeWifi = (k) => {
    if (this.state.shift.length <= 1) {
      return;
    }

    this.setState({
      shift: this.state.shift.filter(item => item.id !== k)
    })
  }

  handleOnNameChange = (index, e) => {
    const { value } = e.target
    let shift = this.state.shift
    shift[index].name = value
    this.setState({
      shift
    })
  }

  handleOnTimeChange = (index, key, m) => {

      let shift = this.state.shift
      shift[index][key] = m || null
      this.setState({
        shift
      })

  }


  render() {
    const { getFieldDecorator } = this.props.form

    const shiftItem = this.state.shift.map((item, index) => {
      return (
        <div key={item.id}>
          <hr />
          <FormItem
            {...formItemLayout}
            label="班次名称"
            validateStatus={this.state.shift[index].name ? '' : 'error' }
            help={this.state.shift[index].name ? null : "请输入班次名"}
          >

              <Input style={{ width: 'calc(100% - 95px)', marginRight: 5 }} value={this.state.shift[index].name} onChange={e => this.handleOnNameChange(index, e)} />

            {this.state.shift.length > 1 ? (
              <Button onClick={() => this.removeWifi(item.id)}>删除班次</Button>
            ) : null}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="班次时间"
            validateStatus={this.state.shift[index].from && this.state.shift[index].to ? '' : 'error' }
            help={this.state.shift[index].from && this.state.shift[index].to ? null : "请输入时间"}
          >

              <TimePicker format="HH:mm" value={this.state.shift[index].from} onChange={e => this.handleOnTimeChange(index, 'from', e)} />

            <span> 到 </span>

              <TimePicker format="HH:mm" value={this.state.shift[index].to} onChange={e => this.handleOnTimeChange(index, 'to', e)} />


          </FormItem>
        </div>
      )
    });

      console.log(this.state.shift)
    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">班次设置</div>
          <div className="panel-body">
            <Spin spinning={this.state.loading}>
            <Form style={{ padding: '10px' }}>

              {shiftItem}
              <hr />
              <FormItem {...formButtonLayout}>
                <Button type="dashed" onClick={this.addShift} style={{ width: 'calc(100% - 95px)' }}>
                  <Icon type="plus" /> 新增班次
								</Button>
              </FormItem>
              <hr />
              <FormItem {...formButtonLayout}>
                <Button className="margin-right" onClick={() => { browserHistory.push('/scheduling') }}>取消</Button>
                <Button type="primary" className="margin-right" onClick={this.showConfirm}>保存</Button>
              </FormItem>
            </Form>
            </Spin>
          </div>
        </div>

      </div>
    )
  }
}


export default Form.create()(ShiftSetting)
