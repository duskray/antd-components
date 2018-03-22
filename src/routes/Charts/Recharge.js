import { DatePicker, Button } from 'antd'
import Table from 'components/Table'
import { getCalendarContainer, ax } from 'utils'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import moment from 'moment'
const { MonthPicker } = DatePicker

export default class Recharge extends React.Component {
    state = {
        recharge: 0,
        population: 0,
    }
    month = moment().format('YYYY-MM')

    getList = (params) => {
        return ax.get(`/charts/recharge`, {
            month: this.month,
            ...params
        })
    }

    onReceive = (rep) => {
        this.setState({ ...rep })
    }

    download = () => {
        ax.get(`/charts/recharge/download`, {
            month: this.month,
        }).then(d => {
            const iframe = document.createElement('iframe')
            iframe.src = d
            iframe.style.display = 'none'
            document.body.appendChild(iframe)
        })
    }

    onMonthChange = (month) => {
        this.month = month.format('YYYY-MM')
        this.refs.table.search()
    }

    componentDidMount = () => {
        this.refs.table.search()
    }


    render() {
        const columns = [
            {
                title: '时间',
                dataIndex: 'date',
                sorter: true,
            },
            {
                title: '账号',
                dataIndex: 'account',
            },
            {
                title: '姓名',
                dataIndex: 'name',
            },
            {
                title: '充值金额',
                dataIndex: 'recharge',
                sorter: true,
            },
        ]

        return (
            <div className="content-inner">
                <div className="panel">
                    <div className="panel-title">
                        <MonthPicker allowClear={false} placeholder="请选择月份" {...getCalendarContainer} defaultValue={moment()} onChange={this.onMonthChange} />
                        <Button type="primary" onClick={this.download} style={{ float: 'right', transform: 'translate(0, -1px)' }}>下载</Button>
                    </div>
                    <div className="panel-body">
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart data={this.state.chart}>
                                <XAxis dataKey="date" />
                                <YAxis yAxisId="1" orientation="right" dataKey="recharge" />
                                <YAxis yAxisId="0" orientation="left" dataKey="population" />
                                <Tooltip formatter={(value, name, chart, id) => id == 1 ? '￥' + value : value} />
                                <Legend align="right" verticalAlign="top" height={40} formatter={(text, chart, id) => id == 1 ? `${text}(￥${this.state.recharge})` : `${text}(${this.state.population}人)`} />
                                <CartesianGrid stroke='#f5f5f5' />
                                <Bar yAxisId="0" name="充值人数" dataKey='population' maxBarSize={20} fill='#00b494' />
                                <Line name="充值金额" type='linear' dataKey='recharge' yAxisId="1" stroke='#357cba' strokeWidth={2} />
                            </ComposedChart>
                        </ResponsiveContainer>
                        <hr />
                        <Table ref="table" columns={columns} dataSource={this.state.table} total={this.state.total} getter={this.getList} setter={this.onReceive} />
                    </div>
                </div>
            </div>

        );
    }
}