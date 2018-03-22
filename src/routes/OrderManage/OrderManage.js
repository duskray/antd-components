import React from 'react'
import { Table, Dropdown, Menu, Icon, Button, Input, Tag, Modal, Select, InputNumber, DatePicker, Row, Col } from 'antd'
import { browserHistory } from 'react-router'
import StoreSelecter from 'components/StoreSelecter'
import styles from './OrderManage.less'
import moment from 'moment'
import { nameSwitch, ax, getCalendarContainer } from 'utils'
const { TextArea, Search } = Input
const { RangePicker } = DatePicker

class OrderManage extends React.Component {
  state = {
    loading: false,
    stores: [],
    orders: [],
    keyword: '',
    current: 1,
    pageSize: 10,
    total: 0,
    sorter: {
      field: '',
      order: '',
    },

    remark: '',
    remarkUrl: '',
    remarkShow: false,
    remarkLoading: false,
    remarkData: null,
    remarkPayload: '',

    moment: [moment().subtract(30, 'days'), moment()],
    orderNum: '',
    tel: '',
    technicianNum: '',
    technicianName: '',
    waiterNum: '',
    waiterName: '',
    ticket: '',
  }
  sid = 0
  moment = [moment().subtract(30, 'days'), moment()]
  orderNum = ''
  tel = ''
  technicianNum = ''
  technicianName = ''
  waiterNum = ''
  waiterName = ''
  ticket = ''

  getList = (sid) => {
    this.setState({
      loading: true,
    })
    this.sid = sid
    ax.get('/stores/' + sid + '/orders', {
      start: this.moment[0].format('YYYY-MM-DD'),
      end: this.moment[1].format('YYYY-MM-DD'),
      orderNum: this.orderNum,
      tel: this.tel,
      technicianNum: this.technicianNum,
      technicianName: this.technicianName,
      waiterNum: this.waiterNum,
      waiterName: this.waiterName,
      ticket: this.ticket,

      keyword: this.state.keyword,
      current: this.state.current,
      pageSize: this.state.pageSize,
      field: this.state.sorter.field,
      order: this.state.sorter.order,
    })
      .then((d) => {
        this.setState({
          orders: d.orders,
          loading: false,
          total: d.total,
        })
      })
  }

  componentDidMount = () => {
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
        }, _ => {

        })
      })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      current: pagination.current,
      sorter,
    }, e => this.getList(this.sid));
  }

  // onSearch = (keyword) => {
  //   this.setState({
  //     keyword,
  //     loading: true,
  //   }, e => {
  //     ax.get('/stores/' + this.sid + '/orders', {
  //       keyword: this.state.keyword,
  //       current: 1,
  //       pageSize: this.state.pageSize,
  //       field: this.state.sorter.field,
  //       order: this.state.sorter.order
  //     }).then((d) => {
  //       this.setState({
  //         loading: false,
  //         orders: d.orders,
  //         total: d.total,
  //         current: 1,
  //       })
  //     })
  //   })
  // }

  orderClose = (d) => {
    this.setState({
      remark: '',
      remarkPayload: '',
      remarkShow: true,
      remarkUrl: 'close',
      remarkData: d,
    })
  }

  orderRefund = (d) => {
    this.setState({
      remark: '',
      remarkPayload: '',
      remarkShow: true,
      remarkUrl: 'refund',
      remarkData: d,
    })
  }

  orderCoupon = (d) => {
    this.setState({
      remark: '',
      remarkPayload: '',
      remarkShow: true,
      remarkUrl: 'coupon',
      remarkData: d,
    })
  }

  handleOk = (d) => {
    this.setState({
      remarkLoading: true
    })

    let param = {
      remark: this.state.remark
    }
    if (this.state.remarkUrl == 'refund') {
      param.refund = this.state.remarkPayload
    } else if (this.state.remarkUrl == 'coupon') {
      param.coupon = this.state.remarkPayload
    }
    ax.patch(`/stores/${this.sid}/orders/${d}/${this.state.remarkUrl}`, param).then(d => {
      this.setState({
        remarkShow: false,
        remarkLoading: false,
      })
      this.getList(this.sid)
    }).catch(e => {
      this.setState({
        remarkLoading: false,
      })
    })
  }

  handleCancel = (e) => {
    this.setState({
      remarkShow: false,
    });
  }

  onSearchClick = (e) => {
    this.moment = this.state.moment
    this.orderNum = this.state.orderNum
    this.tel = this.state.tel
    this.technicianNum = this.state.technicianNum
    this.technicianName = this.state.technicianName
    this.waiterNum = this.state.waiterNum
    this.waiterName = this.state.waiterName
    this.ticket = this.state.ticket

    this.setState({
      current: 1
    }, _ => {
      this.getList(this.sid)
    })

    
  }

  render() {

    const menu = (d) => {
      return (
        <Menu>
          <Menu.Item>
            <a href="javascript:;" onClick={_ => { browserHistory.push('/order/' + d.id) }}>查看详情</a>
          </Menu.Item>
          {
            d.status[0] == 0 || d.status[0] == 5 ? '' :
              <Menu.Item>
                <a href="javascript:;" className="text-red" onClick={e => this.orderClose(d)}>关闭订单</a>
              </Menu.Item>
          }
        </Menu>
      )
    }

    const columns = [{
      title: '单号',
      dataIndex: 'orderNumber',
      sorter: true,
    }, {
      title: '客户号码',
      dataIndex: 'cellNumber',
      render: (t, r) => `${t}(${r.userName})`,
      sorter: true,
    }, {
      title: '下单时间',
      dataIndex: 'time',
      sorter: true,
    }, {
      title: '项目',
      dataIndex: 'service',
      sorter: true,
    }, {
      title: '人数',
      dataIndex: 'nop',
      sorter: true,
    }, {
      title: '金额',
      dataIndex: 'op',
      sorter: true,
    }, {
      title: '优惠',
      dataIndex: 'discounts',
      sorter: true,
    }, {
      title: '合计',
      dataIndex: 'ap',
      sorter: true,
    }, {
      title: '支付方式',
      dataIndex: 'paymentType',
      render: (text, record) => (
        nameSwitch('payment', record.paymentType)
      ),
      sorter: true,
    }, {
      title: '状态',
      dataIndex: 'status',
      className: styles.statusCol,
      render: (text, record) => (
        record.status.map((v, i) => nameSwitch('order-tag', v))
      ),
      sorter: true,
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Dropdown overlay={menu(record)}>
          <a className="ant-dropdown-link" href="javascript:;">
            操作 <Icon type="down" />
          </a>
        </Dropdown>
      ),
    }]

    const pagination = {
      pageSize: this.state.pageSize,
      current: this.state.current,
      total: this.state.total,
    }

    const remarkTitle = {
      close: '关闭订单',
      refund: '退款',
      coupon: '返券',
    }[this.state.remarkUrl]

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getList} />
        <br />
        <div className="panel">
          <div className="panel-title">
            <span>订单列表</span>
          </div>
          <div className="panel-body">
            <Row gutter={16}>
              <Col span={6}>
                <RangePicker allowClear={false} onChange={s => this.setState({ moment: s })} value={this.state.moment} {...getCalendarContainer}></RangePicker>
              </Col>
              <Col span={6}>
                <Input onChange={s => this.setState({ orderNum: s.target.value })} value={this.state.orderNum} addonBefore="订单号码" />
              </Col>
              <Col span={6}>
                <Input onChange={s => this.setState({ tel: s.target.value })} value={this.state.tel} addonBefore="客户电话" />
              </Col>
              <Col span={6}>
                <Input onChange={s => this.setState({ ticket: s.target.value })} value={this.state.ticket} addonBefore="团购券码" />
              </Col>
            </Row>
            <br />
            <Row gutter={16}>
              <Col span={6}>
                <Input onChange={s => this.setState({ technicianNum: s.target.value })} value={this.state.technicianNum} addonBefore="技师工号" />
              </Col>
              <Col span={6}>
                <Input onChange={s => this.setState({ technicianName: s.target.value })} value={this.state.technicianName} addonBefore="技师姓名" />
              </Col>
              <Col span={6}>
                <Input onChange={s => this.setState({ waiterNum: s.target.value })} value={this.state.waiterNum} addonBefore="迎宾工号" />
              </Col>
              <Col span={6}>
                <Input onChange={s => this.setState({ waiterName: s.target.value })} value={this.state.waiterName} addonBefore="迎宾姓名" />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={this.onSearchClick}>检索</Button>
              </Col>
            </Row>
            <hr />
            <Table columns={columns} dataSource={this.state.orders} rowKey="id" onChange={this.handleTableChange} pagination={pagination} loading={this.state.loading} />
          </div>
        </div>

        <Modal
          title={remarkTitle}
          visible={this.state.remarkShow}
          onOk={_ => this.handleOk(this.state.remarkData.id)}
          onCancel={this.handleCancel}
          confirmLoading={this.state.remarkLoading}
        >
          {
            this.state.remarkUrl == 'refund'
              ? <InputNumber placeholder="退款金额" min={0} precision={0} onChange={v => this.setState({ remarkPayload: v })} value={this.state.remarkPayload} style={{ width: '100%', marginBottom: '10px' }}></InputNumber >
              : ''
          }
          {
            this.state.remarkUrl == 'coupon'
              ? <Select placeholder="优惠券" onChange={v => this.setState({ remarkPayload: v })} value={this.state.remarkPayload} style={{ width: '100%', marginBottom: '10px' }}></Select>
              : ''
          }
          <TextArea rows={4} placeholder="备注" onChange={e => this.setState({ remark: e.target.value })} value={this.state.remark} />
        </Modal>
      </div>
    )
  }
}

export default OrderManage
