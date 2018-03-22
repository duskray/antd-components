import { Table, Button } from 'antd'
import { browserHistory } from 'react-router'
import StoreSelecter from 'components/StoreSelecter'
import { ax } from 'utils'

export default class Rules extends React.Component {
  state = {
    loading: false,
    stores: [],
    rules: [{ id: 0, name: '技师', }, { id: 1, name: '技师老师', }, { id: 2, name: '迎宾', }, { id: 3, name: '保洁', }, { id: 4, name: '吧台', }, { id: 5, name: '店长', }, { id: 6, name: '店长助理', },]
  }
  sid = 0

  getDetail = (sid) => {
    this.sid = sid
  }

  componentDidMount = () => {
    this.setState({
      loading: true
    })
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
          loading: false,
        })
      })
  }

  render() {
    const columns = [
      {
        title: '职位',
        dataIndex: 'name',
      },
      {
        title: '操作',
        key: 'id',
        render: (t, v) => (
          <Button onClick={_ => { browserHistory.push(`/stores/${this.sid}/wage/rules/${v.id}`) }}>编辑</Button>
        )
      },
    ]

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getDetail} />
        <br />
        <div className="panel">
          <div className="panel-title">
            <span>工资规则</span>
          </div>
          <div className="panel-body">
            <Table columns={columns} dataSource={this.state.rules} rowKey="id" pagination={false} loading={this.state.loading} />
          </div>
        </div>
      </div>
    )
  }
}