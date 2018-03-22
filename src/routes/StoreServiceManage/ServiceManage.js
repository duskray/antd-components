import { Table, Dropdown, Menu, Icon, Row, Col, Button, Tag, Modal, InputNumber } from 'antd'
import { browserHistory } from 'react-router'
import StoreSelecter from 'components/StoreSelecter'
import { ax } from 'utils'

export default class ServiceManage extends React.Component {
  state = {
    loading: false,
    stores: [],
    services: [],

    showModal: false,
    modalLoading: false,
    price: 0,
    memberPrice: 0,
  }
  sid = 0

  getList = (sid) => {
    this.setState({
      loading: true,
    })
    this.sid = sid
    ax.all([ax.get('/stores/' + sid + '/services'), ax.get(`/stores/${sid}/price`)])
    .then(ax.spread((services, price) => {
      this.setState({
        loading: false,
        services: services.services,
        price: price.price,
        step: price.step,
        memberPrice: price.memberPrice,
        modalLoading: false,
      })
    }))
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

  handleEdit = (id) => {
    browserHistory.push(`/store/${this.sid}/service/${id}`)
  }

  setStatus = (id, status) => {
    ax.patch(`/stores/${this.sid}/services/${id}/status`, {
      status,
    }).then(d => {
       this.getList(this.sid)
    })
  }

  handleDel = (item) => {
    const _this = this
    Modal.confirm({
      title: `删除${item.name}？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          ax.delete(`/stores/${_this.sid}/services/${item.id}`).then(_ => {
            _this.getList(_this.sid)
            resolve()
          }).catch(_ => reject())
        })
      },
    })
  }

  handelPriceEdit = (v) => {
    this.setState({
      price: v
    })
  }

  handelMemberPriceEdit = (v) => {
    this.setState({
      memberPrice: v
    })
  }

  handleOk = () => {
    this.setState({
      modalLoading: true,
    })
    ax.patch(`/stores/${this.sid}/price`, {
      price: this.state.price,
      memberPrice: this.state.memberPrice,
    })
    .then(_ => {
      ax.get(`/stores/${this.sid}/price`)
      .then(d => this.setState({
        showModal: false,
        modalLoading: false,
        price: d.price,
        memberPrice: d.memberPrice,
      }))
    })
  }

  handleCancel= () => {
    this.setState({
      showModal: false,
    })
  }

  render() {
    const input = {
      borderBottomRightRadius: '0',
      borderTopRightRadius: '0',
    }
    const addon = {
      padding: '5px 7px',
      color: 'rgba(0,0,0,.65)',
      textAlign: 'center',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
      backgroundColor: '#eee',
      borderBottomLeftRadius: '0',
      borderTopLeftRadius: '0',
      borderLeft: '0',
    }
    
    const menu = (item) =>  (
      <Menu>
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.handleEdit(item.id)}>编辑</a>
        </Menu.Item>
        <Menu.Item>
          { item.status === 1 ? <a href="javascript:;" className="text-red" onClick={e => this.setStatus(item.id, 0)}>停用</a> : <a href="javascript:;" className="text-green" onClick={e => this.setStatus(item.id, 1)}>启用</a> }
        </Menu.Item>
        <Menu.Divider />
          { item.status == 0 ? (
            <Menu.Item>
              <a href="javascript:;" style={{color: 'red'}} onClick={e => this.handleDel(item)}>删除</a>
            </Menu.Item>
          ) : null }
      </Menu>
    )

    const columns = [
      {
        title: '项目图片',
        dataIndex: 'img',
        render: t => <img src={t + '?pixel=128'} width="100" />
      },
      // {
      //   title: '#',
      //   dataIndex: 'id',
      //   sorter: (a, b) => a.id > b.id ? 1 : -1
      // },
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
        title: '价格',
        key: 'memberPrice',
        sorter: (a, b) => a.memberPrice > b.memberPrice ? 1 : -1,
        render: (text, record) => (
          <div>
            <p>{record.price}</p>
            <p className="text-green">{record.memberPrice}</p>
          </div>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        sorter: (a, b) => a.status > b.status ? 1 : -1,
        render: (text, record) => (
          record.status === 1 ? <Tag className="tag-green">启用</Tag> : <Tag className="tag-red">停用</Tag>
        ),
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
        <StoreSelecter data={this.state.stores} onClick={this.getList} />
        <br />
        <div className="panel">
          <div className="panel-title">
            <span>项目列表</span>
            <div style={{float:'right'}}>
              {/* <Button type="primary" style={{ marginTop: '-3px', marginRight: '8px'}} onClick={() => { this.setState({showModal: true}) }}>加钟设置</Button> */}
              <Button type="primary" style={{ marginTop: '-3px'}} onClick={() => { browserHistory.push(`/store/${this.sid}/service/new`) }}>新建项目</Button>
            </div>
          </div>
          <div className="panel-body">
            <Table columns={columns} dataSource={this.state.services} rowKey="id" loading={this.state.loading}/>
          </div>
        </div>

        <Modal title="加钟设置"
          visible={this.state.showModal}
          onOk={ e => this.handleOk(e) }
          onCancel={ e => this.handleCancel(e) }
          confirmLoading={this.state.modalLoading}
        >
          <Row style={{lineHeight: '28px', marginBottom:'10px'}}>
            <Col span={8} style={{textAlign:'right', paddingRight: '8px'}}>
              价格
            </Col>
            <Col span={16}>
              <InputNumber min={0} precision={0} style={input} onChange={this.handelPriceEdit} value={this.state.price}></InputNumber>
              <span style={addon}>{`￥/ ${this.state.step}分钟`}</span>
            </Col>
          </Row>
          <Row style={{lineHeight: '28px',}}>
            <Col span={8} style={{textAlign:'right', paddingRight: '8px'}}>
              会员价
            </Col>
            <Col span={16}>
              <InputNumber min={0} precision={0} style={input} onChange={this.handelMemberPriceEdit} value={this.state.memberPrice}></InputNumber>
              <span style={addon}>{`￥/ ${this.state.step}分钟`}</span>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}