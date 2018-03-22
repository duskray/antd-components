import React from 'react'
import { Table, Dropdown, Menu, Icon, Button, Input, Modal } from 'antd'
import { browserHistory } from 'react-router'
import { getPopupContainer, ax } from 'utils'
const Search = Input.Search

export default class Coupon extends React.Component {

    state = {
        coupons: [],
        loading: false,
        keyword: '',
        current: 1,
        pageSize: 10,
        field:'',
        order: 'ascend',
        total: 0,
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
          current: pagination.current,
          field: sorter.field,
          order: sorter.order,
        }, this.getList);
    }

    handleOnSearch = (keyword) => {
      this.setState({
        keyword,
        current: 1
      }, this.getList)
    }


    getList = () => {
        this.setState({
            loading: true
        })
        ax.get(`/coupons`, {
            keyword: this.state.keyword,
            current: this.state.current,
            pageSize: this.state.pageSize,
            field: this.state.field,
            order: this.state.order,
        }).then(d => {
            this.setState({
                loading: false,
                coupons: d.coupons,
                total: d.total,
            })
        })
    }

    componentDidMount = () => {
        this.getList()
    }

    edit = (item) => {
        browserHistory.push(`/coupon/${item.id}`)
    }

    del = (item) => {
        const _this = this
        Modal.confirm({
          title: `删除${item.name}？`,
          content: '',
          onOk() {
            return new Promise((resolve, reject) => {
              ax.delete(`/coupons/${item.id}`).then(_ => {
                _this.getList()
                resolve()
              }).catch(_ => reject())
            })
          },
        })
    }


    render() {

        const menu = (item) => (
            <Menu>
                <Menu.Item>
                    <a href="javascript:;" onClick={e => this.edit(item)}>编辑</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item>
                    <a href="javascript:;" style={{ color: 'red' }} onClick={e => this.del(item)}>删除</a>
                </Menu.Item>
            </Menu>
        )

        const columns = [{
            title: '#',
            dataIndex: 'id',
            sorter: true,
            render: (t, v) => ('# ' + t)
        }, {
            title: '名称',
            dataIndex: 'name',
            sorter: true,
        // },{
        //     title: '条件',
        //     dataIndex: 'condition',
        //     sorter: true,
        }, {
            title: '抵用额',
            dataIndex: 'value',
            sorter: true,
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Dropdown overlay={menu(record)} {...getPopupContainer}>
                    <a className="ant-dropdown-link" href="javascript:;">
                        操作 <Icon type="down" />
                    </a>
                </Dropdown>
            ),
        }]

        const pagination = {
          pageSize: this.state.pageSize,
          current: this.state.current,
          total: this.state.total,
        }

        return (
            <div className="content-inner">
                <div className="panel">
                    <div className="panel-title">
                        <span>优惠券列表</span>
                        <Button type="primary" style={{float:'right', marginTop: '-3px'}} onClick={() => { browserHistory.push('/coupon/new') }}>新建优惠券</Button>
                    </div>
                    <div className="panel-body">
                        <Search placeholder="搜索" onPressEnter={(e) => { this.handleOnSearch(e.target.value) }} onSearch={v => this.handleOnSearch(v)}></Search>
                        <hr />
                        <Table columns={columns} dataSource={this.state.coupons} rowKey="id" loading={this.state.loading} onChange={this.handleTableChange} pagination={pagination}/>
                    </div>
                </div>
            </div>
        )
    }
}