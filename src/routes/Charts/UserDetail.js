import { Button, Table } from 'antd'
import { download, ax } from 'utils'

export default class UserDetail extends React.Component {
  state = {
    count: 0,
    data: [],
  }
  date = this.props.params.date
  
  // download = () => {
  //   // ax.get(`/charts/new/user/download`, {
  //   //   date: this.date
  //   // }).then(d => {
  //   //   const iframe = document.createElement('iframe')
  //   //   iframe.src = d
  //   //   iframe.style.display = 'none'
  //   //   document.body.appendChild(iframe)
  //   // })
    
  // }

  componentDidMount = () => {
    ax.get(`/charts/new/user`, { date: this.date }).then(d => {
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
          title: '注册时间',
          dataIndex: 'createTime',
        },
        {
          title: '注册渠道',
          dataIndex: 'registerChannel',
          render: t => {
            switch(t) {
              case '1': return '微信'
              case '2': return 'APP'
              default:  return ''
            }
          }
        },
      ]

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title" style={{display:'flex', justifyContent:'space-between'}}>
            <span style={{lineHeight:'28px'}}>用户明细 {this.date} </span>
            <Button type="primary" onClick={e => download(`/charts/new/user/download`, { date: this.date })} >下载</Button>
          </div>
          <div className="panel-body">
            <h2>新增用户数：{this.state.count}人</h2>
            <Table columns={columns} dataSource={this.state.data} rowKey="id" loading={this.state.loading}></Table>
          </div>
        </div>
      </div>
    )
  }
}