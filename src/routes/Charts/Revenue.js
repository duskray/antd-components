import { DatePicker, Select, Button, Row, Col, Spin, Icon } from 'antd'
import Table from 'components/Table'
import { getCalendarContainer, ax, renderCustomizedLabel } from 'utils'
import { BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts'
import moment from 'moment'
const Option = Select.Option
const { RangePicker } = DatePicker

export default class Revenue extends React.Component {
  state = {
    stores: [],
    loading: true,
    revenue: 0,      // 总营收
    serviceOrder: 0, // 服务订单
    itemOrder: 0,    // 商品订单
    nop: 0,          // 消费人数

    moment: [moment().subtract(30, 'days'), moment()],
    store: '',
  }
  moment = [moment().subtract(30, 'days'), moment()]
  store = ''

  getter = (params) => {
    return ax.get(`/charts/revenue`, {
      start: this.moment[0].format('YYYY-MM-DD'),
      end: this.moment[1].format('YYYY-MM-DD'),
      store: this.store,
      ...params
    })
  }

  setter = (rep) => {
    this.setState({
      loading: false,
      ...rep
    })
  }

  download = () => {
    ax.get(`/charts/revenue/download`, {
      start: this.moment[0].format('YYYY-MM-DD'),
      end: this.moment[1].format('YYYY-MM-DD'),
      store: this.store,
    }).then(d => {
      const iframe = document.createElement('iframe')
      iframe.src = d
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
    })
  }

  detailDownload = (date) => {
    ax.get(`/charts/revenue/detail/download`, {
      date,
      store: this.store,
    }).then(d => {
      const iframe = document.createElement('iframe')
      iframe.src = d
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
    })
  }

  onSearchClick = (e) => {
    this.setState({
      loading: true,
    })
    this.moment = this.state.moment
    this.store = this.state.store
    this.refs.table.search()
  }

  componentDidMount = () => {
    ax.get('/stores').then(d => {
      this.setState({
        stores: d.stores
      })
    })
    this.refs.table.search()
  }

  render() {
    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
      },
      {
        title: '总钟数',
        dataIndex: 'time',
        render: (v) => v + ' 节'
      },
      {
        title: '客流数',
        dataIndex: 'customer',
        render: (v) => v + ' 人'
      },
      {
        title: '营业收入',
        dataIndex: 'revenue',
        render: (v) => v + ' 元'
      },
      {
        title: '项目收入',
        dataIndex: 'service',
        render: (v) => v + ' 元'
      },
      {
        title: '加钟收入',
        dataIndex: 'add',
        render: (v) => v + ' 元'
      },
      {
        title: '商品收入',
        dataIndex: 'item',
        render: (v) => v + ' 元'
      },
      {
        title: '会员卡收入',
        dataIndex: 'card',
        render: (v) => v + ' 元'
      },
      {
        title: '',
        render: (t, c) => <Button onClick={e => this.detailDownload(c.date)}><Icon type="download" />导出报表</Button>
      }
    ]

    // const COLORS = ['#00b494', '#357cba', '#FAAD51', '#8A4DB9']

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <RangePicker allowClear={false} onChange={m => this.setState({ moment: m })} value={this.state.moment} style={{ marginRight: '10px' }} {...getCalendarContainer}></RangePicker>
            <Select onChange={m => this.setState({ store: m })} value={this.state.store} style={{ width: '120px', marginRight: '10px' }}>
              <Option value="">所有门店</Option>
              {
                this.state.stores.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)
              }
            </Select>
            <Button type="primary" onClick={this.onSearchClick} style={{ transform: 'translate(0, -1px)' }}>检索</Button>
            <Button type="primary" onClick={this.download} style={{ float: 'right', transform: 'translate(0, -1px)' }}><Icon type="download" />下载</Button>
          </div>
          <div className="panel-body">
            <Spin spinning={this.state.loading}>
              <Row style={{ fontSize: '18px', fontWeight: 'bold' }}>
                <Col span={4}>
                  <p>收入</p>
                  <p>{this.state.revenue} 元</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid rgb(209, 218, 222)', paddingLeft: '20px' }}>
                  <p>服务订单</p>
                  <p>{this.state.serviceOrder} 单</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid rgb(209, 218, 222)', paddingLeft: '20px' }}>
                  <p>商品订单</p>
                  <p>{this.state.itemOrder} 单</p>
                </Col>
                <Col span={12} style={{ borderLeft: '1px solid rgb(209, 218, 222)', paddingLeft: '20px' }}>
                  <p>消费人数</p>
                  <p>{this.state.nop} 人</p>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart height={300}>
                      <Pie data={this.state.order} dataKey="value" labelLine={false} label={renderCustomizedLabel} fill="#00b494" outerRadius="50%" paddingAngle={1}>
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
                <Col span={8}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart height={300}>
                      <Pie data={this.state.service} dataKey="value" labelLine={false} label={renderCustomizedLabel} fill="#00b494" outerRadius="50%" paddingAngle={1}>
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
                <Col span={8}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart height={300}>
                      <Pie data={this.state.item} dataKey="value" labelLine={false} label={renderCustomizedLabel} fill="#00b494" outerRadius="50%" paddingAngle={1}>
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
              </Row>
            </Spin>
            <hr />
            <Table ref="table" rowKey="date" columns={columns} dataSource={this.state.table} total={this.state.total} getter={this.getter} setter={this.setter} />
          </div>
        </div>
      </div>
    )
  }
}