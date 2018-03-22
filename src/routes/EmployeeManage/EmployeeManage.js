import { Table, Dropdown, Menu, Icon, Button, Tag, Modal, Input } from 'antd'
import { browserHistory } from 'react-router'
import StoreSelecter from 'components/StoreSelecter'
import { nameSwitch, ax } from 'utils'
const { TextArea, Search } = Input

export default class EmployeeManage extends React.Component {

  state = {
    stores: [],
    data:[],
    modalVisible: false,
    modalItem:null,

    id:'',
    loading: false,
    keyword: '',
    sorter: {
      field: '',
      order: '',
    },
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    },

    remark: '',

    modal: {
      visible: false,
      confirmLoading: false,
      alert: false,
      id:'',
      name: '',
      np: '',
      np2: '',
    },
  }

  getList = (_id) => {
    const id = _id || this.state.id
    this.setState({
      loading: true,
      id,
    })
    ax.get('/stores/' + id + '/employees', {
      keyword: this.state.keyword,
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      field: this.state.sorter.field,
      order: this.state.sorter.order
    }).then((data) => {
      const pagination = { ...this.state.pagination }
      pagination.total = data.total
      this.setState({
        loading: false,
        data: data.employees,
        pagination,
      })
    })
  }
  
  handleOnSearch = (keyword) => {
    const pagination = { ...this.state.pagination }
    pagination.current = 1
    this.setState({
      keyword,
      pagination,
    }, this.getList)

  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      sorter,
    }, this.getList);
  }

  componentDidMount = () => {
    ax.get('/stores')
    .then((data) => {
      this.setState({
        stores: data.stores,
      }, _ => {
        // if (this.state.stores.length > 0) {
        //   this.getList(data.stores[0].id)
        // }
      })
    })
  }

  edit = (eid) => {
    browserHistory.push(`/store/${this.state.id}/employee/${eid}`)
  }

  disable = (eid) => {
    ax.patch(`/stores/${this.state.id}/employees/${eid}/status`, {
      status: 0,
      remark: '',
    }).then(d => this.getList())
  }

  enable = (eid) => {
    ax.patch(`/stores/${this.state.id}/employees/${eid}/status`, {
      status: 1,
      remark: '',
    }).then(d => this.getList())
  }

  transfer = (item) => {
    const _this = this
    Modal.confirm({
      title: `调出${item.name}？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          ax.patch(`/stores/${_this.state.id}/employees/${item.id}/status`, {
            status: 2,
            remark: '',
          }).then(d => {
            _this.getList()
            resolve()
          }).catch(() => reject())
        })
      },
      onCancel() { },
    })
  }

  dimission = (item) => {
    this.setState({
      modalVisible: true,
      modalItem: item,
      remark: '',
    })
  }

  handleOk = (eid) => {
    this.setState({
      loading: true
    })
    ax.patch(`/stores/${this.state.id}/employees/${eid}/status`, {
      status: 3,
      remark: this.state.remark,
    }).then(d => {
      this.setState({
        modalVisible: false,
        loading: false,
      })
      this.getList()
    })
  }

  handleCancel = (e) => {
    this.setState({
      modalVisible: false,
    });
  }

  // password
  showPwdModal = (v) => {
    this.setState({
      modal: {
        visible: true,
        confirmLoading: false,
        alert: false,
        id: v.id,
        name: v.name,
        np: '',
        np2: ''
      }
    });
  }

  onPwdChange = (key, e) => {
    const modal = _.clone(this.state.modal)
    modal[key] = e.target.value
    this.setState({modal})
  }

  handlePwdOk = (e) => {
    const modal = _.clone(this.state.modal)
    if (modal.np === modal.np2) {
      modal.alert = false
      modal.confirmLoading = true
      ax.patch(`/stores/${this.state.id}/employees/${modal.id}/password`, {
        password: modal.np
      }).then(d => {
        modal.visible = false
        modal.confirmLoading = false
        this.setState({modal})
      })
    } else {
      modal.alert = true
    }
    this.setState({modal})
  }

  handlePwdCancel = (e) => {
    const modal = _.clone(this.state.modal)
    modal.visible = false
    this.setState({modal})
  }

  render() {
    const menu = (item) => {
      if (item.status == 0) {
        return (  
          <Menu>
            <Menu.Item>
              <a href="javascript:;" onClick={_ => this.edit(item.id)}>编辑</a>
            </Menu.Item>
            <Menu.Item>
              <a href="javascript:;" onClick={e => this.showPwdModal(item)}>修改密码</a>
            </Menu.Item>
            <Menu.Item>
              <a href="javascript:;" onClick={_ => this.enable(item.id)}>启用</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item>
              <a href="javascript:;" style={{color: 'red'}} onClick={_ => this.transfer(item)}>调出</a>
            </Menu.Item>
            <Menu.Item>
              <a href="javascript:;" style={{color: 'red'}} onClick={_ => this.dimission(item)}>离职</a>
            </Menu.Item>
          </Menu>
        )
      } else if (item.status == 1) {
        return (
          <Menu>
            <Menu.Item>
              <a href="javascript:;" onClick={_ => this.edit(item.id)}>编辑</a>
            </Menu.Item>
            <Menu.Item>
              <a href="javascript:;" onClick={e => this.showPwdModal(item)}>修改密码</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item>
              <a href="javascript:;" style={{color: 'red'}} onClick={_ => this.disable(item.id)}>停用</a>
            </Menu.Item>
          </Menu>
        )
      } else if (item.status == 2) {
        return (
          <Menu>
            <Menu.Item>
              <a href="javascript:;" onClick={_ => this.disable(item.id)}>撤销调出</a>
            </Menu.Item>
          </Menu>
        )
      }
    }
    


    const columns = [
      {
        title: '#',
        dataIndex: 'employeeNum',
        sorter: true,
        render: (t, r) => <a href="javascript:;" onClick={e => browserHistory.push(`/employee/detail/${r.id}/`)}>{t}</a>
      },
      {
        title: '手机号',
        dataIndex: 'tel',
        sorter: true,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: '职位',
        dataIndex: 'type',
        sorter: true,
        render: (text, record) => (nameSwitch('employee', record.type)),
      },
      {
        title: '状态',
        dataIndex: 'status',
        sorter: true,
        render: (text, record) => (nameSwitch('employee-status-tag', record.status)),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (record.status != 3) {
            return (
              <Dropdown overlay={menu(record)}>
                <a className="ant-dropdown-link" href="javascript:;">
                  操作 <Icon type="down" />
                </a>
              </Dropdown>
            )
          }
        },
      },
    ]

    
  

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getList}/>
        <br />
        <div className="panel">
          <div className="panel-title">
            <span>员工列表</span>
            <Button type="primary" style={{float:'right', marginTop: '-3px'}} onClick={() => { browserHistory.push(`/store/${this.state.id}/employee/new`) }}>新增员工</Button>
          </div>
          <div className="panel-body">
            <Search placeholder="搜索" onPressEnter={(e) => { this.handleOnSearch(e.target.value) }} onSearch={v => this.handleOnSearch(v)} ></Search>
            <hr />
            <Table columns={columns} dataSource={this.state.data} loading={this.state.loading} rowKey="id"  pagination={this.state.pagination} onChange={this.handleTableChange} />
          </div>
        </div>
        <Modal
          title={`离职备注 ${this.state.modalItem ? this.state.modalItem.name : ''}`}
          visible={this.state.modalVisible}
          onOk={_ => this.handleOk(this.state.modalItem.id)}
          onCancel={this.handleCancel}
          confirmLoading={this.state.loading}
        >
          <TextArea rows={4} value={this.state.remark} onChange={e => this.setState({remark: e.target.value})} />
        </Modal>

        <Modal
          title={`正在修改${this.state.modal.name}的密码`}
          visible={this.state.modal.visible}
          onOk={this.handlePwdOk}
          onCancel={this.handlePwdCancel}
          confirmLoading={this.state.modal.confirmLoading}
        >
          <div style={{textAlign:'center'}}><Input style={{width:'300px', marginBottom:'10px'}} type="password" placeholder="新密码" value={this.state.modal.np} onChange={this.onPwdChange.bind(undefined, 'np')}/></div>
          <div style={{textAlign:'center'}}><Input style={{width:'300px', marginBottom:'10px'}} type="password" placeholder="请再输入一次新密码" value={this.state.modal.np2} onChange={this.onPwdChange.bind(undefined, 'np2')}/></div>
          {this.state.modal.alert ? <Alert message="两次输入的密码不一致" type="error" style={{width:'300px', margin:'0 auto'}}/>: null}
        </Modal>
      </div>
    )
  }
}