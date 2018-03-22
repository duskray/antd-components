import React from 'react'
import { Dropdown, Menu, Icon, Button, Input, Modal } from 'antd'
import Table from 'components/Table'
import { browserHistory } from 'react-router'
import { getPopupContainer, ax } from 'utils'
const Search = Input.Search

export default class Event extends React.Component {

    state = {

    }


    componentDidMount = () => {
        this.getList()
    }



    render() {

        const menu = (item) => (
            <Menu>
                {/* <Menu.Item>
                    <a href="javascript:;" onClick={e => this.edit(item)}>编辑</a>
                </Menu.Item>
                <Menu.Divider /> */}
                <Menu.Item>
                    <a href="javascript:;" style={{ color: 'red' }} onClick={e => this.del(item)}>删除</a>
                </Menu.Item>
            </Menu>
        )

        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                sorter: true,
            }, {
                title: '时间',
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

        return (
            <div className="content-inner">
                <div className="panel">
                    <div className="panel-title">
                        <span>活动列表</span>
                        <Button type="primary" style={{ float: 'right', marginTop: '-3px' }} onClick={() => {  }}>新建活动</Button>
                    </div>
                    <div className="panel-body">
                        <Table ref="table" columns={columns(this.type)} dataSource={this.state.performance} total={this.state.total} getter={this.getter} setter={this.setter} />
                    </div>
                </div>
            </div>
        )
    }
}