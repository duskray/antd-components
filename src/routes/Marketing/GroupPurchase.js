import React from 'react'
import { Table, Dropdown, Menu, Icon, Button, Input, Modal, Tag } from 'antd'
import { browserHistory } from 'react-router'
import { getPopupContainer, ax } from 'utils'
const Search = Input.Search

export default class GroupPurchase extends React.Component {

    state = {
        purchases: [],
        loading: false,
        keyword: '',
        current: 1,
        pageSize: 10,
        field: '',
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
        ax.get(`/purchases`, {
            keyword: this.state.keyword,
            current: this.state.current,
            pageSize: this.state.pageSize,
            field: this.state.field,
            order: this.state.order,
        }).then(d => {
            this.setState({
                loading: false,
                purchases: d.purchases,
                total: d.total,
            })
        })
    }

    componentDidMount = () => {
        this.getList()

    }

    edit = (item) => {
        browserHistory.push(`/group-purchase/${item.id}`)
    }

    enable = (item) => {
        ax.patch(`/purchases/${item.id}`, {
            data: JSON.stringify({ status: 1 })
        }).then(e => this.getList())
    }

    disable = (item) => {
        ax.patch(`/purchases/${item.id}`, {
            data: JSON.stringify({ status: 0 })
        }).then(e => this.getList())
    }

    del = (item) => {
        const _this = this
        Modal.confirm({
            title: `删除此数据？`,
            content: `绑定ID: ${item.bind}`,
            onOk() {
                return new Promise((resolve, reject) => {
                    ax.delete(`/purchases/${item.id}`).then(_ => {
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
                {
                    /* item.status == 1
                        ? <Menu.Item><a href="javascript:;" className="text-red" onClick={e => this.disable(item)}>停用</a></Menu.Item>
                        : <Menu.Item><a href="javascript:;" className="text-green" onClick={e => this.enable(item)}>启用</a></Menu.Item> */
                }
                <Menu.Item><a href="javascript:;" className="text-red" onClick={e => this.del(item)}>删除</a></Menu.Item>
            </Menu>
        )

        const columns = [
            {
                title: '团购平台',
                dataIndex: 'platform',
                sorter: true,
                render: t => t == '1' ? '大众点评' : ''
            }, {
                title: '绑定ID',
                dataIndex: 'bind',
                sorter: true,
            }, {
                title: '可用门店',
                dataIndex: 'store',
                sorter: true,
                render: t => t.map((v, i) => <p key={i}>{v}</p>)
            }, {
                title: '对应项目',
                dataIndex: 'service',
                sorter: true,
            }, {
                title: '人数',
                dataIndex: 'nop',
                sorter: true,
            }, {
                title: '包含商品信息',
                dataIndex: 'item',
                sorter: true,
                render: t => t.map((v, i) => <p key={v.name}>{v.name} * {v.number}</p>)
            }, {
                title: '状态',
                dataIndex: 'status',
                sorter: true,
                render: t => {
                    switch (t) {
                        case 0: return <Tag className="tag-red">已停用</Tag>
                        case 1: return <Tag className="tag-green">已启用</Tag>
                    }
                }
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
            }
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
                        <span>团购绑定</span>
                        <Button type="primary" style={{ float: 'right', marginTop: '-3px' }} onClick={() => { browserHistory.push('/group-purchase/new') }}>新建绑定</Button>
                    </div>
                    <div className="panel-body">
                        <Search placeholder="搜索" onPressEnter={(e) => { this.handleOnSearch(e.target.value) }} onSearch={v => this.handleOnSearch(v)}></Search>
                        <hr />
                        <Table columns={columns} dataSource={this.state.purchases} rowKey="id" loading={this.state.loading} onChange={this.handleTableChange} pagination={pagination} />
                    </div>
                </div>
            </div>
        )
    }
}