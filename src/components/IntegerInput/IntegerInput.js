import { Input, Tooltip } from 'antd';

export default class IntegerInput extends React.Component {
  onChange = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)?$/
    if ((!isNaN(value) && reg.test(value))) {
      this.props.onChange(value);
    }
    if (value === '' || value === '-') {
      this.props.onChange(value)
    }
  }
  onBlur = () => {
    const { onBlur, onChange } = this.props;
    let { value = '' } = this.props
    value += ''
    if (value === '') {
      onChange('0')
    }
    if (value === '-') {
      onChange('-1')
    }
    if (onBlur) {
      onBlur();
    }
  }
  render() {
    // const { value = '' } = this.props;
    // const formatNumber = (value) => {
    //   value += '';
    //   const list = value.split('.');
    //   const prefix = list[0].charAt(0) === '-' ? '-' : '';
    //   let num = prefix ? list[0].slice(1) : list[0];
    //   let result = '';
    //   while (num.length > 3) {
    //     result = `,${num.slice(-3)}${result}`;
    //     num = num.slice(0, num.length - 3);
    //   }
    //   if (num) {
    //     result = num + result;
    //   }
    //   return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
    // }
    // const title = value ? (
    //   <span className="numeric-input-title">
    //     {value !== '-' ? formatNumber(value) : '-'}
    //   </span>
    // ) : '';

    
    
    return (
      <Input
        {...this.props}
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    );
  }
}