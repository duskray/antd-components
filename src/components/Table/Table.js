import { Table } from 'antd'

export default class SortTable extends React.Component {
  state = {
    loading: false,
    sorter: {
      field: undefined,
      order: undefined,
    },
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    },
    data: [],
  }

  _onTableChange = async (pagination, filters, sorter) => {
    this.setState({
      loading: true
    })

    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    
    const rep = await this.props.getter({
      current: pager.current,
      pageSize: pager.pageSize,
      field: sorter.field,
      order: sorter.order,
    })

    this.props.setter(rep)

    this.setState({
      loading: false,
      pagination: pager,
      sorter,
    })
  }

  search = async () => {
    this.setState({
      loading: true
    })

    const rep = await this.props.getter({
      current: 1,
      pageSize: this.state.pagination.pageSize,
      field: this.state.sorter.field,
      order: this.state.sorter.order
    })

    this.props.setter(rep)

    const pagination = { ...this.state.pagination }
    pagination.current = 1
    this.setState({
      loading: false,
      pagination: pagination,
    })
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.total != this.state.pagination.total) {
      const pagination = { ...this.state.pagination }
      pagination.total = nextProps.total
      this.setState({
        pagination
      })
    }
  }

  render() {
    return (
      <Table
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        rowKey={this.props.rowKey || 'id'}
        bordered={this.props.bordered}
        scroll={this.props.scroll}
        loading={this.state.loading}
        pagination={this.state.pagination}
        onChange={this._onTableChange}>
      </Table>
    )
  }
}

{/* <Table 
  ref
  dataSource
  columns={columns}
  onSearch={this.search}
/> */}