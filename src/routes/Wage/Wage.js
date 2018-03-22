import { Table, Button, Modal, Icon, Input } from 'antd'
import { browserHistory } from 'react-router'
import { ax, nameSwitch } from 'utils'
import styles from './Wage.less'

export default class WageSearch extends React.Component {
    state = {
        month: '',
        time: '',
        wages: [],
        publishVisible: false,
        publishLoading: false,
        editVisible: false,
        editData: {},
    }
    id = this.props.params.id

    getList = () => {
        ax.get(`/wages/${this.id}`).then(d => {
            this.setState({
                store: d.store,
                month: d.month,
                time: d.time,
                wages: d.wages,
            })
        })
    }

    componentDidMount = () => {
        this.getList()
        // const wages = [
        //     {
        //         id: 1,
        //         employeeNum: '011',          // 工号
        //         name: '店长11',
        //         type: 5,                     // 0:技师 1:技师老师 2:迎宾 3:保洁 4:吧员 5:店长 6:店长助理

        //         base: '5000',                // 底薪
        //         timeAddition: '6572',        // 工龄工资
        //         quantityAddition: '1',        // 钟量提成
        //         groupQuantityAddition: '2',   // 小组钟量提成
        //         receiveAddition: '3',        // 待客提成
        //         flowAddition: '4',           // 客流提成
        //         sweepAddition: '5',          // 收床提成
        //         evaluateAddition: '1000',    // 个人评价奖励
        //         groupEvaluateAddition: '1',  // 小组评价奖励

        //         grossPay: '12527',           // 应发工资
        //         withhold: '0',               // 扣款
        //         netPay: '12527',             // 实发工资
        //     },

        // ]
        // this.setState({ wages })
    }

    // save = (e) => {

    //     browserHistory.push('/wage/search')
    // }

    publishShow = (e) => {
        this.setState({
            publishVisible: true,
        });
    }
    publishOk = (e) => {
        this.setState({
            publishLoading: true
        })
        ax.patch(`/wages/${this.id}`).then(e => {
            browserHistory.push('/wage/search')
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

    editShow = (d) => {
        this.setState({
            editData: d,
            editVisible: true,
        });
    }
    editOk = (e) => {
        const editData = this.state.editData
        ax.patch(`/wages/${this.id}/employee/${editData.id}`, {
            base: editData.base,                                      // 底薪
            timeAddition: editData.timeAddition,                      // 工龄工资
            quantityAddition: editData.quantityAddition,              // 钟量提成
            groupQuantityAddition: editData.groupQuantityAddition,    // 小组钟量提成
            receiveAddition: editData.receiveAddition,                // 待客提成
            flowAddition: editData.flowAddition,                      // 客流提成
            sweepAddition: editData.sweepAddition,                    // 收床提成
            evaluateAddition: editData.evaluateAddition,              // 个人评价奖励
            groupEvaluateAddition: editData.groupEvaluateAddition,    // 小组评价奖励
            withhold: editData.withhold,                              // 扣款
        }).then(d => {
            this.setState({
                editVisible: false,
            }, this.getList)
        })

    }
    editCancel = (e) => {
        this.setState({
            editVisible: false,
        });
    }

    editOnChange = (name, value) => {
        const editData = this.state.editData
        editData[name] = value
        editData.grossPay = Number(editData.base)
            + Number(editData.timeAddition)
            + Number(editData.quantityAddition)
            + Number(editData.groupQuantityAddition)
            + Number(editData.receiveAddition)
            + Number(editData.flowAddition)
            + Number(editData.sweepAddition)
            + Number(editData.evaluateAddition)
            + Number(editData.groupEvaluateAddition)
        editData.netPay = Number(editData.grossPay) - Number(editData.withhold)

        this.setState({
            editData,
        })
    }

    render() {
        const editData = this.state.editData
        const columns = [
            {
                title: '职位',
                dataIndex: 'type',
                render: t => nameSwitch('employee', t),
            },
            {
                title: '姓名',
                dataIndex: 'name',
                render: (t, d) => `#${d.employeeNum} ${d.name}`,
            },
            {
                title: '底薪',
                dataIndex: 'base',
            },
            {
                title: '工龄工资',
                dataIndex: 'timeAddition',
            },
            {
                title: '业绩提成',
                children: [
                    {
                        title: '钟量提成',
                        dataIndex: 'quantityAddition',
                    },
                    {
                        title: '小组钟量提成',
                        dataIndex: 'groupQuantityAddition',
                    },
                    {
                        title: '待客提成',
                        dataIndex: 'receiveAddition',
                    },
                    {
                        title: '客流提成',
                        dataIndex: 'flowAddition',
                    },
                    {
                        title: '收床提成',
                        dataIndex: 'sweepAddition',
                    },
                ]
            },
            {
                title: '评价奖励',
                children: [
                    {
                        title: '个人',
                        dataIndex: 'evaluateAddition',
                    },
                    {
                        title: '小组',
                        dataIndex: 'groupEvaluateAddition',
                    },
                ]
            },
            {
                title: '应发合计',
                dataIndex: 'grossPay',
            },
            {
                title: '扣款',
                dataIndex: 'withhold',
            },
            {
                title: '实发合计',
                dataIndex: 'netPay',
            },
            {
                title: '',
                key: 'action',
                render: (t, d) => {
                    return <Icon type="edit" onClick={() => this.editShow(Object.assign({}, d))} style={{ cursor: 'pointer' }} />
                }
            }
        ]

        return (
            <div className="content-inner">
                <div className="panel">
                    <div className="panel-title">
                        <span>工资查询发布</span>
                    </div>
                    <div className="panel-body">
                        {/* <p style={{ fontSize: '16px', padding: '0 0 20px 0' }}>{this.state.store + '   ' + this.state.time}</p> */}
                        <p style={{ fontSize: '16px', padding: '0 0 20px 0' }}>{this.state.store}<span style={{ fontSize: '12px', margin: '0 0 0 20px' }}>{this.state.time}</span></p>
                        <Table columns={columns} dataSource={this.state.wages} rowKey="id" bordered />
                        <hr />
                        <Button className="margin-right" onClick={() => browserHistory.push('/wage/search')}>返回</Button>
                        {/* <Button type="primary" className="margin-right" onClick={this.save}>保存</Button> */}
                        <Button type="primary" className="margin-right" onClick={this.publishShow}>发布</Button>

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

                <Modal
                    title={`工资调整 #${this.state.editData.employeeNum} ${this.state.editData.name}`}
                    visible={this.state.editVisible}
                    onOk={this.editOk}
                    onCancel={this.editCancel}
                >
                    <table className={styles.table}>
                        <thead>
                        </thead>
                        <tbody>
                            <tr>
                                <td>底薪</td>
                                <td><Input disabled={![1, 2, 3, 4, 5, 6].includes(editData.type)} value={editData.base} onChange={e => this.editOnChange('base', e.target.value)}></Input></td>
                            </tr>
                            <tr>
                                <td>工龄工资</td>
                                <td><Input disabled={![2, 3, 4, 5, 6].includes(editData.type)} value={editData.timeAddition} onChange={e => this.editOnChange('timeAddition', e.target.value)}></Input></td>
                            </tr>
                            <tr>
                                <td>钟量提成</td>
                                <td><Input disabled={![0, 1, 5, 6].includes(editData.type)} value={editData.quantityAddition} onChange={e => this.editOnChange('quantityAddition', e.target.value)}></Input></td>
                            </tr>
                            <tr>
                                <td>小组钟量提成</td>
                                <td><Input disabled={![1].includes(editData.type)} value={editData.groupQuantityAddition} onChange={e => this.editOnChange('groupQuantityAddition', e.target.value)}></Input></td>
                            </tr>
                            <tr>
                                <td>待客提成</td>
                                <td><Input disabled={![2].includes(editData.type)} value={editData.receiveAddition} onChange={e => this.editOnChange('receiveAddition', e.target.value)}></Input></td>
                            </tr>
                            <tr>
                                <td>客流提成</td>
                                <td><Input disabled={![4].includes(editData.type)} value={editData.flowAddition} onChange={e => this.editOnChange('flowAddition', e.target.value)}></Input></td>
                            </tr>
                            <tr>
                                <td>收床提成</td>
                                <td><Input disabled={![3].includes(editData.type)} value={editData.sweepAddition} onChange={e => this.editOnChange('sweepAddition', e.target.value)}></Input></td>
                            </tr>
                            <tr>
                                <td>个人评价奖励</td>
                                <td><Input disabled={![0, 1, 2, 5, 6].includes(editData.type)} value={editData.evaluateAddition} onChange={e => this.editOnChange('evaluateAddition', e.target.value)}></Input></td>
                            </tr>
                            <tr>
                                <td>小组评价奖励</td>
                                <td><Input disabled={![1].includes(editData.type)} value={editData.groupEvaluateAddition} onChange={e => this.editOnChange('groupEvaluateAddition', e.target.value)}></Input></td>
                            </tr>
                            <tr>
                                <td>应发合计</td>
                                <td>{this.state.editData.grossPay}</td>
                            </tr>
                            <tr><td colSpan='2'><hr /></td></tr>
                            <tr>
                                <td>扣款</td>
                                <td><Input value={this.state.editData.withhold} onChange={e => this.editOnChange('withhold', e.target.value)}></Input></td>
                            </tr>
                            <tr>
                                <td>实发合计</td>
                                <td>{this.state.editData.netPay}</td>
                            </tr>
                        </tbody>
                    </table>
                </Modal>
            </div>
        )
    }
}