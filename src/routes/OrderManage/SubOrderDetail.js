import { Tag, Card, Col, Row, Rate, Table, Menu, Dropdown, Icon, Button } from 'antd'
import { formItemLayout, nameSwitch } from 'utils'
import styles from './SubOrderDetail.less'

export default class SubOrderDetail extends React.Component {
  state = {
    content:[]
  }

  componentDidMount = () => {
    // const id = this.props.params
    const data = {
      id: 2,
      name: '客户1',
      cell_number: '18999999999',
      member_type: 1,
      time: '2011-11-11 11:11',
      store: '门店1',
      room: '032/033',
      status: 4,
      content: [
        {
          id: 1,
          type: 0, //0:加钟 1:商品
          img: '222.jpg',
          name: '加钟 30分钟',
          price: '60.00',
        },
        {
          id: 2,
          type: 0, //0:加钟 1:商品
          img: '222.jpg',
          name: '加钟 60分钟',
          price: '120.00',
        },
      ],
      price: '100.00',
      payment: '支付宝',
      bill_id: '543654614554542',
      payment_time: '2011-11-11 11:11',
      actions: [
        {
          id: 1,
          type: 1, //1:退款 2:返券
          content: '20元',
          time: '2011-11-11 11:22',
          user: '2员工1',
          remarks: 'xxxxxxxxxxxxxxxxxxxxxx',
        },
        {
          id: 2,
          type: 2, //1:退款 2:返券
          content: '8折优惠券,15天有效期',
          time: '2011-11-11 11:22',
          user: '1员工2',
          remarks: 'xxxxxxxxxxxxxxxxxxxxxx',
        }
      ],
    }
    this.setState(data)
  }


  render = () => {

    const waiters = this.state.content.map((v, i)=>{

      return (
        <div key={v.id}>
          <Row style={{height: '30px', lineHeight:'30px'}}>
            <Col span={4}>
              <img src={v.img} />
            </Col>
            <Col span={6}>
              {v.name}
            </Col>
            <Col span={8}>
              {v.price}
            </Col>
          </Row>
        </div>
      )
    })

    const actionColumns = [{
      title: '类型',
      dataIndex: 'type',
      sorter: (a, b) => a.type > b.type ? 1 : -1,
      render: (text, rec) => {
        switch (rec.type) {
          case 0: return '取消'
          case 1: return '退款'
          case 2: return '返券'
        }
      }
    }, {
      title: '内容',
      dataIndex: 'content',
    },{
      title: '时间',
      dataIndex: 'time',
      sorter: (a, b) => a.time > b.time ? 1 : -1
    },{
      title: '操作人',
      dataIndex: 'user',
      sorter: (a, b) => a.user > b.user ? 1 : -1,
      render: (text, rec) => (`#${rec.id} ${rec.user}`),
    },{
      title: '备注',
      dataIndex: 'remarks',
    }]

    const actionMenu = (status) => {
      if (status == 0) {
        return (
          <Menu>
            <Menu.Item>
              <a href="javascript:;" style={{color: 'red'}}>取消订单</a>
            </Menu.Item>
          </Menu>
        )
      } else if (status == 1 || status == 2) {
        return (
          <Menu>
            <Menu.Item>
              <a href="javascript:;">退款</a>
            </Menu.Item>
            <Menu.Item>
              <a href="javascript:;">返券</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item>
              <a href="javascript:;" style={{color: 'red'}}>取消订单</a>
            </Menu.Item>
          </Menu>
        )
      } else if (status == 3 || status == 4 || status == 5) {
        return (
          <Menu>
            <Menu.Item>
              <a href="javascript:;">退款</a>
            </Menu.Item>
            <Menu.Item>
              <a href="javascript:;">返券</a>
            </Menu.Item>
          </Menu>
        )
      } else {
        return (
          <Menu>
          </Menu>
        )
      }
    }

    const childrenColumns = [{
      title: '#',
      dataIndex: 'id',
      sorter: (a, b) => a.id > b.id ? 1 : -1,
      render: (text) => ('#' + text),
    }, {
      title: '类型',
      dataIndex: 'type',
      sorter: (a, b) => a.type > b.type ? 1 : -1,
      render: (text, rec) => {
        switch (rec.type) {
          case 0: return '加钟'
          case 1: return '商品'
        }
      }
    }, {
      title: '数量',
      dataIndex: 'content',
    },{
      title: '时间',
      dataIndex: 'time',
      sorter: (a, b) => a.time > b.time ? 1 : -1
    },{
      title: '金额',
      dataIndex: 'price',
      sorter: (a, b) => a.price > b.price ? 1 : -1,
      render: (text) => ('￥' + text),
    },{
      title: '状态',
      dataIndex: 'status',
      sorter: (a, b) => a.status > b.status ? 1 : -1,
      render: (text, v) => (nameSwitch('order-tag', v.status))
    }]


    return (
      
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span># {this.state.id}</span>
          </div>
          <div className="panel-body">
            <Row>
              <Col span={3} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>客户姓名</p>
                <p style={{fontWeight:'bold'}}>{this.state.name}</p>
              </Col>
              <Col span={3} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>手机号码</p>
                <p style={{fontWeight:'bold'}}>{this.state.cell_number}</p>
              </Col>
              <Col span={3} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>客户身份</p>
                <p style={{fontWeight:'bold'}}>{this.state.member_type}</p>
              </Col>
              <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>下单时间</p>
                <p style={{fontWeight:'bold'}}>{this.state.time}</p>
              </Col>
              <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>门店</p>
                <p style={{fontWeight:'bold'}}>{this.state.store}</p>
              </Col>
              <Col span={3} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>房间号</p>
                <p style={{fontWeight:'bold'}}>{this.state.room}</p>
              </Col>
              <Col span={3} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>订单状态</p>
                <p style={{fontWeight:'bold'}}>{nameSwitch('order', this.state.status)}</p>
              </Col>
            </Row>
            <hr />
            <div>
              {waiters}
            </div>
            <hr />
            <div>
              <Row gutter={16}>
                <Col {...formItemLayout.labelCol} className={styles.formItemLabel}>
                  订单金额
                </Col>
                <Col {...formItemLayout.wrapperCol}>
                  {`￥${this.state.price}`}
                </Col>
              </Row>
              <Row gutter={16}>
                <Col {...formItemLayout.labelCol} className={styles.formItemLabel}>
                  付款方式
                </Col>
                <Col {...formItemLayout.wrapperCol}>
                  {this.state.payment}
                </Col>
              </Row>
              <Row gutter={16}>
                <Col {...formItemLayout.labelCol} className={styles.formItemLabel}>
                  账单流水号
                </Col>
                <Col {...formItemLayout.wrapperCol}>
                  {this.state.bill_id}
                </Col>
              </Row>
              <Row gutter={16}>
                <Col {...formItemLayout.labelCol} className={styles.formItemLabel}>
                  支付时间
                </Col>
                <Col {...formItemLayout.wrapperCol}>
                  {this.state.payment_time}
                </Col>
              </Row>
            </div>
            <hr />
            <div style={{height:'36px'}}>
              <span style={{lineHeight:'36px',fontWeight:'bold'}}>订单操作</span>
              <div style={{float:'right'}}>
                <Dropdown overlay={actionMenu(this.state.status)}>
                  <Button>操作<Icon type="down" /></Button>
                </Dropdown>
              </div>
            </div>
            <Table columns={actionColumns} dataSource={this.state.actions} rowKey="id" />
          </div>
        </div>
      </div>
    )
  }
}