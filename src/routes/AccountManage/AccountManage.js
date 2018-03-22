import React from 'react'
import { Table, Dropdown, Menu, Icon, Button, Input, Modal, Alert } from 'antd'
import { browserHistory } from 'react-router'
import { ax } from 'utils'
const Search = Input.Search

class AccountManage extends React.Component {

  state = {
    loading: false,
    data: [],
    modal: {
      visible: false,
      confirmLoading: false,
      alert: false,
      id:'',
      name: '',
      np: '',
      np2: '',
    },
    keyword: '',
    sorter: {
      field: '',
      order: '',
    },
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    }
  }

  getList = () => {
    this.setState({
      loading: true
    })
    ax.get('/accounts', {
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
        data: data.accounts,
        pagination,
      })
    })
  }

  componentDidMount = () => {
    this.getList()
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

  handleEdit = (id) => {
    browserHistory.push('/account/' + id)
  }

  handleDel = (id, name) => {
    const _this = this
    Modal.confirm({
      title: `删除${name}？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          ax.delete('/accounts/' + id).then(d => {
            _this.getList()
            resolve()
          }).catch(() => reject())
        })
      },
      onCancel() { },
    })
  }

  showModal = (v) => {
    this.setState({
      modal: {
        visible: true,
        confirmLoading: false,
        alert: false,
        id: v.id,
        name: v.name,
        // op: '',
        np: '',
        np2: ''
      }
    });
  }

  onPasswordChange = (key, e) => {
    const modal = _.clone(this.state.modal)
    modal[key] = e.target.value
    this.setState({modal})
  }

  handleOk = (e) => {
    const modal = _.clone(this.state.modal)
    if (modal.np === modal.np2) {
      modal.alert = false
      modal.confirmLoading = true
      ax.patch(`/accounts/${modal.id}/password`, {
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

  handleCancel = (e) => {
    const modal = _.clone(this.state.modal)
    modal.visible = false
    this.setState({modal})
  }

  

  render() {

    const menu = (item) => (
      <Menu>
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.handleEdit(item.id)}>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.showModal(item)}>修改密码</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.handleDel(item.id, item.name)} style={{ color: 'red' }}>删除</a>
        </Menu.Item>
      </Menu>
    )

    const columns = [{
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      sorter: true
    }, {
      title: '手机号',
      dataIndex: 'cellNumber',
      key: 'cellNumber',
      sorter: true
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    }, {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
    }, {
      title: '所属部门',
      dataIndex: 'store',
      key: 'store',
      sorter: true,
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
    }, {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      sorter: true,
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Dropdown overlay={menu(record)}>
          <a className="ant-dropdown-link" href="javascript:;">
            操作 <Icon type="down" />
          </a>
        </Dropdown>
      ),
    }];

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>系统账号列表</span>
            <Button type="primary" style={{ float: 'right', marginTop: '-3px' }} onClick={() => { browserHistory.push('/account/new') }}>新建账号</Button>
          </div>
          <div className="panel-body">
            <Search placeholder="搜索" onPressEnter={(e) => { this.handleOnSearch(e.target.value) }} onSearch={v => this.handleOnSearch(v)} ></Search>
            <hr />
            <Table columns={columns} dataSource={this.state.data} rowKey="id" loading={this.state.loading} pagination={this.state.pagination} onChange={this.handleTableChange} />
          </div>
        </div>

        <Modal
          title={`正在修改${this.state.modal.name}的密码`}
          visible={this.state.modal.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          confirmLoading={this.state.modal.confirmLoading}
        >
          {/* <div style={{textAlign:'center'}}><Input style={{width:'300px', marginBottom:'10px'}} placeholder="原密码" value={this.state.modal.op} onChange={this.onPasswordChange.bind(undefined, 'op')}/></div> */}
          <div style={{textAlign:'center'}}><Input style={{width:'300px', marginBottom:'10px'}} type="password" placeholder="新密码" value={this.state.modal.np} onChange={this.onPasswordChange.bind(undefined, 'np')}/></div>
          <div style={{textAlign:'center'}}><Input style={{width:'300px', marginBottom:'10px'}} type="password" placeholder="请再输入一次新密码" value={this.state.modal.np2} onChange={this.onPasswordChange.bind(undefined, 'np2')}/></div>
          {this.state.modal.alert ? <Alert message="两次输入的密码不一致" type="error" style={{width:'300px', margin:'0 auto'}}/>: null}
        </Modal>
      </div>
    )
  }
}

export default AccountManage


