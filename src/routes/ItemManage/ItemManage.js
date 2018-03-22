import { Table, Dropdown, Menu, Icon, Button, Tag, Modal, Row, Col } from 'antd'
import { browserHistory } from 'react-router'
import { StoreSelecter, IntegerInput } from 'components'
import { getPopupContainer, ax } from 'utils'
import styles from './ItemManage.less'
import _ from 'lodash'

export default class ItemManage extends React.Component {

  state = {
    loading: false,
    data: [],
  }

  getList = () => {
    this.setState({
      loading: true
    })
    ax.get('/items').then((data) => {
      this.setState({
        loading: false,
        data: data.items,
      })
    })
  }

  componentDidMount = () => {
    this.getList()
  }

  onEdit = (id) => {
    browserHistory.push('/item/' + id)
  }

  onDel = (item) => {
    const _this = this
    Modal.confirm({
      title: `删除${item.name}？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          ax.delete('/items/' + item.id).then(_ => {
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
          <a href="javascript:" onClick={_ => this.onEdit(item.id)}>编辑</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="javascript:" style={{ color: 'red' }} onClick={_ => this.onDel(item)}>删除</a>
        </Menu.Item>
      </Menu>
    )

    const columns = [
      {
        title: '商品图片',
        dataIndex: 'img',
        render: t => <img src={t + '?pixel=128'} width="100" />,
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        sorter: (a, b) => a.name > b.name ? 1 : -1
      },
      {
        title: '商品类别',
        dataIndex: 'type',
        sorter: (a, b) => a.type > b.type ? 1 : -1,
        render: t => t == 0 ? '收费商品' : '免费商品'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Dropdown overlay={menu(record)} {...getPopupContainer}>
            <a className="ant-dropdown-link" href="javascript:">
              操作 <Icon type="down" />
            </a>
          </Dropdown>
        ),
      },
    ]

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>商品列表</span>
            <Button type="primary" style={{ float: 'right', marginTop: '-3px' }} onClick={() => { browserHistory.push('/item/new') }}>新增商品</Button>
          </div>
          <div className="panel-body">
            <Table columns={columns} dataSource={this.state.data} rowKey="id" />
          </div>
        </div>
      </div>
    )
  }
}