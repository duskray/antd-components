import { DatePicker, Select, TimePicker, Tag, Button, Icon } from 'antd'
import Table from 'components/Table'
import { browserHistory } from 'react-router'
import { getCalendarContainer, nameSwitch, ax } from 'utils'
import moment from 'moment'
const Option = Select.Option
const { RangePicker } = DatePicker

export default class Performance extends React.Component {
  state = {
    stores: [],
    store: '',
    moment: [moment().subtract(30, 'days'), moment()],
    store: '',
    type: '0',
  }
  moment = [moment().subtract(30, 'days'), moment()]
  store = ''
  type = '0'

  getter = (param) => {
    return ax.get(`/charts/performance`, {
      start: this.moment[0].format('YYYY-MM-DD'),
      end: this.moment[1].format('YYYY-MM-DD'),
      store: this.store,
      type: this.type,
      ...param
    })
  }

  setter = (rep) => {
    this.setState({
      ...rep
    })
  }

  download = () => {
    ax.get(`/charts/performance/download`, {
      start: this.moment[0].format('YYYY-MM-DD'),
      end: this.moment[1].format('YYYY-MM-DD'),
      store: this.store,
      type: this.type,
    }).then(d => {
      const iframe = document.createElement('iframe')
      iframe.src = d
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
    })
  }

  downloadDetail = (date) => {
    ax.get(`/charts/performance/detail/download`, {
      date,
      store: this.store,
      type: this.type,
    }).then(d => {
      const iframe = document.createElement('iframe')
      iframe.src = d
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
    })
  }

  onSearchClick = (e) => {
    this.moment = this.state.moment
    this.store = this.state.store
    this.type = this.state.type
    this.refs.table.search()
  }

  componentDidMount = () => {
    ax.get('/stores').then(d => {
      this.setState({
        stores: d.stores,
        store: d.stores[0].id
      })
      this.store = d.stores[0].id
      this.refs.table.search()
    })
    
  }

  detail = (date) => {
    browserHistory.push(`/charts/performance/${date}/${this.type}?store=${this.store}`)
  }



  render() {
    const columns = (type) => {
      switch (type) {
        case '0':
          return [
            {
              title: '日期',
              dataIndex: 'date',
            },
            {
              title: '出勤人数',
              dataIndex: 'attendance',
            },
            {
              title: '上钟人数',
              dataIndex: 'personCount',
            },
            {
              title: '上钟总数',
              dataIndex: 'workCount',
            },
            {
              render: (t, c) => 
              <div>
                <Button onClick={e => this.detail(c.date)} style={{marginRight:'10px'}}>查看明细</Button>
                <Button onClick={e => this.downloadDetail(c.date)}>下载</Button>
              </div>
            }
          ]
        case '2':
          return [
            {
              title: '日期',
              dataIndex: 'date',
            },
            {
              title: '出勤人数',
              dataIndex: 'attendance',
            },
            {
              title: '待客总数',
              dataIndex: 'workCount',
            },
            {
              render: (t, c) => 
              <div>
                <Button onClick={e => this.detail(c.date)} style={{marginRight:'10px'}}>查看明细</Button>
                <Button onClick={e => this.downloadDetail(c.date)}>下载</Button>
              </div>
            }
          ]
        case '3':
          return [
            {
              title: '日期',
              dataIndex: 'date',
            },
            {
              title: '出勤人数',
              dataIndex: 'attendance',
            },
            {
              title: '收床总数',
              dataIndex: 'workCount',
            },
            {
              render: (t, c) => 
              <div>
                <Button onClick={e => this.detail(c.date)} style={{marginRight:'10px'}}>查看明细</Button>
                <Button onClick={e => this.downloadDetail(c.date)}>下载</Button>
              </div>
            }
          ]
      }
    }

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <RangePicker allowClear={false} onChange={s => this.setState({ moment: s })} value={this.state.moment} style={{ marginRight: '10px' }} {...getCalendarContainer}></RangePicker>
            <Select onChange={s => this.setState({ store: s })} value={this.state.store} style={{ width: '120px', marginRight: '10px' }}>
              {
                this.state.stores.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)
              }
            </Select>
            <Select placeholder="选择职位" onChange={s => this.setState({ type: s })} value={this.state.type} style={{ width: '120px', marginRight: '10px' }}>
              <Option value="0">技师</Option>
              <Option value="2">迎宾</Option>
              <Option value="3">保洁</Option>
            </Select>
            <Button type="primary" onClick={this.onSearchClick} style={{ transform: 'translate(0, -1px)' }}>检索</Button>
            <Button type="primary" onClick={this.download} style={{ float: 'right' }}>下载</Button>
          </div>
          <div className="panel-body">
            <Table ref="table" columns={columns(this.type)} dataSource={this.state.performance} total={this.state.total} getter={this.getter} setter={this.setter} />
          </div>
        </div>
      </div>
    )
  }
}