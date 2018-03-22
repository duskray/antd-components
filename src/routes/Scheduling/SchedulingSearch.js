import StoreSelecter from 'components/StoreSelecter'
import { Input, Button, DatePicker, Tag, Select, Spin } from 'antd'
import styles from './Scheduling.less';
import { ax, getPopupContainer } from 'utils'
import moment from 'moment'
import _ from 'lodash'
const Option = Select.Option;

class SchedulingSearch extends React.Component {
  state = {
    sid: '',
    loading: false,
    date: moment(),
    stores: [],
    shift: [],
    leave: [], //TODO
    schedule: []
  }

  getList = (sid) => {
    this.setState({
      loading: true,
      sid,
    })
    ax.get(`/stores/${sid}/scheduling/search`, {
      date: this.state.date.format('YYYY-MM-DD')
    })
      .then(d => {
        this.setState({
          loading: false,
          ...d,
        })
      })
  }

  componentDidMount() {
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
        })
      })
  }

  onDateChange = (d) => {
    this.setState({
      date: d
    }, e => this.getList(this.state.sid))

  }

  onEmployeeChange = (employees, typeId) => {
    let se = this.state.schedule
    se = se.filter(v => v.shift != typeId)
    employees.map(v => se = se.filter(s => v != s.id))

    try {
      se = se.concat(
        employees.map(e => ({
          id: Number(e),
          shift: typeId
        }))
      )
    } catch (e) {
      console.error(e)
    }
    
    this.setState({
      schedule: se
    })
  }

  handleSubmit = (e) => {
    ax.put(`/stores/${this.state.sid}/scheduling/search`, {
      date: this.state.date.format('YYYY-MM-DD'),
      schedule: JSON.stringify(this.state.schedule.map(v => _.pick(v, ['id', 'shift'])))
    }).then(e => this.getList(this.state.sid))
  }


  render() {
    const getEmployees = (shift) => {
      return this.state.schedule.length > 0 ? this.state.schedule.filter(v => v.shift == shift.id).map(s => String(s.id)) : []
    }

    const shiftItem = () => {
      if (this.state.shift.length > 0) {
        return this.state.shift.map((item, index) => (
          <div key={item.id}>
            <div>
              <Tag className={styles[`color${index % 8}`]}>{`${item.name} ${item.from} - ${item.to}`}</Tag>
              {this.state.schedule[item.id] ? this.state.schedule[item.id].length + ' 人' : ''}
            </div>
            <br />
            <div>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择员工"
                value={getEmployees(item)}
                onChange={(employees) => this.onEmployeeChange(employees, item.id)}
                optionLabelProp="children"
                disabled={this.state.date.year() == moment().year() && this.state.date.dayOfYear() < moment().dayOfYear() || this.state.date.year() < moment().year()}
                {...getPopupContainer}
              >
                {
                  this.state.employees.map((v, i) => {
                    const leave = this.state.leave.filter(d => d.id == v.id)
                    if (leave.length > 0) {
                      const leaveStr = leave.map(l => `${l.start} - ${l.end}`).join(',')
                      return <Option key={v.id}><span style={{color:'red'}}>{`${v.employeeNum} ${v.name} 请假 ${leaveStr}`}</span></Option>
                    } else {
                      return <Option key={v.id}>{`${v.employeeNum} ${v.name}`}</Option>
                    }
                  })
                }
              </Select>
            </div>
            <br />
          </div>
        ))
      } else {
        return null
      }
    }

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getList} />
        <br />
        <div className="panel">
          <div className="panel-title">班次查询</div>
          <div className="panel-body">
            <DatePicker allowClear={false} value={this.state.date} onChange={this.onDateChange} />
            <Spin spinning={this.state.loading}>
              <hr />
              {shiftItem()}
              <hr />
              <Button type="primary" className="margin-right" onClick={this.handleSubmit}>保存更改</Button>
            </Spin>
          </div>
        </div>
      </div>
    )
  }
}

export default SchedulingSearch