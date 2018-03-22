import React from 'react'
import { Table, Dropdown, Menu, Icon, Button, Input, Modal } from 'antd'
import { browserHistory } from 'react-router'
import { ax } from 'utils'
const Search = Input.Search

export default class CustomerManage extends React.Component {

  state = {
    loading: false,
    customers: [],

    keyword: '',
    field: '',
    order: '',
    pageSize: 10,
    current: 1,
    total: 0,
  }

  getList = () => {
    this.setState({
      loading: true
    })
    ax.get('/customers', {
      keyword: this.state.keyword,
      current: this.state.current,
      pageSize: this.state.pageSize,
      field: this.state.field,
      order: this.state.order
    }).then((data) => {
      this.setState({
        loading: false,
        customers: data.customers,
        total: data.total,
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      current: pagination.current,
      field: sorter.field,
      order: sorter.order,
    }, this.getList)
  }

  componentDidMount = () => {
    this.getList()
  }

  handleSearch = (keyword) => {
    this.setState({
      keyword,
      current: 1,
    }, this.getList)
  }

  handleDel = (id, name) => {
    const _this = this
    Modal.confirm({
      title: `删除${name}？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          ax.delete('/customers/' + id).then(d => {
            _this.getList()
            resolve()
          }).catch(() => reject())
        })
      },
      onCancel() { },
    })
  }

  render() {

    const menu = (item) => (
      <Menu>
        {/* <Menu.Item>
          <a href="javascript:;">查看</a>
        </Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item>
          <a href="javascript:;" style={{ color: 'red' }} onClick={e => this.handleDel(item.id, item.name)}>删除</a>
        </Menu.Item>
      </Menu>
    )

    const genderTransformer = (id) => {
      switch (id) {
        case 0: return '女'
        case 1: return '男'
        case 2: return '未知'
        default: return ''
      }
    }

    const columns = [{
      title: '#',
      dataIndex: 'id',
      sorter: true,
      render: (t, v) => (<a href="javascript:;" onClick={() => { browserHistory.push('/customer/' + t) }}>{t}</a>)
    }, {
      title: '姓名',
      sorter: true,
      dataIndex: 'name',
    }, {
      title: '手机号',
      sorter: true,
      dataIndex: 'cellNumber',
    }, {
      title: '性别',
      dataIndex: 'gender',
      sorter: true,
      render: (text, rec) => genderTransformer(rec.gender)
    }, {
      title: '身份',
      dataIndex: 'memberType',
      sorter: true,
      render: (text, rec) => (rec.memberType == 0 ? '非会员' : '会员')
    }, {
      title: '注册时间',
      sorter: true,
      dataIndex: 'createTime',
    }, {
      title: '消费总额',
      sorter: true,
      dataIndex: 'consumption',
      render: text => `￥` + text
      // }, {
      //   title: '操作',
      //   key: 'action',
      //   render: (text, record) => (
      //     <Dropdown overlay={menu(record)}>
      //       <a className="ant-dropdown-link" href="javascript:;">
      //         操作 <Icon type="down" />
      //       </a>
      //     </Dropdown>
      //   ),
    }];

    const pagination = {
      pageSize: this.state.pageSize,
      current: this.state.current,
      total: this.state.total,
    }

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>用户列表</span>
          </div>
          <div className="panel-body">
            <Search placeholder="搜索" onPressEnter={(e) => { this.handleSearch(e.target.value) }} onSearch={value => this.handleSearch(value)} ></Search>
            <hr />
            <Table columns={columns} dataSource={this.state.customers} rowKey="id" onChange={this.handleTableChange} pagination={pagination} loading={this.state.loading} />
          </div>
        </div>
      </div>
    )
  }
}