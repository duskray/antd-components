import { Checkbox } from 'antd'
const CheckboxGroup = Checkbox.Group

export default class CheckGroup extends React.Component {
    // props.options

    state = {
        checkedList: [],
        indeterminate: false,
        checkAll: false,
    }

    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.props.options.length),
            checkAll: checkedList.length === this.props.options.length,
        });
        this.props.onChange(checkedList)
    }

    onCheckAllChange = (e) => {
        let checkedList = e.target.checked ? this.props.options.map(_=>_.value) : []
        this.setState({
            checkedList,
            indeterminate: false,
            checkAll: e.target.checked,
        });
        this.props.onChange(checkedList)
    }

    render () {
        return (
            <div>
                <Checkbox
                    checked={this.state.checkAll}
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange }
                >
                全选
                </Checkbox>
                <hr style={{margin:'10px 0'}} />
                <CheckboxGroup 
                    options={this.props.options} 
                    value={this.state.checkedList} 
                    onChange={this.onChange}
                />
            </div>
        )
    }
}