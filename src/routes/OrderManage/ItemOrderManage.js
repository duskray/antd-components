import { Card, Icon, Button, Tabs, Table } from 'antd'
import StoreSelecter from 'components/StoreSelecter'
import styles from './ItemOrderManage.less'
import { ax } from 'utils'
const TabPane = Tabs.TabPane

export default class ItemOrderManage extends React.Component {

  //=========test data==========
  state = {
    stores: [],
    items: [],
    sid: '',
    type: 1,
    current: 1,
    pageSize: 10,
    field: 'startTime',
    order: 'descend'
  }

  onTabChange = (key) => {
    if (key == 1) {
      this.setState({
        type: 1,
      }, _ => this.getList(this.state.sid))
    } else {
      this.setState({
        type: 2,
      }, _ => this.getList(this.state.sid))
    }
  }

  getList = (sid) => {
    if (sid) {
      this.setState({
        loading: true,
        sid,
      })
    } else {
      sid = this.state.sid
      this.setState({
        loading: true,
      })
      
    }
    
    ax.get('/stores/' + sid + '/orders/item', {
      status: this.state.type,
      current: this.state.current,
      pageSize: this.state.pageSize,
      field: this.state.field,
      order: this.state.order,
    })
      .then((d) => {
        this.setState({
          items: d.items,
          loading: false,
          total: d.total,
        })
      })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      current: pagination.current,
      field: this.state.field,
      order: this.state.order,
    }, e => this.getList())
  }

  booking = (item) => {
    ax.patch(`/stores/${this.state.sid}/orders/item/${item.id}/send`)
    .then(d => this.getList())
  }

  componentDidMount = () => {
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
        })
      })
  }


  render() {
    const getStatusName = (id) => {
      switch (id) {
        case 0: return '待处理'
        case 1: return '已出单'
      }
    }

    const columns = [
      {
        title: '#',
        dataIndex: 'id',
      }, {
        title: '房间',  
        dataIndex: 'room',
        render: t => {
          if (t) {
            return t.map(v => <p key={v}>{v}</p>)
          } else {
            return ''
          }
        } 
      }, {
        title: '商品',
        dataIndex: 'item',
        render: t => t.map(v => <p key={v.name}>{v.name} * {v.quantity}</p>)
      }, {
        title: '下单时间',
        dataIndex: 'startTime',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          record.status == 1
          ? <Button type="primary" onClick={e => this.booking(record)}>出单</Button>
          : ''
        ),
      },
    ]

    const pagination = {
      pageSize: this.state.pageSize,
      current: this.state.current,
      total: this.state.total,
    }

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getList} />
        <br />
        <div className="panel">
          <div className="panel-title">
            <span>商品订单</span>
          </div>
          <div className="panel-body">
            <Tabs defaultActiveKey="1" size="small" onChange={this.onTabChange}>
              <TabPane tab={<span style={{ fontSize: '12px' }}>待处理</span>} key="1"></TabPane>
              <TabPane tab={<span style={{ fontSize: '12px' }}>已出单</span>} key="2"></TabPane>
            </Tabs>
            <Table columns={columns} dataSource={this.state.items} rowKey="id" onChange={this.handleTableChange} pagination={pagination} loading={this.state.loading} />
          </div>
        </div>
      </div>
    )
  }
}



