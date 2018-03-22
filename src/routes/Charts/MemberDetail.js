import { Button, Table } from 'antd'
import { download, ax } from 'utils'

export default class UserDetail extends React.Component {
  state = {
    loading: true,
    count: 0,
    totalPrice: 0,
    data: [],
  }
  date = this.props.params.date

  componentDidMount = () => {
    ax.get(`/charts/new/member`, { date: this.date }).then(d => {
      this.setState({
        ...d,
        loading: false
      })
    })
  }


  render() {
    const columns = [
        {
          title: '客户',
          dataIndex: 'user',
        },
        {
          title: '购买时间',
          dataIndex: 'buyTime',
        },
        {
          title: '支付金额',
          dataIndex: 'price',
        },
        {
          title: '购买渠道',
          dataIndex: 'buyChannel',
        },
        {
          title: '支付渠道',
          dataIndex: 'payChannel',
        },
        {
          title: '微信单号',
          dataIndex: 'wechatTradeNo',
        },
        {
          title: '支付宝单号',
          dataIndex: 'alipayTradeNo',
        },
      ]

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title" style={{display:'flex', justifyContent:'space-between'}}>
            <span style={{lineHeight:'28px'}}>会员明细 {this.date} </span>
            <Button type="primary" onClick={e => download(`/charts/new/member/download`, { date: this.date })} >下载</Button>
          </div>
          <div className="panel-body">
            <h2>会员卡销售：{this.state.count}笔 | {this.state.totalPrice}元</h2>
            <Table columns={columns} dataSource={this.state.data} rowKey="id" loading={this.state.loading}></Table>
          </div>
        </div>
      </div>
    )
  }
}