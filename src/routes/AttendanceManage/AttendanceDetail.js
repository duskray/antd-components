import { Table, Dropdown, Menu, DatePicker, Button } from 'antd'
import { browserHistory } from 'react-router'
import StoreSelecter from 'components/StoreSelecter'
import { nameSwitch, ax, getQueryParam } from 'utils'
import moment from 'moment'
const { RangePicker } = DatePicker

export default class AttendanceManage extends React.Component {

  query = getQueryParam()

  state = {
    data: [],
    startTime: moment(this.query.start),
    endTime: moment(this.query.end),
    loading: false,
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    },
  }
  sid = this.props.params.sid
  id = this.props.params.id
  
  getList = () => {
    this.setState({ 
      loading: true 
    })
    ax.get(`/stores/${this.sid}/attendance/${this.id}`, {
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      startTime: this.state.startTime.format('YYYY-MM-DD'),
      endTime: this.state.endTime.format('YYYY-MM-DD'),
    }).then(d => {
      const pagination = { ...this.state.pagination }
      pagination.total = d.total
      this.setState({
        loading: false,
        pagination,
        data: d
      })
    })
  }

  rangeChange = (moment, date) => {
    this.setState({
      startTime: moment[0],
      endTime: moment[1],
    }, _ => this.getList())
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    }, this.getList)
  }

  download = () => {
    ax.get(`/stores/${this.sid}/${this.id}/attendance/detail/download`, {
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
    this.getList()
  }
  

  render() {
    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
      },
      {
        title: '班次',
        dataIndex: 'shift',
      },
      {
        title: '请假',
        dataIndex: 'leave',
      },
      {
        title: '请假时长',
        dataIndex: 'leaveTime',
      },
      {
        title: '上班',
        dataIndex: 'checkin',
      },
      {
        title: '下班',
        dataIndex: 'checkout',
      },
      {
        title: '出勤',
        dataIndex: 'attendance',
      },
    ]

    
  

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>{this.state.data.name ? `#${this.state.data.employeeNum} ${this.state.data.name} 考勤明细` : `考勤明细`} </span>
            <Button type="primary" style={{float:'right', marginTop: '-3px'}} onClick={() => { this.download() }}>导出考勤报表</Button>
          </div>
          <div className="panel-body">
            <RangePicker value={[this.state.startTime, this.state.endTime]} allowClear={false} onChange={this.rangeChange} />
            <hr />
            <Table columns={columns} dataSource={this.state.data.attendance} rowKey="id" loading={this.state.loading} pagination={this.state.pagination} onChange={this.handleTableChange} />
          </div>
        </div>
      </div>
    )
  }
}