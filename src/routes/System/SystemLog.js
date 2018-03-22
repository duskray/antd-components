import React from 'react'
import { Table, Icon, Row, Col, Button, DatePicker, Select, Pagination } from 'antd'
import { ax } from 'utils'
import { browserHistory } from 'react-router'
import moment from 'moment'
const Option = Select.Option;

class SystemLog extends React.Component {
  state = {
    log: [],
    total: 0,
    start: moment().subtract(7, 'days'),
    end: moment(),
    current: 1,
    pageSize: 10,
    type: '0',
  }
  start = moment().subtract(7, 'days')
  end = moment()
  type = '0'

  onSearchClick = () => {
    this.start = this.state.start
    this.end = this.state.end
    this.type = this.state.type
    this.setState({
      current: 1
    }, _ => {
      this.getList()
    })
  }

  getList = () => {
    ax.get(`/system/log`, {
      start: this.start.format('YYYY-MM-DD'),
      end: this.end.format('YYYY-MM-DD'),
      current: this.state.current,
      pageSize: this.state.pageSize,
      type: this.type
    }).then(d => {
      this.setState({
        log: d.log,
        total: d.total
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
    this.setState({
      current: pagination.current,
      sorter,
    }, e => this.getList());
  }

  componentWillMount = () => {
    this.getList()
  }


  render() {
    const columns = [
      {
        title: '#',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '时间',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: '操作人',
        dataIndex: 'user',
        key: 'user',
      },
      {
        title: '操作记录',
        dataIndex: 'operation',
        key: 'operation',
      },
    ];

    const pagination = {
      pageSize: this.state.pageSize,
      current: this.state.current,
      total: this.state.total,
    }

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">操作日志</div>
          <div className="panel-body">
            <Row type="flex" justify="start" gutter={16} style={{ marginTop: '10px', marginBottom: '10px' }}>
              <Col sm={9} xs={24} style={{ marginBottom: '10px' }}>
                <DatePicker style={{ width: 'calc(50% - 10px)' }} value={this.state.start} onChange={e => this.setState({start: e})}/>
                <span style={{ display: 'inline-block', textAlign: 'center', width: '20px' }}> 至 </span>
                <DatePicker style={{ width: 'calc(50% - 10px)' }} value={this.state.end} onChange={e => this.setState({end: e})}/>
              </Col>
              <Col sm={9} xs={24}>
                <Select defaultValue="0" style={{ width: '100%' }} getPopupContainer={() => document.getElementsByClassName('content-inner')[0]} value={this.state.type} onChange={v => this.setState({type:v})} >
                  <Option value="0">全部操作</Option>
                  <Option value="1">系统管理</Option>
                  <Option value="2">门店管理</Option>
                  <Option value="3">订单管理</Option>
                  <Option value="4">用户管理</Option>
                  <Option value="5">营销管理</Option>
                  <Option value="6">工资管理</Option>
                </Select>
              </Col>
              <Col>
                <Button type="primary" onClick={this.onSearchClick} style={{ transform: 'translate(0, -1px)' }}>检索</Button>
              </Col>
            </Row>
            <Table columns={columns} dataSource={this.state.log} rowKey="id" onChange={this.handleTableChange} pagination={pagination} loading={this.state.loading} />
          </div>
        </div>
      </div>
    )
  }
}

export default SystemLog


