import { Table, Dropdown, Menu, Icon, Button, Input, Tag, Modal, Row, Col } from 'antd'
import { browserHistory } from 'react-router'
import { IntegerInput } from 'components'
import { getPopupContainer } from 'utils'
import styles  from './CouponExchange.less'
import _ from 'lodash'
const Search = Input.Search

export default class CouponExchange extends React.Component {

    state = {
        modal: {
          visible: false,
          data: null,
          increments: 0,
        }
    }

    showModal = (item) => {
      console.log(item)
      const state = _.clone(this.state)
      state.modal.visible = true
      state.modal.data = item
      state.modal.increments = 0
      this.setState(state)
    }

    increase = (n) => {
      const state = _.clone(this.state)
      state.modal.increments = n
      this.setState(state)
    }

    handleOk = (e) => {
      console.log(e)
      const state = _.clone(this.state)
      state.modal.visible = false
      this.setState(state)
    }

    handleCancel = (e) => {
      console.log(e)
      const state = _.clone(this.state)
      state.modal.visible = false
      this.setState(state)
    }

    handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination)
        console.log(filters)
        console.log(sorter)
        // const pager = { ...this.state.pagination };
        // pager.current = pagination.current;
        // this.setState({
        //   pagination: pager,
        // });
        // this.fetch({
        //   results: pagination.pageSize,
        //   page: pagination.current,
        //   sortField: sorter.field,
        //   sortOrder: sorter.order,
        //   ...filters,
        // });
    }

    componentDidMount = () => {
        const data = {
            coupons: [
                {
                    id: 1,
                    name: '8折券',
                    coupon: '满300减30',
                    point: '300',
                    store: ['门店1','门店2','门店3',],
                    service: ['服务1','服务2','服务3',],
                    validity: 15,
                    stock: 300,
                    status: 0, //0:停用 1:启用
                },
                {
                    id: 2,
                    name: '8折券',
                    coupon: '满300减30',
                    point: '300',
                    store: ['门店1','门店2','门店3',],
                    service: ['服务1','服务2','服务3',],
                    validity: 15,
                    stock: 300,
                    status: 1, //0:停用 1:启用
                },
                {
                    id: 3,
                    name: '8折券',
                    coupon: '满300减30',
                    point: '300',
                    store: ['门店1','门店2','门店3',],
                    service: ['服务1','服务2','服务3',],
                    validity: 15,
                    stock: 0,
                    status: 1, //0:停用 1:启用
                },
            ]
        }
        this.setState(data)
    }


    render() {

        const menu = (item) =>  (
          <Menu>
            <Menu.Item key="0">
              <a href="javascript:">编辑</a>
            </Menu.Item>
            <Menu.Item key="1">
              <a href="javascript:" onClick={this.showModal.bind(null, item)}>操作库存</a>
            </Menu.Item>

              {item.status !== 0 ? null : <Menu.Item><a href="javascript:" className={styles.enabled}>启用</a></Menu.Item>}

            <Menu.Divider />
            <Menu.Item key="2">
              {item.status !== 0 ? <a href="javascript:" className={styles.disabled}>停用</a> : <a href="javascript:" style={{color: 'red'}}>删除</a>}
            </Menu.Item>
          </Menu>
        )

        const columns = [{
            title: '#',
            dataIndex: 'id',
            sorter: true,
            render: (t, v) => ('# ' + t)
        }, {
            title: '名称',
            dataIndex: 'name',
            sorter: true,
        },{
            title: '优惠券',
            dataIndex: 'coupon',
            sorter: true,
        }, {
            title: '所需积分',
            dataIndex: 'point',
            sorter: true,
        }, {
            title: '适用门店',
            dataIndex: 'store',
            render: (t, v) => v.store.join('/')
        }, {
            title: '适用服务',
            dataIndex: 'service',
            render: (t, v) => v.service.join('/')
        }, {
            title: '有效期',
            dataIndex: 'validity',
            sorter: true,
            render: (t) => `${t}天   `
        }, {
            title: '库存',
            dataIndex: 'stock',
            sorter: true,
        }, {
          title: '状态',
          dataIndex: 'status',
          sorter: true,
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
        }, {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <Dropdown overlay={menu(record)}>
              <a className="ant-dropdown-link" href="javascript:">
                操作 <Icon type="down" />
              </a>
            </Dropdown>
          ),
        },]

        return (
            <div className="content-inner">
                <div className="panel">
                    <div className="panel-title">
                        <span>积分兑换优惠券列表</span>
                        <Button type="primary" style={{float:'right', marginTop: '-3px'}} onClick={() => { browserHistory.push('/coupon/exchange/new') }}>新建兑换</Button>
                    </div>
                    <div className="panel-body">
                        <Search placeholder="搜索" onPressEnter={(e) => { console.log(e.target.value) }} onSearch={value => console.log(value)} ></Search>
                        <hr />
                        <Table columns={columns} dataSource={this.state.coupons} rowKey="id" onChange={this.handleTableChange} />
                    </div>
                </div>
                <Modal
                  title="库存操作"
                  visible={this.state.modal.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
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
                      {this.state.modal.data ? this.state.modal.data.name : null}
                    </Col>
                    <Col span={8}>
                      {this.state.modal.data ? this.state.modal.data.stock : null}
                    </Col>
                    <Col span={8} style={{boxSizing:'border-box'}}>
                      <Button className={styles.groupBtn}
                        onClick={_=>{this.increase(Number(this.state.modal.increments) - 1)}}
                      >-</Button>
                      <IntegerInput className={styles.groupInput}
                        value={this.state.modal.increments}
                        onChange={_=>{this.increase(_)}} 
                      />
                      <Button className={styles.groupBtn}
                        onClick={_=>{this.increase(Number(this.state.modal.increments) + 1)}}
                      >+</Button>
                    </Col>
                  </Row>
                </Modal>
            </div>
        )
    }
}