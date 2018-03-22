import { Table, Input, Popconfirm, Icon } from 'antd';

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable });
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }
        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === 'save') {
                this.props.onChange(this.state.value);
            } else if (nextProps.status === 'cancel') {
                this.setState({ value: this.cacheValue });
                this.props.onChange(this.cacheValue);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
            nextState.value !== this.state.value;
    }
    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div>
                {
                    editable ?
                        <div>
                            <Input value={value} onChange={e => this.handleChange(e)} />
                        </div>
                        :
                        <div className="editable-row-text">
                            {value.toString() || ' '}
                        </div>
                }
            </div>
        );
    }
}

export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);

        this.columns = this.props.columns.map(v => (
            {
                title: v.title,
                dataIndex: v.dataIndex,
                render: (text, record, index) => this.renderColumns(this.state.data, index, v.dataIndex, text),
            }
        ))
        this.columns.push({
            title: '操作',
            dataIndex: 'operation',
            width: '120px',
            render: (text, record, index) => {
                const { editable } = this.state.data[index].withhold;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                    {/* <a onClick={() => this.editDone(index, 'save')}>Save</a>
                                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(index, 'cancel')}>
                                        <a>Cancel</a>
                                    </Popconfirm> */}
                                    <Icon type="check" onClick={() => this.editDone(index, 'save')} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                    <Icon type="close" onClick={() => this.editDone(index, 'cancel')} style={{ cursor: 'pointer' }} />
                                </span>
                                :
                                <span>
                                    <Icon type="edit" onClick={() => this.edit(index)} style={{ cursor: 'pointer' }} />
                                </span>
                        }
                    </div>
                );
            },
        })

        this.state = {
            data: []
        };
    }

    editableCols = ['base', 'timeAddition', 'seniority', 'evaluationAddition', 'groupTimeAddition', 'groupEvaluationAddition', 'flowAddition', 'withhold']

    componentWillMount = () => {
        this.setState({
            data: this.props.dataSource.map(v => {
                let record = {}
                for (let i in v) {
                    if (i == 'id') {
                        record[i] = v[i]
                    } else if (this.editableCols.includes(i)) {
                        record[i] = {
                            editable: false,
                            value: v[i],
                        }
                    } else {
                        record[i] = {
                            value: v[i],
                        }
                    }
                }
                return record
            })
        })
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            data: nextProps.dataSource.map(v => {
                let record = {}
                for (let i in v) {
                    if (i == 'id') {
                        record[i] = v[i]
                    } else if (this.editableCols.includes(i)) {
                        record[i] = {
                            editable: false,
                            value: v[i],
                        }
                    } else {
                        record[i] = {
                            value: v[i],
                        }
                    }
                }
                return record
            })
        })
    }

    renderColumns(data, index, key, text) {

        const { editable, status } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (<EditableCell
            editable={editable}
            value={text}
            onChange={value => this.handleChange(key, index, value)}
            status={status}
        />);
    }
    handleChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
    }
    edit(index) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({ data });
    }
    editDone(index, type) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = false;
                data[index][item].status = type;
            }
        });
        this.setState({ data }, () => {
            Object.keys(data[index]).forEach((item) => {
                if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                    delete data[index][item].status;
                }
            });
        });
    }
    render() {
        return <Table dataSource={this.props.dataSource} columns={this.columns} rowKey="id" />;
    }
}