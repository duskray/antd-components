import React from 'react'
import { Table, Dropdown, Menu, Icon, Button, Modal } from 'antd'
import { browserHistory } from 'react-router'
import { ax } from 'utils'
import moment from 'moment'

class RoleManage extends React.Component {

  state = {
    loading: false,
    data: [],
  }

  getList = () => {
    this.setState({
      loading: true
    })
    ax.get('/roles').then((data) => {
      this.setState({
        loading: false,
        data: data.roles,
      })
    })
  }

  componentDidMount = () => {
    this.getList()
  }

  handleEdit = (id) => {
    browserHistory.push('/role/' + id)
  }

  handleDel = (id, name) => {
    const _this = this
    Modal.confirm({
      title: `删除${name}？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          ax.delete('/roles/' + id).then(d => {
            _this.getList()
            resolve()
          }).catch(() => reject())
        })
      },
    })
  }
 
  render () {

    const menu = (item) => (
      <Menu>
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.handleEdit(item.id)}>编辑</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.handleDel(item.id, item.name)} style={{color: 'red'}}>删除</a>
        </Menu.Item>
      </Menu>
    )
  
    const columns = [{
      title: '#',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id > b.id ? 1 : -1
    }, {
      title: '角色名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name > b.name ? 1 : -1
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '60%',
      render: text => <p style={{textAlign: 'left'}}>{text}</p>,
      sorter: (a, b) => a.description > b.description ? 1 : -1
    },{
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => moment(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => a.createTime > b.createTime ? 1 : -1
    }, {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      sorter: (a, b) => a.createUser > b.createUser ? 1 : -1
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
            <span>系统角色列表</span>
            <Button type="primary" style={{ float: 'right', marginTop: '-3px' }} onClick={() => { browserHistory.push('/role/new') }}>新建角色</Button>
          </div>
          <div className="panel-body">
            <Table columns={columns} dataSource={this.state.data} loading={this.state.loading} rowKey="id" />
          </div>
        </div>
      </div>
    )
  }
}

export default RoleManage


