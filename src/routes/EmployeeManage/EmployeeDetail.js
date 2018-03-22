import { Tag, Row, Col, Timeline } from 'antd'
import { nameSwitch, ax } from 'utils'

export default class EmployeeDetail extends React.Component {
  state = {
    name: '',
    id: 0,
    employeeNum: '',
    tel: '',
    idNumber: '',
    type: null,
    status: null,
    teacher: '',
    student: [],
    service: [],
  }
  id = this.props.params.id

  componentDidMount = () => {
    ax.get(`/employees/${this.id}/detail`)
    .then(d => {
      this.setState(d.detail)
    })
  }
  

  render() {
    
    return (
      <div className="content-inner">
        <div style={{
          display:'grid',
          gridTemplateColumns: '1fr 1fr 2fr 2fr 1fr 1fr 2fr',
          gridTemplateRows: '50px 50px auto',
        }}>
          <div style={{gridArea:'1 / 1 / 3 / 1'}}>
            {/* <img src="/profile_small.jpg" /> */}
          </div>
          <div style={{gridArea:'1 / 2 / 2 / 6'}}>
            {this.state.name}
          </div>
          <div style={{gridArea:'2 / 2 / 3 / 3'}}>
            <p>工号</p>
            <p>#{this.state.employeeNum}</p>
          </div>
          <div style={{gridArea:'2 / 3 / 3 / 4'}}>
            <p>手机号码</p>
            <p>{this.state.tel}</p>
          </div>
          <div style={{gridArea:'2 / 4 / 3 / 5'}}>
            <p>身份证号码</p>
            <p>{this.state.idNumber}</p>
          </div>
          <div style={{gridArea:'2 / 5 / 3 / 6'}}>
            <p>职位</p>
            <p>{nameSwitch('employee', this.state.type)}</p>
          </div>
          <div style={{gridArea:'2 / 6 / 3 / 7'}}>
            <p>状态</p>
            <p>{nameSwitch('employee-status', this.state.status)}</p>
          </div>

        </div>
        <hr />
        <div style={{paddingLeft: '10%'}}>
          {
            this.state.teacher ? 
            (
              <div>
                <div>技师老师</div>
                <div><Tag>{this.state.teacher}</Tag></div>
                <br />
              </div>
            ) : ''
          }
          {
            this.state.student && this.state.student.length > 0 ? 
            (
              <div>
                <div>下属技师</div>
                <div>{this.state.student.map(v => <Tag>{v}</Tag>)}</div>
                <br />
              </div>
            ) : ''
          }
          {
            this.state.service && this.state.service.length > 0 ? 
            (
              <div>
                <div>服务项目</div>
                <div>{this.state.service.map(v => <Tag>{v}</Tag>)}</div>
              </div>
            ) : ''
          } 
        </div>
        <hr />
        {/* <div className="employee">
          <Timeline>
            <Timeline.Item>
              <p>2017-08-20 13:20</p>
              <p style={{fontWeight:'bold', fontSize:'14px'}}>入职</p>
              <p>技师 · 洪山路店</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>2017-08-20 13:20</p>
              <p style={{fontWeight:'bold', fontSize:'14px'}}>入职</p>
              <p>技师 · 洪山路店</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>2017-08-20 13:20</p>
              <p style={{fontWeight:'bold', fontSize:'14px'}}>入职</p>
              <p>技师 · 洪山路店</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>2017-08-20 13:20</p>
              <p style={{fontWeight:'bold', fontSize:'14px'}}>入职</p>
              <p>技师 · 洪山路店</p>
            </Timeline.Item>
          </Timeline>
        </div> */}
        
      </div>
      

    )
  }
}