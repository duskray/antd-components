import { Table, Icon, Button, Tag, Input, Modal } from 'antd'
import { browserHistory } from 'react-router'
import { nameSwitch, ax } from 'utils'
const Search = Input.Search

export default class EmployeeTransfer extends React.Component {

  state = {
    loading: false,
    employees: [],
    keyword: '',
    current: 1,
    pageSize: 10,
    total: 0,
    sorter: {
      field: '',
      order: '',
    },
  }
  sid = this.props.params.sid
  sname = ''

  getList = () => {
    this.setState({
      loading: true,
    })
    ax.get(`/transfer`, {
      keyword: this.state.keyword,
      current: this.state.current,
      pageSize: this.state.pageSize,
      field: this.state.sorter.field,
      order: this.state.sorter.order
    }).then((d) => {
      this.setState({
        loading: false,
        employees: d.employees,
        total: d.total,
      })
    })
  }

  componentWillMount = () => {
    ax.get(`/stores/${this.sid}`).then(d => {
      this.sname = d.name
      this.getList()
    })
  }
  
  onSearch = (keyword) => {
    this.setState({
      keyword,
      loading: true,
    }, e => {
      ax.get(`/transfer`, {
        keyword: this.state.keyword,
        current: 1,
        pageSize: this.state.pageSize,
        field: this.state.sorter.field,
        order: this.state.sorter.order
      }).then((d) => {
        this.setState({
          loading: false,
          employees: d.employees,
          total: d.total,
          current: 1,
        })
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      current: pagination.current,
      sorter,
    }, this.getList);
  }

  onClick = (d) => {
    const _this = this
    Modal.confirm({
      title: `调职`,//{`${d.name}将从${d.store}调至${this.sname}`}
      content: <p>{d.name} 将从 <b>{d.store}</b> 调至 <b>{this.sname}</b></p>,
      onOk() {
        return new Promise((resolve, reject) => {
          ax.post(`/transfer/stores/${_this.sid}/employees/${d.id}`)
          .then(d => {
            _this.getList()
            resolve()
          }).catch(() => reject())
        })
      },
      onCancel() { },
    })
  }



  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        render: (text, record) => `#${record.id} ${record.name}`,
        sorter: true,
      },
      {
        title: '手机号',
        dataIndex: 'tel',
        sorter: true,
      },
      
      {
        title: '职位',
        dataIndex: 'type',
        sorter: true,
        render: (text, record) => (nameSwitch('employee', record.type)),
      },
      {
        title: '原门店',
        dataIndex: 'store',
        sorter: true,
      },
      {
        title: '调出时间',
        dataIndex: 'leaveTime',
        sorter: true,
      },
      {
        title: ' ',
        key: 'action',
        render: (text, record) => (
          <Button onClick={e => this.onClick(record)}>调入</Button>
        ),
      },
    ]

    const pagination = {
      pageSize: this.state.pageSize,
      current: this.state.current,
      total: this.state.total,
    }
    
  

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>员工列表</span>
          </div>
          <div className="panel-body">
            <Search placeholder="搜索" onPressEnter={(e) => { this.onSearch(e.target.value) }} onSearch={v => this.onSearch(v)} ></Search>
            <hr />
            <Table columns={columns} dataSource={this.state.employees} rowKey="id" onChange={this.handleTableChange} pagination={pagination} loading={this.state.loading}/>
          </div>
        </div>
      </div>
    )
  }
}