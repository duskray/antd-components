import { Form, Input, Button, Select, Row, Col, InputNumber } from 'antd'
import { browserHistory } from 'react-router'
import { formItemLayout, formButtonLayout, ax } from 'utils'
const Item = Form.Item
const Option = Select.Option
const { TextArea } = Input

class RuleSetting6 extends React.Component {

  state = {

  }
  sid = this.props.params.sid

  componentDidMount = () => {
    ax.get(`/stores/${this.sid}/wages/rules/6`).then(d => {
      if (d.seniority != null) {
        d.seniority = String(d.seniority)
      } else {
        d.seniority = '1'
      }
      this.props.form.setFieldsValue(d)
    })
  }
  
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (let v in values) {
          values[v] = values[v] == null ? 0 : values[v]
        }
        console.log('Received values of form: ', values)
        ax.patch(`/stores/${this.sid}/wages/rules/6`, values)
      }
    })
  }



  render() {
    const { getFieldDecorator } = this.props.form;
  

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>店助工资规则</span>
          </div>
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <Item {...formItemLayout} label="底薪（元）" >
                {getFieldDecorator('base')(
                  <InputNumber precision={0} min={0} style={{ width: '100%' }}/>
                )}
              </Item>
              <hr />
              <Item {...formItemLayout} label="钟量提成" >
                <Row>
                  <Col span={12}>
                    日均钟量数
                  </Col>
                  <Col span={12}>
                    单钟提成（元）
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <span style={{marginRight:'8px'}}>≤</span>
                    {getFieldDecorator('less')(<InputNumber precision={0} min={0}/>)}
                  </Col>
                  <Col span={12}>
                    {getFieldDecorator('lessAddition')(<InputNumber precision={0} min={0} style={{ width: '100%' }}/>)}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <span style={{marginRight:'17px'}}></span>
                    {getFieldDecorator('from')(<InputNumber precision={0} min={0}/>)}
                    <span style={{marginRight:'8px'}}>-</span>
                    {getFieldDecorator('to')(<InputNumber precision={0} min={0}/>)}
                  </Col>
                  <Col span={12}>
                    {getFieldDecorator('betweenAddition')(<InputNumber precision={0} min={0} style={{ width: '100%' }}/>)}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <span style={{marginRight:'8px'}}>≥</span>
                    {getFieldDecorator('more')(<InputNumber precision={0} min={0}/>)}
                  </Col>
                  <Col span={12}>
                    {getFieldDecorator('moreAddition')(<InputNumber precision={0} min={0} style={{ width: '100%' }}/>)}
                  </Col>
                </Row>
              </Item>
              <hr />
              <Item {...formItemLayout} label="工龄工资">
                <span style={{marginRight:'8px'}}>满</span>
                <div style={{display:'inline-block',marginRight:'8px'}}>
                  {getFieldDecorator('seniority', {
                    initialValue: '1'
                  })(
                    <Select size="large">
                      <Option value="0">半年</Option>
                      <Option value="1">一年</Option>
                    </Select>
                  )}
                </div>
                {getFieldDecorator('seniorityAddition')(<InputNumber precision={0} min={0}/>)}
                <span style={{marginRight:'8px'}}>元，最高封顶</span>
                {getFieldDecorator('seniorityAdditionMax')(<InputNumber precision={0} min={0}/>)}
                <span>元</span>
              </Item>
              <hr />
              <Item {...formItemLayout} label="评价奖励">
                <span style={{marginRight:'8px'}}>五星好评率达</span>
                 {getFieldDecorator('evaluationPercent')(<InputNumber precision={0} min={0} max={100}/>)}
                 <span style={{marginRight:'8px'}}>%，单钟提成奖励</span>
                 {getFieldDecorator('evaluationAddition')(<InputNumber precision={0} min={0}/>)}
                 <span>元</span>
              </Item>
              <hr />
              <Item {...formButtonLayout}>
                <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                <Button onClick={ _ => { browserHistory.push('/wage/rules') } }>返回</Button>
              </Item>
            </Form>
          </div>
        </div>
        
      </div>
    )
  }
}

export default Form.create()(RuleSetting6)