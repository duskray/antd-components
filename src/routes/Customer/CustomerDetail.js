import { Tag, Col, Row, Table, Menu, Dropdown, Icon, Button, Spin, Popover } from 'antd'
import { formItemLayout, nameSwitch, ax, getPopupContainer } from 'utils'
import styles from './CustomerDetail.less'

export default class CustomerDetail extends React.Component {
  state = {
    baseLoading: true,
    base: {
      id: '',
      name: '',
      cellNumber: '',
      gender: '',                    // 0: 女 1: 男 2:未知
      birthday: '',
      comeFrom: '',                  // 1:微信 2:支付宝 3:APP 4:团购
      wechat: '',
      createTime: '',
      memberType: '',                // 0:非会员 1:会员
      expiryDateEnd: '',             // 会员过期时间
      amount: '',                    // 消费总额
      balance: '',                   // 账户余额
      point: '',                     // 积分
      industry: '',                  // 行业
      profession: '',                // 职业
      age: '',                       // 年龄
      vehicle: '',                   // 座驾
    },

    orderLoading: true,
    orderLog: [],
    orderPager: {
      pageSize: 10,
      current: 1,
      total: 0,
    },

    balanceLoading: true,
    balanceLog: [],
    balancePager: {
      pageSize: 10,
      current: 1,
      total: 0,
    },

    pointLoading: true,
    pointLog: [],
    pointPager: {
      pageSize: 10,
      current: 1,
      total: 0,
    },
  }

  uid = this.props.params.id

  getOrder = () => {
    this.setState({
      orderLoading: true
    })
    ax.get(`/customers/${this.uid}/order`, {
      current: this.state.orderPager.current,
      pageSize: this.state.orderPager.pageSize,
    }).then(d => {
      const pager = this.state.orderPager
      pager.total = d.total
      this.setState({
        orderLoading: false,
        orderLog: d.orderLog,
        orderPager: pager
      })
    })
  }

  getBalance = () => {
    this.setState({
      balanceLoading: true
    })
    ax.get(`/customers/${this.uid}/balance`, {
      current: this.state.balancePager.current,
      pageSize: this.state.balancePager.pageSize,
    }).then(d => {
      const pager = this.state.balancePager
      pager.total = d.total
      this.setState({
        balanceLoading: false,
        balanceLog: d.balanceLog,
        balancePager: pager
      })
    })
  }

  getPoint = () => {
    this.setState({
      pointLoading: true
    })
    ax.get(`/customers/${this.uid}/point`, {
      current: this.state.pointPager.current,
      pageSize: this.state.pointPager.pageSize,
    }).then(d => {
      const pager = this.state.pointPager
      pager.total = d.total
      this.setState({
        pointLoading: false,
        pointLog: d.pointLog,
        pointPager: pager
      })
    })
  }

  componentDidMount = () => {
    ax.get(`/customers/${this.uid}`).then(d => {
      this.setState({
        baseLoading: false,
        base: d,
      })
    })

    this.getOrder()
    this.getBalance()
    this.getPoint()
  }

  memberTransformer = (id) => {
    switch (id) {
      case 0: return '非会员'
      case 1: return '会员'
      default: return ''
    }
  }

  genderTransformer = (id) => {
    switch (id) {
      case 0: return '女'
      case 1: return '男'
      case 2: return '未知'
      default: return ''
    }
  }

  balanceTypeTransformer = (id) => {
    switch (id) {
      case 0: return '充值'
      case 1: return '消费'
      case 2: return '提现'
      default: return ''
    }
  }

  pointTypeTransformer = (id) => {
    switch (id) {
      case 0: return '注册奖励'
      case 1: return '充值奖励'
      case 2: return '消费奖励'
      case 3: return '购买会员奖励'
      case 4: return '评价奖励'
      default: return ''
    }
  }

  orderTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.orderPager }
    pager.current = pagination.current
    this.setState({
      orderPager: pager
    }, e => {
      this.getOrder()
    })
  }

  balanceTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.balancePager }
    pager.current = pagination.current
    this.setState({
      balancePager: pager
    }, e => {
      this.getBalance()
    })
  }

  pointTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pointPager }
    pager.current = pagination.current
    this.setState({
      pointPager: pager
    }, e => {
      this.getPoint()
    })
  }

  orderColumns = [
    {
      title: '#',
      dataIndex: 'orderNumber',
    },
    {
      title: '下单时间',
      dataIndex: 'time',
    },
    {
      title: '项目',
      dataIndex: 'service',
    },
    {
      title: '人数',
      dataIndex: 'nop',
    },
    {
      title: '金额',
      dataIndex: 'op',
      render: (text) => '￥' + text,
    },
    {
      title: '优惠',
      dataIndex: 'discounts',
      render: (text) => '￥' + text,
    },
    {
      title: '合计',
      dataIndex: 'ap',
      render: (text) => '￥' + text,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentType',
      render: t => nameSwitch('payment', t)
    },
    {
      title: '状态',
      dataIndex: 'status',
      className: styles.tdLeft,
      render: (text, rec) => (rec.status.map(v => (
        nameSwitch('order-tag', v)
      )))
    },
    {
      title: '',
      dataIndex: 'record',
      render: t => (
        <Popover trigger="click" content={
          <div style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}>{this.content(t)}</div>
        } placement="left" {...getPopupContainer}>
          <a className="ant-dropdown-link" href="javascript:;">
            客户档案 
            {/* <Icon type="left" /> */}
          </a>
        </Popover>
      )
    },
  ]

  content = (d) => (
    <table style={{ borderSpacing: '10px 5px' }}>
      <tbody>
        <tr>
          <td>病位</td>
          <td>{d.part}</td>
        </tr>
        <tr>
          <td>症状</td>
          <td>{d.symptom}</td>
        </tr>
        <tr>
          <td>受力</td>
          <td>{d.stress}</td>
        </tr>
        <tr>
          <td>效果</td>
          <td>{d.result}</td>
        </tr>
        <tr>
          <td>其他</td>
          <td>{d.other}</td>
        </tr>
      </tbody>
    </table>
  )

  balanceColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      render: (v) => this.balanceTypeTransformer(v),
    },
    {
      title: '金额',
      dataIndex: 'price',
      render: (t, v) => (v.type == 0 ? <span className="text-green">{'￥' + t}</span> : <span className="text-red">{'￥' + t}</span>),
    },
    {
      title: '渠道',
      dataIndex: 'paymentType',
      render: t => nameSwitch('payment', t)
    },
    {
      title: '单据号',
      dataIndex: 'code',
    },
    {
      title: '时间',
      dataIndex: 'time',
    },
    {
      title: '操作人',
      dataIndex: 'by',
    },
  ]

  pointColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      render: (v) => this.pointTypeTransformer(v),
    },
    {
      title: '数额',
      dataIndex: 'number',
      render: (t, v) => (Number(t) >= 0 ? <span className="text-green">{t}</span> : <span className="text-red">{t}</span>),
    },
    {
      title: '事件',
      dataIndex: 'content',
    },
    {
      title: '时间',
      dataIndex: 'time',
    },
  ]

  render = () => {
    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>{`#${this.state.base.id} - ${this.state.base.name}`}</span>
          </div>
          <div className="panel-body">
            <Spin spinning={this.state.baseLoading}>
              <Row>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>手机号码</p>
                  <p className={styles.p} title={this.state.base.cellNumber}>{this.state.base.cellNumber}</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>性别</p>
                  <p className={styles.p} title={this.genderTransformer(this.state.base.gender)}>{this.genderTransformer(this.state.base.gender)}</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>生日</p>
                  <p className={styles.p} title={this.state.base.birthday}>{this.state.base.birthday}</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>来源</p>
                  <p className={styles.p} title={this.state.base.comeFrom}>{this.state.base.comeFrom}</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>微信号</p>
                  <p className={styles.p} title={this.state.base.wechat}>{this.state.base.wechat}</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>注册时间</p>
                  <p className={styles.p} title={this.state.base.createTime}>{this.state.base.createTime}</p>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>客户身份</p>
                  <p className={styles.p} title={this.memberTransformer(this.state.base.memberType)}>{this.memberTransformer(this.state.base.memberType)}</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>会员过期</p>
                  <p className={styles.p} title={this.state.base.expiryDateEnd}>{this.state.base.expiryDateEnd}</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>消费总额</p>
                  <p className={styles.p} title={'￥' + this.state.base.amount}>{'￥' + this.state.base.amount}</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>账户余额 <a href="javascript:;">提现</a></p>
                  <p className={styles.p} title={'￥' + this.state.base.balance}>{'￥' + this.state.base.balance}</p>
                </Col>
                <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                  <p>账户积分</p>
                  <p className={styles.p} title={this.state.base.point}>{this.state.base.point}</p>
                </Col>
              </Row>
              <hr />
              <Row gutter={16} style={{ marginBottom: '5px' }}>
                <Col span={3} style={{ textAlign: 'right' }}>
                  行业
                </Col>
                <Col span={21}>
                  {
                    this.state.base.industry
                  }
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: '5px' }}>
                <Col span={3} style={{ textAlign: 'right' }}>
                  职业
                </Col>
                <Col span={21}>
                  {
                    this.state.base.profession
                  }
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: '5px' }}>
                <Col span={3} style={{ textAlign: 'right' }}>
                  年龄
              </Col>
                <Col span={21}>
                  {
                    this.state.base.age
                  }
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: '5px' }}>
                <Col span={3} style={{ textAlign: 'right' }}>
                  座驾
              </Col>
                <Col span={21}>
                  {
                    this.state.base.vehicle
                  }
                </Col>
              </Row>
            </Spin>
            <hr />
            <div>
              <span style={{ lineHeight: '36px', fontWeight: 'bold' }}>历史订单</span>
            </div>
            <Table
              columns={this.orderColumns}
              dataSource={this.state.orderLog}
              loading={this.state.orderLoading}
              onChange={this.orderTableChange}
              pagination={this.state.orderPager}
              rowKey="id"
            />
            <hr />
            <div>
              <span style={{ lineHeight: '36px', fontWeight: 'bold' }}>余额变更记录</span>
            </div>
            <Table
              columns={this.balanceColumns}
              dataSource={this.state.balanceLog}
              loading={this.state.balanceLoading}
              onChange={this.balanceTableChange}
              pagination={this.state.balancePager}
              rowKey="id"
            />
            <hr />
            <div>
              <span style={{ lineHeight: '36px', fontWeight: 'bold' }}>积分变更记录</span>
            </div>
            <Table
              columns={this.pointColumns}
              dataSource={this.state.pointLog}
              loading={this.state.pointLoading}
              onChange={this.pointTableChange}
              pagination={this.state.pointPager}
              rowKey="id"
            />
          </div>
        </div>
      </div>
    )
  }
}