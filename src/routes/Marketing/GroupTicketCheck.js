import { Icon, Button, Input, Modal, Tag, DatePicker } from 'antd'
import Table from 'components/Table'
import { browserHistory } from 'react-router'
import { getPopupContainer, getCalendarContainer, ax } from 'utils'
import moment from 'moment'
const Search = Input.Search
const { RangePicker } = DatePicker

export default class GroupTicketCheck extends React.Component {

  state = {
    log: [],
    moment: [moment().subtract(7, 'days'), moment()],
    code: '',
  }

  moment = [moment().subtract(7, 'days'), moment()]
  code = ''

  getter = (param) => {
    return ax.get(`/purchases/log`, {
      start: this.moment[0].format('YYYY-MM-DD'),
      end: this.moment[1].format('YYYY-MM-DD'),
      code: this.code,
      ...param
    })
  }

  setter = (rep) => {
    this.setState({
      ...rep
    })
  }

  onSearchClick = (e) => {
    this.moment = this.state.moment
    this.code = this.state.code
    this.refs.table.search()
  }

  componentDidMount = () => {
    this.refs.table.search()
  }

  render() {


    const columns = [
      {
        title: '时间',
        dataIndex: 'createTime',
      }, {
        title: '券码',
        dataIndex: 'code',
      }, {
        title: '对应套餐',
        dataIndex: 'dealGroupId',
      }, {
        title: '响应编码',
        dataIndex: 'responseCode',
      }, {
        title: '说明',
        dataIndex: 'error',
      }
    ]


    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>验券查询</span>
          </div>
          <div className="panel-body">
            <RangePicker allowClear={false} onChange={s => this.setState({ moment: s })} value={this.state.moment} style={{ marginRight: '10px' }} {...getCalendarContainer}></RangePicker>
            <Input placeholder="券号" style={{width:'120px', marginRight: '10px'}} value={this.state.code} onChange={t => this.setState({code: t.target.value})} />
            <Button type="primary" onClick={this.onSearchClick} style={{ transform: 'translate(0, -1px)' }}>检索</Button>
            <hr />
            <Table ref="table" columns={columns} dataSource={this.state.log} total={this.state.total} getter={this.getter} setter={this.setter} />
          </div>
        </div>
      </div>
    )
  }
}