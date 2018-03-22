import { DatePicker, Button, Table } from 'antd'
import { ax, renderCustomizedLabel } from 'utils'
import { browserHistory } from 'react-router'
import { BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts'
import moment from 'moment'
const { RangePicker } = DatePicker

export default class New extends React.Component {
  state = {
    current: 1,
    pageSize: 10,
    data: {
      chart: [],
    },
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    },
    moment: [moment().subtract(30, 'days'), moment()]
  }
  moment = [moment().subtract(30, 'days'), moment()]

  onSearchClick = () => {
    this.moment = this.state.moment
    this.search(1)
  }

  search = (c) => {
    ax.get(`/charts/new`, {
      start: this.moment[0].format('YYYY-MM-DD'),
      end: this.moment[1].format('YYYY-MM-DD'),
      current: c == null ? this.state.pagination.current : c,
      pageSize: this.state.pagination.pageSize,
    }).then(d => {
      const pagination = { ...this.state.pagination }
      pagination.total = d.total
      pagination.current = c == null ? pagination.current : c
      this.setState({
        start: this.moment[0].format('YYYY-MM-DD'),
        end: this.moment[1].format('YYYY-MM-DD'),
        data: d,
        pagination,
      })
    })
  }

  download = () => {
    ax.get(`/charts/new/download`, {
      start: this.state.start,
      end: this.state.end,
    }).then(d => {
      const iframe = document.createElement('iframe')
      iframe.src = d
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
    })
  }

  tableChange = (p, filters, sorter) => {
    const pagination = { ...this.state.pagination };
    pagination.current = p.current;
    this.setState({
      pagination,
      sorter,
    }, _ => {
      this.search()
    })
  }

  componentDidMount = () => {
    this.search(1)
  }


  render() {
    const pie = [
      {
        name: '普通用户',
        value: this.state.data.users - this.state.data.members,
      },
      {
        name: '会员用户',
        value: this.state.data.members,
      }
    ]

    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
      },
      {
        title: '新增用户',
        dataIndex: 'users',
        render: (t, c) => <a href="javascript:;" onClick={e => browserHistory.push(`/charts/new/user/${c.date}`)}>{t}</a>
      },
      {
        title: '新增会员',
        dataIndex: 'members',
        render: (t, c) => <a href="javascript:;" onClick={e => browserHistory.push(`/charts/new/member/${c.date}`)}>{t}</a>
      },
    ]

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-body">
            <table style={{ width: '100%', fontSize: '16px', fontWeight: 'bold' }}>
              <thead></thead>
              <tbody>
                <tr>
                  <td style={{ width: '20%' }}>注册用户</td>
                  <td rowSpan="4" style={{ width: '40%', fontSize: '12px', borderRight: '1px solid rgb(209, 218, 222)' }}>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart height={200}>
                        <Pie data={pie} dataKey="value" labelLine={false} label={renderCustomizedLabel} fill="#00b494" innerRadius="35%" outerRadius="60%" paddingAngle={1}>
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </td>
                  <td style={{ width: '40%', paddingLeft: '30px' }}>本月新增用户</td>
                </tr>
                <tr style={{ fontSize: '40px' }}>
                  <td>{this.state.data.users}</td>
                  <td style={{ paddingLeft: '30px' }}>{this.state.data.monthUser}</td>
                </tr>
                <tr>
                  <td>会员用户</td>
                  <td style={{ paddingLeft: '30px' }}>本月新增会员</td>
                </tr>
                <tr style={{ fontSize: '40px' }}>
                  <td>{this.state.data.members}</td>
                  <td style={{ paddingLeft: '30px' }}>{this.state.data.monthMembers}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">
            <RangePicker allowClear={false} onChange={m => this.setState({ moment: m })} value={this.state.moment} style={{ marginRight: '10px' }}></RangePicker>
            <Button type="primary" onClick={this.onSearchClick} style={{ transform: 'translate(0, -1px)' }}>检索</Button>
            {/* <Button type="primary" onClick={this.download} style={{ float: 'right', transform: 'translate(0, -1px)' }}>下载</Button> */}
          </div>
          <div className="panel-body">
            <Table columns={columns} dataSource={this.state.data ? this.state.data.chart : []} rowKey="date" loading={this.state.loading} pagination={this.state.pagination} onChange={this.tableChange}></Table>
          </div>
        </div>
      </div>
    )
  }
}