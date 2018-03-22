import { Table, Dropdown, Menu, Icon, Button, Tag, Modal, Row, Col, InputNumber } from 'antd'
import { browserHistory } from 'react-router'
import {StoreSelecter, IntegerInput} from 'components'
import { getPopupContainer, ax } from 'utils'
import styles  from './ItemManage.less'
import _ from 'lodash'

export default class ItemManage extends React.Component {

  state = {
    stores: [],
    items: [],
    loading: false,
    modal: {
      price: {
        visible: false,
        loading: false,
        data: null,
        price: 0,
        memberPrice: 0,
      },
      stock: {
        visible: false,
        loading: false,
        data: null,
        increments: 0,
      },
    }
  }
  sid = 0

  getList = (sid) => {
    this.setState({
      loading: true,
    })
    this.sid = sid
    ax.get(`/stores/${sid}/items`)
    .then(d => {
      this.setState({
        items: d.items,
        loading: false,
      })
    })
    // ax.all([ax.get('/stores/' + sid + '/items'), ax.get(`/stores/${sid}/price`)])
    // .then(ax.spread((services, price) => {
    //   this.setState({
    //     loading: false,
    //     services: services.services,
    //     price: price.price,
    //     memberPrice: price.memberPrice,
    //     modalLoading: false,
    //   })
    // }))  
  }

  componentDidMount = () => {
    // const data =  {
    //   stores: [
    //     {
    //       id: 10,
    //       name: '洪山路店10',
    //       address: '洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路',
    //     },
    //     {
    //       id: 11,
    //       name: '洪山路店11',
    //       address: '洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路',
    //     },
    //     {
    //       id: 12,
    //       name: '洪山路店12',
    //       address: '洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路',
    //     },
    //     {
    //       id: 13,
    //       name: '洪山路店13',
    //       address: '洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路',
    //     },
    //     {
    //       id: 14,
    //       name: '洪山路店14',
    //       address: '洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路',
    //     },
    //     {
    //       id: 15,
    //       name: '洪山路店15',
    //       address: '洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路',
    //     },
    //     {
    //       id: 16,
    //       name: '洪山路店17',
    //       address: '洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路',
    //     },
    //     {
    //       id: 17,
    //       name: '洪山路店18',
    //       address: '洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路',
    //     },
    //     {
    //       id: 18,
    //       name: '洪山路店19',
    //       address: '洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路洪山路',
    //     },
    //   ],
    //   modal: {
    //     price: {
    //       visible: false,
    //       data: null,
    //       price: 0,
    //       memberPrice: 0,
    //     },
    //     stock: {
    //       visible: false,
    //       data: null,
    //       increments: 0,
    //     },
    //   }
    // }

    // this.setState(data)

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

  enable = (item) => {
    ax.patch(`/stores/${this.sid}/items/${item.id}`, {
      status: 1
    }).then(d => this.getList(this.sid))
  }

  disable = (item) => {
    ax.patch(`/stores/${this.sid}/items/${item.id}`, {
      status: 0
    }).then(d => this.getList(this.sid))
  }

  del = (item) => {
    const _this = this
    Modal.confirm({
      title: `删除${item.name}？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          ax.delete(`/stores/${_this.sid}/items/${item.id}`).then(_ => {
            _this.getList(_this.sid)
            resolve()
          }).catch(_ => reject())
        })
      },
    })
  }

  showPriceModal = (item) => {
    const state = _.clone(this.state)
    state.modal.price.visible = true
    state.modal.price.data = item
    state.modal.price.price = item.price
    state.modal.price.memberPrice = item.memberPrice
    this.setState(state)
  }
  priceChange = (v) => {
    const state = _.clone(this.state)
    state.modal.price.price = v
    this.setState(state)
  }
  memberPriceChange = (v) => {
    const state = _.clone(this.state)
    state.modal.price.memberPrice = v
    this.setState(state)
  }
  handlePriceOk = (e) => {
    const state = _.clone(this.state)
    const item = state.modal.price.data
    state.modal.price.loading = true
    ax.patch(`/stores/${this.sid}/items/${item.id}`, {
      price: state.modal.price.price,              
      memberPrice: state.modal.price.memberPrice,
    }).then(d => {
      state.modal.price.loading = false
      state.modal.price.visible = false
      this.setState(state)
      this.getList(this.sid)
    })
  }
  handlePriceCancel = (e) => {
    const state = _.clone(this.state)
    state.modal.price.visible = false
    this.setState(state)
  }
  

  showModal = (item) => {
    const state = _.clone(this.state)
    state.modal.stock.visible = true
    state.modal.stock.data = item
    state.modal.stock.increments = 0
    this.setState(state)
  }
  increase = (v) => {
    const state = _.clone(this.state)
    state.modal.stock.increments = v
    this.setState(state)
  }
  handleOk = (e) => {
    const state = _.clone(this.state)
    const item = state.modal.stock.data
    state.modal.stock.loading = true
    ax.patch(`/stores/${this.sid}/items/${item.id}`, {
      stock: state.modal.stock.increments
    }).then(d => {
      state.modal.stock.loading = false
      state.modal.stock.visible = false
      this.setState(state)
      this.getList(this.sid)
    })
  }
  handleCancel = (e) => {
    const state = _.clone(this.state)
    state.modal.stock.visible = false
    this.setState(state)
  }

  render() {
    
    const menu = (item) =>  (
      <Menu>
        {
          item.type == 0 
          ? <Menu.Item> <a href="javascript:" onClick={ _ => this.showPriceModal(item) }>设置价格</a> </Menu.Item>
          : null
        }
        
        <Menu.Item>
          <a href="javascript:" onClick={ _ => this.showModal(item) }>操作库存</a>
        </Menu.Item>
        <Menu.Divider />
        {
          item.status == 0 
          ? <Menu.Item><a href="javascript:" className={styles.enabled} onClick={e => this.enable(item)}>启用</a></Menu.Item> 
          : <Menu.Item><a href="javascript:" className={styles.disabled} onClick={e => this.disable(item)}>停用</a></Menu.Item>
        }
        {
          item.status == 0 
          ? <Menu.Item><a href="javascript:" className={styles.disabled} onClick={e => this.del(item)}>删除</a></Menu.Item> 
          : null
        }
      </Menu>
    )

    const columns = [
      {
        title: '商品图片',
        dataIndex: 'img',
        render: t => <img src={t.url + '?pixel=128'} width="100" />,
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        sorter: (a, b) => a.name > b.name ? 1 : -1
      },
      {
        title: '价格',
        key: 'price',
        sorter: (a, b) => a.price > b.price ? 1 : -1,
        render: (text, record) => {
          if (record.type == 0) {
            return (
              <div>
                <p>￥{record.price}</p>
                <p className="text-green">￥{record.memberPrice}</p>
              </div>
            )
          } else {
            return '免费商品'
          }
        } 
      },
      {
        title: '库存',
        dataIndex: 'stock',
        sorter: (a, b) => a.stock > b.stock ? 1 : -1
      },
      {
        title: '状态',
        dataIndex: 'status',
        sorter: (a, b) => a.status > b.status ? 1 : -1,
        render: (text, record) => {
          if (record.stock == 0) {
            return <Tag className="tag-yellow">无库存</Tag>
          } else {
            switch(record.status) {
              case 0: return <Tag className="tag-red">停用</Tag>
              case 1: return <Tag className="tag-green">启用</Tag>
            }
          }
        },
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
        <StoreSelecter data={this.state.stores} onClick={this.getList} />
        <br />
        <div className="panel">
          <div className="panel-title">
            <span>商品列表</span>
            <div style={{float:'right'}}>
              <Button type="primary" style={{ marginTop: '-3px'}} onClick={() => { browserHistory.push(`/store/${this.sid}/item/new`) }}>新建项目</Button>
            </div>
          </div>
          <div className="panel-body">
            <Table columns={columns} dataSource={this.state.items} rowKey="id" loading={this.state.loading} />
          </div>
        </div>

        <Modal title="价格设置"
          visible={this.state.modal.price.visible}
          onOk={ e => this.handlePriceOk(e) }
          onCancel={ e => this.handlePriceCancel(e) }
          confirmLoading={this.state.modal.price.loading}
        >
          <Row style={{lineHeight: '28px', textAlign: 'center'}}>
            <Col span={6}>
              商品名称
            </Col>
            <Col span={6}>
              当前价格
            </Col>
            <Col span={6}>
              价格
            </Col>
            <Col span={6}>
              会员价
            </Col>
          </Row>
          <Row style={{ textAlign: 'center'}}>
            <Col span={6} style={{lineHeight:'36px'}}>
              {this.state.modal.price.data ? this.state.modal.price.data.name : null}
            </Col>
            <Col span={6}>
              {this.state.modal.price.data ? (
                <div>
                  <p>{this.state.modal.price.data.op}</p>
                  <p className="text-green">{this.state.modal.price.data.cp}</p>
                </div>
              ) : null}
            </Col>
            <Col span={6} style={{lineHeight:'36px'}}>
              <InputNumber min={0} precision={0} value={this.state.modal.price.price} onChange={v=>this.priceChange(v)} />
            </Col>
            <Col span={6} style={{lineHeight:'36px'}}>
              <InputNumber min={0} precision={0} value={this.state.modal.price.memberPrice} onChange={v=>this.memberPriceChange(v)} />
            </Col>
          </Row>
        </Modal>

        <Modal title="库存操作"
          visible={this.state.modal.stock.visible}
          onOk={ e => this.handleOk(e) }
          onCancel={ e => this.handleCancel(e) }
          confirmLoading={this.state.modal.stock.loading}
        >
          <Row style={{lineHeight: '28px', textAlign: 'center'}}>
            <Col span={8}>
              商品名称
            </Col>
            <Col span={8}>
              现有库存
            </Col>
            <Col span={8}>
              库存调整
            </Col>
          </Row>
          <Row style={{lineHeight: '28px', textAlign: 'center'}}>
            <Col span={8}>
              {this.state.modal.stock.data ? this.state.modal.stock.data.name : null}
            </Col>
            <Col span={8}>
              {this.state.modal.stock.data ? this.state.modal.stock.data.stock : null}
            </Col>
            <Col span={8} style={{boxSizing:'border-box'}}>
              <Button className={styles.groupBtn}
                onClick={_=>{this.increase(Number(this.state.modal.stock.increments) - 1)}}
              >-</Button>
              <IntegerInput className={styles.groupInput}
                value={this.state.modal.stock.increments}
                onChange={_=>{this.increase(_)}} 
              />
              <Button className={styles.groupBtn}
                onClick={_=>{this.increase(Number(this.state.modal.stock.increments) + 1)}}
              >+</Button>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}