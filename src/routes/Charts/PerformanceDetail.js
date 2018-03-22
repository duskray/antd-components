import { DatePicker, Select, TimePicker, Tag, Button, Icon } from 'antd'
import Table from 'components/Table'
import { getCalendarContainer, nameSwitch, ax, getQueryParam } from 'utils'
import moment from 'moment'
const Option = Select.Option
const { RangePicker } = DatePicker

export default class PerformanceDetail extends React.Component {
  state = {
    total: 0,
    serviceInfo: []
  }
  date = this.props.params.date
  type = this.props.params.type
  store = getQueryParam().store
  serviceCol = []

  getter = (param) => {
    return ax.get(`/charts/performance/detail`, {
      date: this.date,
      store: this.store,
      type: this.type,
      ...param
    })
  }

  setter = (rep) => {
    this.setState({
      ...rep,
    })
  }

  download = () => {
    ax.get(`/charts/performance/detail/download`, {
      date: this.date,
      store: this.store,
      type: this.type,
    }).then(d => {
      const iframe = document.createElement('iframe')
      iframe.src = d
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
    })
  }

  componentDidMount = () => {
    this.refs.table.search()
  }


  render() {
    const serviceCols = []
    if (this.type == 0 && this.state.serviceInfo) {
       this.state.serviceInfo.map(s => {
      serviceCols.push({
        title: s.name,
        children: [
          {
            title: '钟数',
            dataIndex: s.id + '_count',
          },
          {
            title: '5星',
            dataIndex: s.id + '_five',
          },
          {
            title: '4星',
            dataIndex: s.id + '_four',
          },
          {
            title: '3星',
            dataIndex: s.id + '_three',
          },
          {
            title: '2星',
            dataIndex: s.id + '_two',
          },
          {
            title: '1星',
            dataIndex: s.id + '_one',
          },
          {
            title: '未评价',
            dataIndex: s.id + '_zero',
          },
        ],
      })
    })
    }
   
    const columns = (type) => {
      switch (type) {
        case '0':
          return [
            {
              title: '工号',
              dataIndex: 'employeeNum',
              fixed: 'left',
              width: 80,
              render: (value, row, index) => {
                return {
                  children: value,
                  props: {
                    rowSpan: row.span
                  },
                }
              }
            },
            {
              title: '姓名',
              dataIndex: 'name',
              fixed: 'left',
              width: 80,
              render: (value, row, index) => {
                return {
                  children: value,
                  props: {
                    rowSpan: row.span
                  },
                }
              }
            },
            {
              title: '上钟总数',
              dataIndex: 'mainOrderCount',
              fixed: 'left',
              width: 80,
              render: (value, row, index) => {
                return {
                  children: value,
                  props: {
                    rowSpan: row.span
                  },
                }
              }
            },
            {
              title: '加钟总数',
              dataIndex: 'delayOrderCount',
              fixed: 'left',
              width: 80,
              render: (value, row, index) => {
                return {
                  children: value,
                  props: {
                    rowSpan: row.span
                  },
                }
              }
            },
            ...serviceCols
          ]
        case '2':
          return [
            {
              title: '工号',
              dataIndex: 'employeeNum',
            },
            {
              title: '姓名',
              dataIndex: 'name',
            },
            {
              title: '待客单数',
              dataIndex: 'orderCount',
            },
            {
              title: '待客人数',
              dataIndex: 'personCount',
            },
            {
              title: '5星',
              dataIndex: '5',
            },
            {
              title: '4星',
              dataIndex: '4',
            },
            {
              title: '3星',
              dataIndex: '3',
            },
            {
              title: '2星',
              dataIndex: '2',
            },
            {
              title: '1星',
              dataIndex: '1',
            },
            {
              title: '未评价',
              dataIndex: '0',
            },
          ]
        case '3':
          return [
            {
              title: '工号',
              dataIndex: 'employeeNum',
            },
            {
              title: '姓名',
              dataIndex: 'name',
            },
            {
              title: '收床数',
              dataIndex: 'count',
            },
          ]
      }
    }

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>
              {this.type == 0 ? '员工' : this.type == 2 ? '迎宾' : '保洁'}
              业绩明细
              </span>
            <Button type="primary" onClick={this.download} style={{ float: 'right', transform: 'translate(0, -3px)' }}>下载</Button>
          </div>
          <div className="panel-body">
            <Table ref="table" bordered columns={columns(this.type)} dataSource={this.state.data} total={this.state.total} getter={this.getter} setter={this.setter} scroll={this.type == 0 ? { x: 3000 } : undefined} />
          </div>
        </div>
      </div>
    )
  }
}