import { DatePicker, Table, Select, Button, Row, Col } from 'antd'
import { getCalendarContainer } from 'utils'
import { BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts'
const Option = Select.Option

export default class Revenue extends React.Component {
    state = {

    }

    componentDidMount = () => {
        const data = {
            totalRevenue: 15000,
            serviceRevenue: 10000,
            itemRevenue: 5000,
            total: [
                {
                    name: '项目营收',
                    value: 343,
                },
                {
                    name: '加钟营收',
                    value: 140,
                },
                {
                    name: '商品营收',
                    value: 200,
                },

            ],
            service: [
                {
                    name: '养生',
                    value: 343,
                },
                {
                    name: '拔罐',
                    value: 343,
                },
            ],
            item: [
                {
                    name: '毛巾',
                    value: 343,
                },
                {
                    name: '小馄饨',
                    value: 343,
                },
            ]
        }

        this.setState({ ...data })
    }

    renderCustomizedLabel = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name} ￥${value}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };


    render() {

        const COLORS = ['#00b494', '#357cba', '#FAAD51', '#8A4DB9'];

        return (
            <div className="content-inner">
                <div className="panel">
                    <div className="panel-title">
                        <span>项目分类分析</span>
                    </div>
                    <div className="panel-body">
                        <div>
                            <DatePicker placeholder="开始日期" allowClear {...getCalendarContainer} style={{ margin: '0 8px 8px 0' }} />
                            <span style={{ margin: '0 8px 8px 0' }}>至</span>
                            <DatePicker placeholder="结束日期" allowClear {...getCalendarContainer} style={{ margin: '0 8px 8px 0' }} />
                            <Select allowClear placeholder="所有门店" style={{ width: 120, margin: '0 8px 8px 0' }}>
                                <Option value="0">门店1</Option>
                            </Select>
                            <Button type="primary" style={{ transform: 'translate(0, -1px)' }}>检索</Button>
                        </div>
                        <br />
                        <Row>
                            <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                                <p>{`总营收 ￥${this.state.totalRevenue}`}</p>
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie data={this.state.total} labelLine={false} label={this.renderCustomizedLabel} outerRadius="60%" paddingAngle={-1}>
                                            {
                                                this.state.total ? this.state.total.map((entry, index) => <Cell key={index} fill="#00b494" />) : null
                                            }
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </Col>
                            <Col sm={{ span: 6 }} xs={{ span: 24 }}>
                                <p>{`项目营收 ￥${this.state.serviceRevenue}`}</p>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={this.state.service} labelLine={false} label={this.renderCustomizedLabel} outerRadius="60%" paddingAngle={-1}>
                                            {
                                                this.state.service ? this.state.service.map((entry, index) => <Cell key={index} fill="#00b494" />) : null
                                            }
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </Col>
                            <Col sm={{ span: 6 }} xs={{ span: 24 }}>
                                <p>{`商品营收 ￥${this.state.itemRevenue}`}</p>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={this.state.item} labelLine={false} label={this.renderCustomizedLabel} outerRadius="60%" paddingAngle={-1}>
                                            {
                                                this.state.item ? this.state.item.map((entry, index) => <Cell key={index} fill="#00b494" />) : null
                                            }
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>



                    </div>
                </div>
            </div>

        );
    }
}