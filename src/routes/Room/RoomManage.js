import StoreSelecter from 'components/StoreSelecter'
import styles from './Room.less'
import { browserHistory } from 'react-router'
import { Tag, Table, Button, Spin, Menu, Dropdown, Icon, Modal } from 'antd'
import { getPopupContainer, ax } from 'utils'

/**
 * 关于房间状态 status:
 *   0: 空闲
 *   1: 服务中
 *   2: 将清洁
 *   3: 下钟
 *   4: 停用
 */

class RoomManage extends React.Component {
  state = {
    loading: false,
    stores: [],
    rooms: [],
  }
  sid = 0

  getList = (id) => {
    this.setState({
      loading: true,
    })
    this.sid = id
    ax.get('/stores/' + id + '/rooms')
      .then((data) => {
        this.setState({
          rooms: data.rooms,
          loading: false,
        })
      })
  }

  componentDidMount = () => {
    ax.get('/stores')
    .then((data) => {
      this.setState({
        stores: data.stores,
      }, _ => {
        // if (this.state.stores.length > 0) {
        //   this.getList(this.state.stores[0].id)
        // }
      })
    })
  }

  setRoomStatus = (rid, status) => {
    ax.patch(`/stores/${this.sid}/rooms/${rid}/status`, {
      status,
    }).then(d => {
       this.getList(this.sid)
    })
  }

  handleEdit = (rid) => {
    browserHistory.push(`/store/${this.sid}/room/${rid}`)
  }

  handleDel = (item) => {
    const _this = this
    Modal.confirm({
      title: `删除房间${item.name}？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          ax.delete(`/stores/${_this.sid}/rooms/${item.id}`)
          .then(d => {
            resolve()
            _this.getList(_this.sid)
          }).catch(() => reject())
        })
      },
      onCancel() { },
    })
  }

  showStatusClass = (statusFlag) => {
    switch (statusFlag) {
      case 0: return styles.roomStatus0
      case 1: return styles.roomStatus1
      case 2: return styles.roomStatus2
      case 3: return styles.roomStatus3
      case 4: return styles.roomStatus4
    }
  }

  showStatusText = (statusFlag) => {
    switch (statusFlag) {
      case 0: return '空闲'
      case 1: return '服务中'
      case 2: return '待清洁'
      case 3: return '下钟'
      case 4: return '停用'
    }
  }

  showMenu = (item) => {
    return (
      <Menu>
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.handleEdit(item.id)}>编辑</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.setRoomStatus(item.id, 1)}>设置为服务中</a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.setRoomStatus(item.id, 0)}>设置为空闲</a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.setRoomStatus(item.id, 3)}>设置为下钟</a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.setRoomStatus(item.id, 2)}>设置为待清洁</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          {
            item.status == 4 ? <a href="javascript:;" style={{ color: 'red' }} onClick={e => this.handleDel(item)}>删除</a> : <a href="javascript:;" style={{ color: 'red' }} onClick={e => this.setRoomStatus(item.id, 4)}>停用</a>
          }
        </Menu.Item>
      </Menu>
    )
  }

  render() {

    const columns = [{
      title: '房间名',
      dataIndex: 'name',
      sorter: (a, b) => a.name > b.name ? 1 : -1
    }, {
      title: '床位',
      dataIndex: 'bedQuantity',
      sorter: (a, b) => a.bedQuantity > b.bedQuantity ? 1 : -1
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => <Tag className={this.showStatusClass(text)}>{this.showStatusText(text)}</Tag>,
      sorter: (a, b) => a.status > b.status ? 1 : -1
    }, {
      title: '操作',
      key: 'action',
      render: (text, item) => (
        <Dropdown overlay={this.showMenu(item)} {...getPopupContainer}>
          <a className="ant-dropdown-link" href="javascript:;">
            操作 <Icon type="down" />
          </a>
        </Dropdown>
      ),
    }]

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getList} />
        <br />
        <div className="panel">
          <div className="panel-title">
            <span>房间列表</span>
            <Button type="primary" style={{ float: 'right', marginTop: '-3px' }} onClick={() => { browserHistory.push(`/store/${this.sid}/room/new`) }}>新建房间</Button>
          </div>
          <div className="panel-body">
            <Table columns={columns} dataSource={this.state.rooms} rowKey="id" loading={this.state.loading}/>
          </div>
        </div>
      </div>
    )
  }
}


export default RoomManage
