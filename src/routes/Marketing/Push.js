import React from 'react'
import { Table, Dropdown, Menu, Icon, Button, Input, Tag, Popover } from 'antd'
import { browserHistory } from 'react-router'
import { getPopupContainer } from 'utils'
const Search = Input.Search

export default class Push extends React.Component {

    state = {
        customers: []
    }

    handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination)
        console.log(filters)
        console.log(sorter)
        // const pager = { ...this.state.pagination };
        // pager.current = pagination.current;
        // this.setState({
        //   pagination: pager,
        // });
        // this.fetch({
        //   results: pagination.pageSize,
        //   page: pagination.current,
        //   sortField: sorter.field,
        //   sortOrder: sorter.order,
        //   ...filters,
        // });
    }

    componentDidMount = () => {
        const data = {
            push: [
                {
                    id: 1,
                    name: '国庆VIP促销优惠',
                    pushMode: 0, //0:短信 1:APP
                    target: {
                        from: 1, //0:所有 1:微信 2:APP
                        memberType: 2, //0:所有 1:会员 2:非会员
                        registrationFrom: '2011-11-11',
                        registrationTo: '2011-11-11',
                        balanceType: 1, //0:不启用 1:大于 2:小于
                        balanceNum: 1,
                        pointType: 2, //0:不启用 1:大于 2:小于
                        pointNum: 8,
                        amountType: 1, //0:不启用 1:大于 2:小于
                        amountNum: 1,
                    },
                    pushTime: '2011-11-11 11:11',
                    createTime: '2011-11-11 11:11',
                    by: '#14 员工1',
                    status: 0, //0:待推送 1:已推送
                    content: '1推送内容推送内容推送内容推送内容推送内容推送内容推送内容',
                },
                {
                    id: 2,
                    name: '国庆VIP促销优惠',
                    pushMode: 0, //0:短信 1:APP
                    target: {
                        from: 0, //0:所有 1:微信 2:APP
                        memberType: 0, //0:所有 1:会员 2:非会员
                        registrationFrom: '',
                        registrationTo: '',
                        balanceType: 0, //0:不启用 1:大于 2:小于
                        balanceNum: 0,
                        pointType: 0, //0:不启用 1:大于 2:小于
                        pointNum: 0,
                        amountType: 0, //0:不启用 1:大于 2:小于
                        amountNum: 0,
                    },
                    pushTime: '2011-11-11 11:11',
                    createTime: '2011-11-11 11:11',
                    by: '#14 员工1',
                    status: 1, //0:待推送 1:已推送
                    content: '2推送内容推送内容推送内容推送内容推送内容推送内容推送内容',
                },
            ]
        }
        this.setState(data)
    }

    targetTransformer = (target) => {
        let str = ''
        if (target.from == 1) {
            str += '来自微信，'
        } else if (target.from == 2) {
            str += '来自APP，'
        }
        if (target.memberType == 1) {
            str += '会员，'
        }  else if (target.memberType == 2) {
            str += '非会员，'
        }
        if (target.registrationFrom != '') {
            str += target.registrationFrom + '以后注册，'
        }
        if (target.registrationTo != '') {
            str += target.registrationTo + '以前注册，'
        }
        if (target.balanceType == 1) {
            str += `余额大于${target.balanceNum}，`
        } else if (target.balanceType == 2) {
            str += `余额小于${target.balanceNum}，`
        }
        if (target.pointType == 1) {
            str += `积分大于${target.pointNum}，`
        } else if (target.pointType == 2) {
            str += `积分小于${target.pointNum}，`
        }
        if (target.amountType == 1) {
            str += `消费总额大于${target.amountNum}，`
        } else if (target.amountType == 2) {
            str += `消费总额小于${target.amountNum}，`
        }
        return str.replace(/，$/, '')
    }


    render() {

        const menu = (
            <Menu>
                <Menu.Item>
                    <a href="javascript:;">编辑</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item>
                    <a href="javascript:;" style={{ color: 'red' }}>删除</a>
                </Menu.Item>
            </Menu>
        )

        const content = (
            <div>
                <p>推送内容推送内容推送内容推送内容推送内容推送内容推送内容</p>
            </div>
        );

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
            title: '推送方式',
            dataIndex: 'pushMode',
            sorter: true,
            render: (t) => {
                switch(t) {
                    case 0: return '短信'
                    case 1: return '微信'
                    case 2: return 'APP'
                }
            }
        }, {
            title: '目标用户',
            dataIndex: 'target',
            width: '30%',
            render: (v) => (this.targetTransformer(v))
        }, {
            title: '推送时间',
            dataIndex: 'pushTime',
            sorter: true,
        }, {
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
                switch(t) {
                    case 0: return <Tag className="tag-green">待推送</Tag>
                    case 1: return <Tag>已推送</Tag>
                }
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => record.status == 0 ? (
                <Dropdown overlay={menu} {...getPopupContainer}>
                    <a className="ant-dropdown-link" href="javascript:;">
                        操作 <Icon type="down" />
                    </a>
                </Dropdown>
            ) : (
                
                <Popover trigger="click" content={<div style={{width:'400px',wordWrap:'break-word',wordBreak:'normal'}}>{record.content}</div>} placement="left" {...getPopupContainer}>
                    <a className="ant-dropdown-link" href="javascript:;">
                        查看 <Icon type="down" />
                    </a>
                </Popover>
            ),
        }];

        return (
            <div className="content-inner">
                <div className="panel">
                    <div className="panel-title">
                        <span>推送列表</span>
                        <Button type="primary" style={{float:'right', marginTop: '-3px'}} onClick={() => { browserHistory.push('/push/new') }}>新建推送</Button>
                    </div>
                    <div className="panel-body">
                        <Search placeholder="搜索" onPressEnter={(e) => { console.log(e.target.value) }} onSearch={value => console.log(value)} ></Search>
                        <hr />
                        <Table columns={columns} dataSource={this.state.push} rowKey="id" onChange={this.handleTableChange} />
                    </div>
                </div>
            </div>
        )
    }
}