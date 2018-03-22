import { DatePicker, Select, Button, Icon, Table } from 'antd'
import { getCalendarContainer, ax } from 'utils'
import moment from 'moment'
const { MonthPicker } = DatePicker
const Option = Select.Option

export default class Analysis extends React.Component {
  state = {
    data: [],
    month: moment(),
    stores: [],
    store: '',
    loading: true,
  }
  month = moment()
  store = ''

  getData = () => {
    this.setState({
      loading: true,
    })
    ax.get(`/charts/businessAnalysis`, {
      date: this.month.format('YYYY-MM'),
      storeId: this.store,
    }).then(data => {
      this.setState({
        data,
        loading: false,
      })
    })
  }

  download = () => {
    ax.get(`/charts/businessAnalysis/download`, {
      date: this.month.format('YYYY-MM'),
      storeId: this.store,
    }).then(d => {
      const iframe = document.createElement('iframe')
      iframe.src = d
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
    })
  }

  onSearchClick = (e) => {
    this.month = this.state.month
    this.store = this.state.store
    this.getData()
  }

  componentDidMount = () => {
    ax.get('/stores').then(d => {
      this.store = d.stores[0].id
      this.setState({
        stores: d.stores,
        store: d.stores[0].id,
      }, this.getData)
    })
  }

  render() {
    const daily = []

    for (let i = 1; i <= this.state.data.days; i++) {
      daily.push({
        title: `${i}日`,
        dataIndex: `day${i}`,
        render: (t, v) => {
          if (v.sum == 0) {
            return v.daily[i - 1]
          } else {
            return <p style={{ fontWeight: 'bold' }}>{v.daily[i - 1]}</p>
          }
        }
      })
    }

    const columns = [
      {
        title: this.month.format('YYYY-MM'),
        dataIndex: 'name',
        fixed: 'left',
        width: 80,
        render: (t, v) => {
          if (v.sum == 0) {
            return t
          } else {
            return <p style={{ fontWeight: 'bold' }}>{t}</p>
          }
        }
      },
      {
        title: '合计',
        dataIndex: 'total',
        fixed: 'left',
        width: 80,
        render: (t, v) => {
          if (v.sum == 0) {
            return t
          } else {
            return <p style={{ fontWeight: 'bold' }}>{t}</p>
          }
        }
      },
      ...daily
    ]


    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <MonthPicker allowClear={false} placeholder="请选择月份" style={{ marginRight: '10px' }} {...getCalendarContainer} defaultValue={moment()} value={this.state.month} onChange={m => this.setState({ month: m })} />
            <Select onChange={m => this.setState({ store: m })} value={this.state.store} style={{ width: '120px', marginRight: '10px' }}>
              {/* <Option value="">所有门店</Option> */}
              {
                this.state.stores.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)
              }
            </Select>
            <Button type="primary" onClick={this.onSearchClick} style={{ transform: 'translate(0, -1px)' }}>检索</Button>
            <Button type="primary" onClick={this.download} style={{ float: 'right', transform: 'translate(0, -1px)' }}><Icon type="download" />下载</Button>
          </div>
          <div className="panel-body">
            <Table rowKey="id" bordered columns={columns} dataSource={this.state.data.business} pagination={false} loading={this.state.loading} scroll={{ x: 1800 }} />
          </div>
        </div>
      </div>
    )
  }
}