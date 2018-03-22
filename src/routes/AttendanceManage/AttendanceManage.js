import { Table, Dropdown, Menu, Icon, Button, DatePicker } from 'antd'
import moment from 'moment'
import { browserHistory } from 'react-router'
import StoreSelecter from 'components/StoreSelecter'
import { nameSwitch, getCalendarContainer, ax } from 'utils'
const { RangePicker } = DatePicker

export default class AttendanceManage extends React.Component {

  state = {
    stores: [],
    attendance: [],
    startTime: moment().date(1),
    endTime: moment(),
  }
  sid = 0

  getDetail = (sid) => {
    this.sid = sid
    ax.get(`/stores/${sid}/attendance`, {
      startTime: this.state.startTime.format('YYYY-MM-DD'),
      endTime: this.state.endTime.format('YYYY-MM-DD'),
    }).then(d => {
      this.setState({
        attendance: d.attendance
      })
    })
  }

  rangeChange = (moment, date) => {
    this.setState({
      startTime: moment[0],
      endTime: moment[1],
    }, _ => this.getDetail(this.sid))
  }

  download = () => {
    ax.get(`/stores/${this.sid}/attendance/export`, {
      startTime: this.state.startTime.format('YYYY-MM-DD'),
      endTime: this.state.endTime.format('YYYY-MM-DD'),
    }).then(d => {
      const iframe = document.createElement('iframe')
      iframe.src = d
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
    })
  }

  componentDidMount = () => {
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
        })
      })
  }

  render() {


    const columns = [
      {
        title: '姓名',
        dataIndex: 'id',
        sorter: (a, b) => a.id > b.id ? 1 : -1,
        render: (text, record) => <a href="javascript:;" onClick={() => browserHistory.push(`/stores/${this.sid}/attendance/detail/${record.id}?start=${this.state.startTime.format('YYYY-MM-DD')}&end=${this.state.endTime.format('YYYY-MM-DD')}`)}>{`#${record.employeeNum} ${record.name}`}</a>
      },
      {
        title: '职位',
        dataIndex: 'type',
        sorter: (a, b) => a.type > b.type ? 1 : -1,
        render: (text, record) => (nameSwitch('employee', record.type)),
      },
      {
        title: '出勤',
        dataIndex: 'attendance',
        sorter: (a, b) => a.attendance > b.attendance ? 1 : -1,
        render: t => t + '小时'
      },
      {
        title: '请假  ',
        dataIndex: 'leave',
        sorter: (a, b) => a.leave > b.leave ? 1 : -1,
        render: t => t + '小时'
      },
    ]

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getDetail} />
        <br />
        <div className="panel">
          <div className="panel-title">
            <span>考勤报表</span>
            <Button type="primary" style={{ float: 'right', marginTop: '-3px' }} onClick={this.download}>导出考勤报表</Button>
          </div>
          <div className="panel-body">
            <RangePicker value={[this.state.startTime, this.state.endTime]} allowClear={false} onChange={this.rangeChange} />
            <hr />
            <Table columns={columns} dataSource={this.state.attendance} rowKey="id" />
          </div>
        </div>
      </div>
    )
  }
}