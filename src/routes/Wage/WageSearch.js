import { Table, Button, Select, Dropdown, Menu, Icon, Modal } from 'antd'
import { browserHistory } from 'react-router'
import StoreSelecter from 'components/StoreSelecter'
import { ax } from 'utils'
const Option = Select.Option


export default class WageSearch extends React.Component {
  state = {
    loading: false,
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    },
    stores: [],
    wages: [],
    currentSotre: null,
    publishVisible: false,
    publishLoading: false,
    publishData: null,
  }

  getList = () => {
    this.setState({
      loading: true
    })
    ax.get(`/stores/${this.state.currentSotre}/wages`, {
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
    }).then(d => {
      const pagination = { ...this.state.pagination }
      pagination.total = d.total
      this.setState({
        loading: false,
        pagination,
        wages: d.wages,
      })
    })
  }

  storeChange = (sid) => {
    window.localStorage.setItem(`currentSotre`, sid)
    this.setState({
      currentSotre: sid
    }, this.getList)
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    }, this.getList)
  }



  publishShow = (item) => {
    this.setState({
      publishVisible: true,
      publishData: item,
    });
  }
  
  publishOk = (e) => {
    this.setState({
      publishLoading: true
    })
    ax.patch(`/wages/${this.state.publishData.id}`).then(e => {
      this.setState({
        publishVisible: false,
        publishLoading: false,
      })
      this.getList()
    }).catch(e => {
      this.setState({
        publishLoading: false,
      })
    })
  }

  publishCancel = (e) => {
    this.setState({
      publishVisible: false,
    });
  }

  componentDidMount = () => {
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
        }, _ => {
          const c = window.localStorage.getItem(`currentSotre`)
          if (c && this.state.stores.map(v => v.id).includes(c)) {
            this.setState({
              currentSotre: c
            }, this.getList)
          }
          this.timer = setInterval(e => {
            if (this.state.currentSotre) {
              this.getList()
            }
          }, 10000)
        })
      })
  }

  componentWillUnmount = () => {
    clearInterval(this.timer)
  }

  render() {
    const menu = (item) => (
      <Menu>
        <Menu.Item>
          <a href="javascript:;" onClick={e => browserHistory.push('/wage/' + item.id)}>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:;" className="text-green" onClick={e => this.publishShow(item)}>发布</a>
        </Menu.Item>
        {/* <Menu.Divider />
        <Menu.Item>
          <a href="javascript:;" onClick={e => this.del(item)} >删除</a>
        </Menu.Item> */}
      </Menu>
    )

    const columns = [
      {
        title: '工资月份',
        dataIndex: 'month',
      },
      {
        title: '工资结算日期',
        dataIndex: 'time',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (t) => {
          switch (t) {
            case 0: return '计算中'
            case 1: return '未发布'
            case 2: return '已发布'
            default: return null
          }
        },
      },
      {
        title: '操作',
        key: 'id',
        render: (text, record) => (
          record.status == 1
            ?
            <Dropdown overlay={menu(record)}>
              <a className="ant-dropdown-link" href="javascript:;">
                操作 <Icon type="down" />
              </a>
            </Dropdown>
            :
            null
        ),
      },
    ]


    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>工资查询发布</span>
          </div>
          <div className="panel-body">
            <Select value={this.state.currentSotre} onChange={this.storeChange} placeholder="选择门店" autoFocus={true} dropdownMatchSelectWidth={false} style={{ minWidth: '256px', marginBottom: '20px' }}>
              {
                this.state.stores.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)
              }
            </Select>
            <Button type="primary" style={{ float: 'right' }} onClick={e => browserHistory.push('/wage/create')}>新建</Button>
            <Table columns={columns} dataSource={this.state.wages} rowKey="id" loading={this.state.loading} pagination={this.state.pagination} onChange={this.handleTableChange} />
          </div>
        </div>

        <Modal
          title="发布工资"
          visible={this.state.publishVisible}
          onOk={this.publishOk}
          onCancel={this.publishCancel}
          confirmLoading={this.state.publishLoading}
        >
          <p>确定要发布该月工资？</p>
        </Modal>

      </div>
    )
  }
}