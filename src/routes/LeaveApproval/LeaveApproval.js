import { Table, Dropdown, Menu, Button, Input, Icon, Tabs, Badge, Tag  } from 'antd'
import { browserHistory } from 'react-router'
import StoreSelecter from 'components/StoreSelecter'
import { ax } from 'utils'
const Search = Input.Search
const TabPane = Tabs.TabPane

export default class LeaveApproval extends React.Component {

  state = {
    loading: false,
    stores: [],
    approval: 0,
    type: null,

    keyword: '',
    field: '',
    order: '',
    pageSize: 10,
    current: 1,
    total: 0,
  }
  sid = 0

  getList = (sid) => {
    this.setState({
      loading: true,
    })
    this.sid = sid
    ax.get(`/stores/${sid}/leave`, {
      keyword: this.state.keyword,
      current: this.state.current,
      pageSize: this.state.pageSize,
      field: this.state.field,
      order: this.state.order,
      type: this.state.type,        // (undefined || null):全部 0:待审批 1:已通过 2:已拒绝 3:已撤销
    }).then(d => {
      this.setState({
        loading: false,
        approval: d.approval,
        leave: d.leave,
      })
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
  
  onTabChange = (key) => {
    if (key == 0) {
      this.setState({
        type: null
      }, _ => this.getList(this.sid))
      
    } else {
      this.setState({
        type: 0
      }, _ => this.getList(this.sid))
    }
  }

  onSearch = (keyword) => {
    this.setState({
      keyword,
      current: 1,
    }, _ => this.getList(this.sid))
  }

  onTableChange = (pagination, filters, sorter) => {
    this.setState({
      current: pagination.current,
      ...sorter,
    }, _ => this.getList(this.sid));
  }
  
  onAllow = (v) => {
    ax.patch(`/stores/${this.sid}/leave/${v.id}`, {
      status: 1
    }).then(_ => {
       this.getList(this.sid)
    })
  }

  onRefuse = (v) => {
    ax.patch(`/stores/${this.sid}/leave/${v.id}`, {
      status: 2
    }).then(_ => {
       this.getList(this.sid)
    })
  }

  render() {
    /**
     * status: 0,   //0:待审批 1:已通过 2:已拒绝 3:已撤销
     */
    // const data = [
    //   {
    //     id: 1,
    //     name: '员工1',
    //     start: '2011-11-11 11:00',
    //     end: '2011-11-11 12:00',
    //     time: '2小时',
    //     applyDate: '2011-11-10 11:00',
    //     examineDate: '2011-11-10 11:00',
    //     status: 0,
    //     desc: '...'
    //   },
    //   {
    //     id: 2,
    //     name: '员工1',
    //     start: '2011-11-11 11:00',
    //     end: '2011-11-11 12:00',
    //     time: '2小时',
    //     applyDate: '2011-11-10 11:00',
    //     examineDate: '2011-11-10 11:00',
    //     status: 1,
    //     desc: '请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由'
    //   },
    //   {
    //     id: 3,
    //     name: '员工1',
    //     start: '2011-11-11 11:00',
    //     end: '2011-11-11 12:00',
    //     time: '2小时',
    //     applyDate: '2011-11-10 11:00',
    //     examineDate: '2011-11-10 11:00',
    //     status: 2,
    //     desc: '请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由'
    //   },
    //   {
    //     id: 4,
    //     name: '员工1',
    //     start: '2011-11-11 11:00',
    //     end: '2011-11-11 12:00',
    //     time: '2小时',
    //     applyDate: '2011-11-10 11:00',
    //     examineDate: '2011-11-10 11:00',
    //     status: 2,
    //     desc: '请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由请假事由'
    //   },
      
    // ]

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        sorter: true,
        render: (text, record) => (`#${record.employeeNum} ${record.name}`)
      },
      {
        title: '开始时间',
        sorter: true,
        dataIndex: 'start',
      },
      {
        title: '结束时间',
        sorter: true,
        dataIndex: 'end',
      },
      {
        title: '请假时长',
        sorter: true,
        dataIndex: 'time',
      },
      {
        title: '申请日期',
        sorter: true,
        dataIndex: 'applyDate',
      },
      {
        title: '审批日期',
        sorter: true,
        dataIndex: 'examineDate',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
          switch(record.status) {
            case 0: return <Tag className="tag-yellow">待审批</Tag>
            case 1: return <Tag className="tag-green">已通过</Tag>
            case 2: return <Tag className="tag-red">已拒绝</Tag>
          }
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          record.status == 0 ? 
          <Dropdown overlay={menu(record)}>
            <a className="ant-dropdown-link" href="javascript:;">
              操作 <Icon type="down" />
            </a>
          </Dropdown>
          : null
        ),
      },
    ]

    const menu = (v) => (
      <Menu>
        <Menu.Item>
          <a href="javascript:;" className="text-green" onClick={e => this.onAllow(v)}>通过</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="javascript:;" className="text-red"  onClick={e => this.onRefuse(v)}>拒绝</a>
        </Menu.Item>
      </Menu>
    )
    
    const pagination = {
      pageSize: this.state.pageSize,
      current: this.state.current,
      total: this.state.total,
    }
  

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getList} />
        <br />
        <div className="panel">
          <div className="panel-title">
            <span>请假列表</span>
          </div>
          <div className="panel-body">
            <Search placeholder="搜索" onPressEnter={(e) => { this.onSearch(e.target.value) }} onSearch={this.onSearch}></Search>
            <Tabs defaultActiveKey="0" size="small" onChange={this.onTabChange}>
              <TabPane tab={<Badge><span style={{fontSize: '12px'}}>全部&nbsp;&nbsp;</span></Badge>} key="0"></TabPane>
              <TabPane tab={<Badge dot={this.state.approval == 0 || this.state.approval == null ? false : true}><span style={{fontSize: '12px'}}>待审批&nbsp;&nbsp;</span></Badge>} key="2"></TabPane>
            </Tabs>
            <Table 
              columns={columns} 
              dataSource={this.state.leave} rowKey="id" 
              expandedRowRender={record => <p>{record.desc}</p> }
              loading={this.state.loading} pagination={pagination} onChange={this.onTableChange}
            />
          </div>
        </div>
      </div>
    )
  }
}