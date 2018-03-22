import { Table, Dropdown, Menu, Icon, Row, Col, Button, Tag, Modal } from 'antd'
import { browserHistory } from 'react-router'
import StoreSelecter from 'components/StoreSelecter'
import { ax } from 'utils'

export default class ServiceManage extends React.Component {

  state = {
    loading: false,
    data: [],
  }

  getList = () => {
    this.setState({
      loading: true
    })
    ax.get('/services').then((data) => {
      this.setState({
        loading: false,
        data: data.services,
      })
    })
  }

  componentDidMount = () => {
    this.getList()
  }

  handleEdit = (id) => {
    browserHistory.push('/service/' + id)
  }

  handleDel = (id, name) => {
    const _this = this
    Modal.confirm({
      title: `删除${name}？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          ax.delete('/services/' + id).then(_ => {
            _this.getList()
            resolve()
          }).catch(_ => reject())
        })
      },
    })
  }

  render() {
    const menu = (item) =>  (
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

    const columns = [
      {
        title: '项目图片',
        dataIndex: 'img',
        render: t => <img src={t + '?pixel=128'} width="100" />,
      },
      {
        title: '#',
        dataIndex: 'id',
        sorter: (a, b) => a.id > b.id ? 1 : -1
      },
      {
        title: '项目名称',
        dataIndex: 'name',
        sorter: (a, b) => a.name > b.name ? 1 : -1
      },
      {
        title: '项目简介',
        dataIndex: 'des',
        width: '50%',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Dropdown overlay={menu(record)}>
            <a className="ant-dropdown-link" href="javascript:;">
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
            <span>项目列表</span>
            <Button type="primary" style={{float:'right', marginTop: '-3px'}} onClick={() => { browserHistory.push('/service/new') }}>新建项目</Button>
          </div>
          <div className="panel-body">
            <Table columns={columns} dataSource={this.state.data} loading={this.state.loading} rowKey="id" />
          </div>
        </div>
      </div>
    )
  }
}