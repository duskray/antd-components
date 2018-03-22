import { Form, Input, Button, Select, Row, Col, InputNumber } from 'antd'
import { browserHistory } from 'react-router'
import { formItemLayout, formButtonLayout, ax } from 'utils'
const Item = Form.Item
const Option = Select.Option;
const { TextArea } = Input;

class RuleSetting1 extends React.Component {

  state = {

  }
  sid = this.props.params.sid

  componentDidMount = () => {
    ax.get(`/stores/${this.sid}/wages/rules/1`).then(d => {
      this.props.form.setFieldsValue(d)
    })
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (let v in values) {
          values[v] = values[v] == null ? 0 : values[v]
        }
        console.log('Received values of form: ', values)
        ax.patch(`/stores/${this.sid}/wages/rules/1`, values)
      }
    });
  }



  render() {
    const { getFieldDecorator } = this.props.form;
  

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>技师老师工资规则</span>
          </div>
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <Item {...formItemLayout} label="底薪（元）" >
                {getFieldDecorator('base')( <InputNumber precision={0} min={0} style={{ width: '100%' }}/> )}
              </Item>
              <hr />
              <Item {...formItemLayout} label="钟量提成" >
                <Row>
                  <Col span={12}>
                    月总钟量数
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
              <Item {...formItemLayout} label="评价奖励">
                <span style={{marginRight:'8px'}}>五星好评单钟提成奖励</span>
                 {getFieldDecorator('evaluationAddition')(<InputNumber precision={0} min={0}/>)}
                 <span>元</span>
              </Item>
              <hr />
              <Item {...formItemLayout} label="小组钟量提成" >
                <Row>
                  <Col span={12}>
                    月总钟量数
                  </Col>
                  <Col span={12}>
                    单钟提成（元）
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <span style={{marginRight:'8px'}}>≤</span>
                    {getFieldDecorator('groupLess')(<InputNumber precision={0} min={0}/>)}
                  </Col>
                  <Col span={12}>
                    {getFieldDecorator('groupLessAddition')(<InputNumber precision={0} min={0} style={{ width: '100%' }}/>)}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <span style={{marginRight:'8px'}}>&gt;</span>
                    {getFieldDecorator('groupMore')(<InputNumber precision={0} min={0}/>)}
                  </Col>
                  <Col span={12}>
                    {getFieldDecorator('groupMoreAddition')(<InputNumber precision={0} min={0} style={{ width: '100%' }}/>)}
                  </Col>
                </Row>
              </Item>
              <hr />
              <Item {...formItemLayout} label="小组评价奖励">
                <span style={{marginRight:'8px'}}>五星好评率达</span>
                 {getFieldDecorator('groupEvaluationPercent')(<InputNumber precision={0} min={0} max={100}/>)}
                 <span style={{marginRight:'8px'}}>%，单钟提成奖励</span>
                 {getFieldDecorator('groupEvaluationAddition')(<InputNumber precision={0} min={0}/>)}
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

export default Form.create()(RuleSetting1)