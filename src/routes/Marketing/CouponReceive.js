import React from 'react'
import { Table, Dropdown, Menu, Icon, Button, Input, Tag, Popover, Modal } from 'antd'
import { browserHistory } from 'react-router'
import { getPopupContainer, ax } from 'utils'
const Search = Input.Search

export default class CouponReceive extends React.Component {

    state = {
        couponReceive: [],
        loading: false,
        total: 0,
        keyword: '',    // 检索关键词
        current: 1,     // 当前页号，从1开始
        pageSize: 10,   // 每页项目数
        field: '',   // 排序字段名
        order: 'ascend' // 升序或降序 [''|'ascend'|'descend'] 
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
        ax.get(`/coupons-receive`, {
            keyword: this.state.keyword,
            current: this.state.current,
            pageSize: this.state.pageSize,
            field: this.state.field,
            order: this.state.order,
        }).then(d => {
            this.setState({
                loading: false,
                couponReceive: d.couponReceive,
                total: d.total,
            })
        })
    }

    edit = (item) => {
        browserHistory.push(`/coupon-receive/${item.id}`)
    }

    enable = (item) => {
        const _this = this
        Modal.confirm({
            title: `确认要发放${item.name}？`,
            content: '发放后的优惠券不可编辑',
            onOk() {
                return new Promise((resolve, reject) => {
                    ax.patch(`/coupons-receive/${item.id}/enable`).then(_ => {
                        _this.getList()
                        resolve()
                    }).catch(_ => reject())
                })
            },
        })
    }

    del = (item) => {
        const _this = this
        Modal.confirm({
            title: `删除${item.name}？`,
            content: '',
            onOk() {
                return new Promise((resolve, reject) => {
                    ax.delete(`/coupons-receive/${item.id}`).then(_ => {
                        _this.getList()
                        resolve()
                    }).catch(_ => reject())
                })
            },
        })
    }

    componentDidMount = () => {
        // const data = {
        //     couponSend: [
        //         {
        //             id: 1,
        //             name: '国庆VIP促销优惠',
        //             worth: '30',
        //             number: 2,
        //             coupons: [
        //                 {
        //                     name: '优惠券1',
        //                     value: 20.01,
        //                 }, {
        //                     name: '优惠券2',
        //                     value: 20,
        //                 },
        //             ],
        //             usingValidity: '2011-11-11 至 2011-11-12',
        //             conversionValidity: '2011-11-11 至 2011-11-11',
        //             createTime: '2011-11-11 11:11',
        //             by: '#14 员工1',
        //             status: 0, //0:待发放 1:已发放
        //             url: '',
        //         },
        //         {

        //             id: 2,
        //             name: '国庆VIP促销优惠',
        //             worth: '60',
        //             number: 2,
        //             coupons: [
        //                 {
        //                     name: '优惠券1',
        //                     value: 20.01,
        //                     usingValidity: '2011-11-11 至 2011-11-12',
        //                 }, {
        //                     name: '优惠券2',
        //                     value: 20,
        //                     usingValidity: '2011-11-11 至 2011-11-12',
        //                 },
        //             ],
        //             conversionValidity: '2011-11-11 至 2011-11-11',

        //             createTime: '2011-11-11 11:11',
        //             by: '#14 员工1',
        //             status: 1, //0:待发放 1:已发放
        //             url: 'ldfkshofghksadfh',
        //         },
        //     ]
        // }

        this.getList()
    }


    render() {

        const menu = (item) => (
            <Menu>
                <Menu.Item>
                    <a href="javascript:;" onClick={e => this.edit(item)}>编辑</a>
                </Menu.Item>
                <Menu.Item>
                    <a href="javascript:;" onClick={e => this.enable(item)}>发放</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item>
                    <a href="javascript:;" style={{ color: 'red' }} onClick={e => this.del(item)}>删除</a>
                </Menu.Item>
            </Menu>
        )

        const content = (d) => (
            <table style={{ borderSpacing: '10px 5px' }}>
                <tbody>
                    <tr>
                        <td>名称</td>
                        <td>{d.name}</td>
                    </tr>
                    <tr>
                        <td>兑换截止日期</td>
                        <td>{d.conversionValidity}</td>
                    </tr>
                    {
                        d.coupons.map((v, i) => (
                            <tr key={i}>
                                <td>{i == 0 ? '优惠券' : ''}</td>
                                <td>{`${v.name} ￥${v.value} (${v.usingValidity})`} </td>
                            </tr>
                        ))
                    }
                    <tr>
                        <td>抵扣总额</td>
                        <td>￥{d.worth}</td>
                    </tr>
                    <tr>
                        <td>领取URL</td>
                        <td>{d.url}</td>
                    </tr>
                </tbody>
            </table>
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
        }, {
            title: '礼包码',
            dataIndex: 'code',
            // sorter: true,
        }, {
            title: '抵用额',
            dataIndex: 'worth',
            // sorter: true,
            render: (t) => `￥${t}`
        }, {
            title: '优惠券数量',
            dataIndex: 'number',
            // sorter: true,
        }, {
            title: '兑换截止日期',
            dataIndex: 'conversionValidity',
            sorter: true,
        }, {
            //     title: '使用期限',
            //     dataIndex: 'usingValidity',
            //     sorter: true,
            // }, {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: true,
        }, {
            title: '操作人',
            dataIndex: 'by',
            sorter: true,
        }, {
            title: '状态',
            dataIndex: 'status',
            sorter: true,
            render: t => {
                switch (t) {
                    case 0: return <Tag className="tag-green">待发放</Tag>
                    case 1: return <Tag>已发放</Tag>
                }
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => record.status == 0 ? (
                <Dropdown overlay={menu(record)} {...getPopupContainer}>
                    <a className="ant-dropdown-link" href="javascript:;">
                        操作 <Icon type="down" />
                    </a>
                </Dropdown>
            ) : (
                    <Popover trigger="click" content={<div style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}>{content(record)}</div>} placement="left" {...getPopupContainer}>
                        <a className="ant-dropdown-link" href="javascript:;">
                            查看 <Icon type="down" />
                        </a>
                    </Popover>
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
                        <span>优惠券发放列表</span>
                        <Button type="primary" style={{ float: 'right', marginTop: '-3px' }} onClick={() => { browserHistory.push('/coupon-receive/new') }}>新建优惠券发放</Button>
                    </div>
                    <div className="panel-body">
                        <Search placeholder="搜索" onPressEnter={(e) => { this.handleOnSearch(e.target.value) }} onSearch={v => this.handleOnSearch(v)}></Search>
                        <hr />
                        <Table columns={columns} dataSource={this.state.couponReceive} rowKey="id" loading={this.state.loading} onChange={this.handleTableChange} pagination={pagination} />
                    </div>
                </div>
            </div>
        )
    }
}