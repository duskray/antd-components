import { Tag, Card, Col, Row, Rate, Table, Menu, Dropdown, Popover, Icon, Button, Radio, Modal, Alert } from 'antd'
import { formItemLayout, nameSwitch, ax, getPopupContainer } from 'utils'
import styles from './OrderDetail.less'
const RadioGroup = Radio.Group

export default class OrderDetail extends React.Component {
  state = {
    children: [],
    waiters: [],
    hostess: [],
    health: [],
    groupPurchase: [],

    visible: false,
    employeeId: '',
    radioValue: '',
    error: false,
    confirmLoading: false,
  }

  id = this.props.params.id

  childrenOrderClose = () => {

  }

  cancel = (id) => {
    this.setState({
      visible: true,
      employeeId: id
    })
  }

  handleOk = () => {
    if (this.state.groupPurchase.length > 0 && this.state.radioValue || this.state.groupPurchase.length == 0) {
      this.setState({
        confirmLoading: true
      })
      ax.patch(`/orders/${this.id}/cancel`, {
        employeeId: this.state.employeeId,
        code: this.state.radioValue,
      }).then(e => {
        this.setState({
          confirmLoading: false,
          visible: false,
        })
        ax.get(`/orders/${this.id}`)
          .then(d => {
            this.setState(d)
          })
      }).catch(e => {
        this.setState({
          confirmLoading: false,
        })
      })
    } else {
      this.setState({ error: true })
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  onRadioChange = (e) => {
    this.setState({
      radioValue: e.target.value,
      error: false
    })
  }

  afterClose = (e) => {
    this.setState({
      radioValue: '',
      error: false
    })
  }

  componentDidMount = () => {
    ax.get(`/orders/${this.id}`)
      .then(d => {
        this.setState(d)
      })
  }


  render = () => {
    const childrenColumns = [{
      title: '单号',
      dataIndex: 'orderNumber',
    }, {
      title: '类型',
      dataIndex: 'type',
      // sorter: (a, b) => a.type > b.type ? 1 : -1,
      render: (text, rec) => {
        switch (rec.type) {
          case 0: return '加钟'
          case 1: return '商品'
        }
      }
    }, {
      title: '下单时间',
      dataIndex: 'time',
      // sorter: (a, b) => a.time > b.time ? 1 : -1
    }, {
      title: '购买信息',
      dataIndex: 'content',
      render: (t, c) => {
        if (c.items && c.items.length > 0) {
          return c.items.map(v => <p key={v.itemName}>{v.itemName} * {v.number}</p>)
        } else if (c.services && c.services.length > 0) {
          return c.services.map(v => <p key={v.waiterName}>{v.waiterName} * {v.time}分钟</p>)
        }
      }
    }, {
      title: '合计',
      dataIndex: 'price',
      render: (text) => ('￥' + text),
    }, {
      title: '支付方式',
      dataIndex: 'paymentType',
      render: (text) => (nameSwitch('payment', text)),
    }, {
      title: '状态',
      dataIndex: 'status',
      // sorter: (a, b) => a.status > b.status ? 1 : -1,
      render: (text, record) => (
        record.status.map((v, i) => nameSwitch('order-tag', v))
      ),
    }]

    const waiterColumns = [
      {
        title: '工号',
        dataIndex: 'employeeNum',
      }, {
        title: '姓名',
        dataIndex: 'name',
      }, {
        title: '时长',
        dataIndex: 'time',
      }, {
        title: '状态',
        dataIndex: 'status',
        render: (text) => (nameSwitch('waiter-status', text)),
      }, {
        title: '上钟时间',
        dataIndex: 'startTime',
      }, {
        title: '下钟时间',
        dataIndex: 'endTime',
      }, {
        title: '评价',
        dataIndex: 'stars',
        width: '180px',
        render: (text) => <span><Rate allowHalf disabled value={Number.parseInt(text / 0.5) * 0.5} />{text}</span>,
      }, {
        title: '',
        dataIndex: 'review',
        width: '100px',
        render: t => (
          <Popover trigger="click" content={
            <div style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}>{t}</div>
          } placement="left" {...getPopupContainer}>
            <a className="ant-dropdown-link" href="javascript:;">客户评价</a>
          </Popover>
        )
      }, {
        title: '',
        dataIndex: 'cancel',
        width: '50px',
        render: (t, d) => (
          this.state.waiters.length > 1 ?
            <a href="javascript:;" onClick={e => this.cancel(d.employeeId)}>退单</a> :
            null
        )
      }
    ]

    const hostessColumns = [
      {
        title: '工号',
        dataIndex: 'employeeNum',
        width: '100px',
      }, {
        title: '姓名',
        dataIndex: 'name',
        width: '100px',
      }, {

      }, {
        title: '评价',
        dataIndex: 'stars',
        width: '180px',
        render: (text) => <span><Rate disabled value={Number.parseInt(text / 0.5) * 0.5} />{text}</span>,
      }, {
        title: '',
        dataIndex: 'review',
        width: '100px',
        render: t => (
          <Popover trigger="click" content={
            <div style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal', padding: '10px' }}>{t}</div>
          } placement="left" {...getPopupContainer}>
            <a className="ant-dropdown-link" href="javascript:;">客户评价</a>
          </Popover>
        )
      }, {
        title: '',
        dataIndex: '',
        width: '50px',
      }
    ]

    const healthColumns = [
      {
        title: '房间',
        dataIndex: 'name',
        width: '100px',
        render: t => <span>{this.state.room}</span>
      }, {
        width: '100px'
      }, {

      }, {
        title: '评价',
        dataIndex: 'stars',
        width: '180px',
        render: (text) => <span><Rate disabled value={Number.parseInt(text / 0.5) * 0.5} />{text}</span>,
      }, {
        title: '',
        dataIndex: 'review',
        width: '100px',
        render: t => (
          <Popover trigger="click" content={
            <div style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}>{t}</div>
          } placement="left" {...getPopupContainer}>
            <a className="ant-dropdown-link" href="javascript:;">客户评价</a>
          </Popover>
        )
      }, {
        title: '',
        dataIndex: '',
        width: '50px',
      }
    ]

    const groupColumns = [
      {
        title: '团购平台',
        dataIndex: 'platform',
      },
      {
        title: '项目',
        dataIndex: 'service',
      },
      {
        title: '团购手机号',
        dataIndex: 'tel',
      },
      {
        title: '券号',
        dataIndex: 'ticket',
      },
    ]

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (

      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span># {this.state.orderNumber} - {this.state.service} * {this.state.nop}</span>
          </div>
          <div className="panel-body">
            <Row>
              <Col span={3} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>客户姓名</p>
                <p style={{ fontWeight: 'bold' }}>{this.state.name}</p>
              </Col>
              <Col span={3} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>手机号码</p>
                <p style={{ fontWeight: 'bold' }}>{this.state.cellNumber}</p>
              </Col>
              <Col span={3} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>客户身份</p>
                <p style={{ fontWeight: 'bold' }}>{this.state.memberType == 1 ? '会员' : '非会员'}</p>
              </Col>
              <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>下单时间</p>
                <p style={{ fontWeight: 'bold' }}>{this.state.time}</p>
              </Col>
              <Col span={4} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>门店</p>
                <p style={{ fontWeight: 'bold' }}>{this.state.store}</p>
              </Col>
              <Col span={3} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>房间号</p>
                <p style={{ fontWeight: 'bold' }}>{this.state.room}</p>
              </Col>
              <Col span={3} style={{ borderLeft: '1px solid #d1dade', paddingLeft: '10px' }}>
                <p>订单状态</p>
                <p style={{ fontWeight: 'bold' }}>{nameSwitch('order', this.state.status)}</p>
              </Col>
            </Row>
            <hr />
            <div style={{ height: '36px' }}>
              <span style={{ lineHeight: '36px', fontWeight: 'bold' }}>关联子订单</span>
            </div>
            <Table columns={childrenColumns} dataSource={this.state.children} rowKey="id" pagination={false} />
            <hr />
            <div style={{ height: '36px' }}>
              <span style={{ lineHeight: '36px', fontWeight: 'bold' }}>技师</span>
            </div>
            <Table columns={waiterColumns} dataSource={this.state.waiters} rowKey="employeeNum" pagination={false} />
            <hr />
            <div style={{ height: '36px' }}>
              <span style={{ lineHeight: '36px', fontWeight: 'bold' }}>迎宾</span>
            </div>
            <Table columns={hostessColumns} dataSource={this.state.hostess} rowKey="review" pagination={false} />
            <hr />
            <div style={{ height: '36px' }}>
              <span style={{ lineHeight: '36px', fontWeight: 'bold' }}>清洁</span>
            </div>
            <Table columns={healthColumns} dataSource={this.state.health} rowKey="review" pagination={false} />
            <hr />
            <div style={{ height: '36px' }}>
              <span style={{ lineHeight: '36px', fontWeight: 'bold' }}>团购信息</span>
            </div>
            <Table columns={groupColumns} dataSource={this.state.groupPurchase} rowKey="ticket" pagination={false} />
          </div>
        </div>

        <Modal
          title="退单"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          afterClose={this.afterClose}
          confirmLoading={this.state.confirmLoading}
        >
          {
            this.state.groupPurchase.length > 0 ?
              <div>
                <Alert
                  style={{ display: this.state.error ? 'block' : 'none' }}
                  message="请选择一张需要退单的团购券"
                  type="error"
                />
                <p>请选择团购券：</p>
                <RadioGroup onChange={this.onRadioChange} value={this.state.radioValue}>
                  {
                    this.state.groupPurchase.map(v => <Radio style={radioStyle} value={v.ticket}>{v.ticket}</Radio>)
                  }
                </RadioGroup>
              </div> :
              <p>确认退单么？</p>
          }

        </Modal>
      </div>
    )
  }
}