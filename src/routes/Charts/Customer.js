import { DatePicker, Table, Select, TimePicker, Button } from 'antd'
import { getCalendarContainer } from 'utils'
const Option = Select.Option

export default class Customer extends React.Component {
    state = {

    }

    componentDidMount = () => {
        const data = {

            customers: [
                {
                    id: 1,
                    time: '2017-08-02 21:21',
                    account: '1435435',
                    from: 1, // 1:微信 2:APP 3:团购
                    store: '门店',
                    consume: '1200',
                },
                {
                    id: 2,
                    time: '2017-08-02 21:21',
                    account: '1435435',
                    from: 2, // 1:微信 2:APP 3:团购
                    store: '门店',
                    consume: '1200',
                },
                {
                    id: 3,
                    time: '2017-08-02 21:21',
                    account: '1435435',
                    from: 3, // 1:微信 2:APP 3:团购
                    store: '门店',
                    consume: '1200',
                },
            ]
        }

        this.setState({ ...data })
    }



    render() {
        const columns = [
            {
                title: '时间',
                dataIndex: 'time',
            },
            {
                title: '账号',
                dataIndex: 'account',
            },
            {
                title: '来源',
                dataIndex: 'from',
                render: (v) => {
                    switch(v) {
                        case 1: return '微信'
                        case 2: return 'APP'
                        case 3: return '团购'
                    }
                }
            },
            {
                title: '门店',
                dataIndex: 'store',
            },
            {
                title: '消费金额',
                dataIndex: 'consume',
                render: (v) => '￥' + v
            },
        ]



        return (
            <div className="content-inner">
                <div className="panel">
                    <div className="panel-title">
                        <span>来客分析</span>
                    </div>
                    <div className="panel-body">
                        <div>
                            <DatePicker placeholder="开始日期" allowClear {...getCalendarContainer} style={{margin:'0 8px 8px 0'}}/>
                            <span style={{margin:'0 8px 8px 0'}}>至</span>
                            <DatePicker placeholder="结束日期" allowClear {...getCalendarContainer} style={{margin:'0 8px 8px 0'}}/>
                            <TimePicker placeholder="开始时间" allowClear format='HH:mm' style={{margin:'0 8px 8px 0'}}/>
                            <span style={{margin:'0 8px 8px 0'}}>至</span>
                            <TimePicker placeholder="结束时间" allowClear format='HH:mm' style={{margin:'0 8px 8px 0'}}/>
                            <Select  placeholder="所有门店" allowClear style={{ width: 120, margin:'0 8px 8px 0' }}>
                                <Option value="0">门店1</Option>
                            </Select>
                            <Button type="primary" style={{transform:'translate(0, -1px)'}}>检索</Button>
                        </div>
                        <br />
                        <Table columns={columns} dataSource={this.state.customers} rowKey="id" />
                    </div>
                </div>
            </div>
        )
    }
}