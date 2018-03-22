import { Table, Dropdown, Menu, Icon, Button, Tag, DatePicker, Spin, Radio, message } from 'antd'
import { getCalendarContainer, ax, nameSwitch } from 'utils'
import { browserHistory } from 'react-router'
import StoreSelecter from 'components/StoreSelecter'
import styles from './Scheduling.less'
import moment from 'moment'
import _ from 'lodash'
const { MonthPicker } = DatePicker
const RadioGroup = Radio.Group

export default class Scheduling extends React.Component {

  month = moment()
  sid = 0

  state = {
    loading: false,
    month: this.month,
    currentShift: 0,
    stores: [],
    classType: [],
    schedule: [],
    scheduleInfo: [],
  }

  getInfo = (classType, schedule) => {
    return classType.map(v => {
      const classes = _.times(this.month.daysInMonth(), i => {
        let sum = 0
        schedule.forEach(e => {
          const typeId = e.classes[i]
          const targetId = v.id
          if (typeId == targetId) {
            sum++
          }
        })
        return sum
      })
      return {
        id: v.id,
        name: v.name,
        classes,
      }
    })
  }

  getList = (sid) => {
    this.setState({
      loading: true,
    })
    this.sid = sid

    ax.all([ax.get(`/stores/${sid}/shiftSetting`), ax.get(`/stores/${sid}/scheduling`, {
      month: this.month.format('YYYY-MM')
    })])
      .then(ax.spread((classType, schedule) => {
        this.setState({
          loading: false,
          classType: classType.shift,
          schedule: schedule.schedule,
          scheduleInfo: this.getInfo(classType.shift, schedule.schedule)
        })
      }))
  }

  componentDidMount = () => {
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
        })
      })
  }

  onShiftChange = (e) => {
    this.setState({
      currentShift: e.target.value
    })
  }

  onMonthChange = (m) => {
    this.month = m
    this.setState({
      month: m
    })
    this.getList(this.sid)
  }

  onMenuClick = (record, date, typeId) => {
    let m = this.state.month
    m.date(date + 1)
    if (m > moment()) {
      const schedule = this.state.schedule
      const i = schedule.findIndex(v => v.id == record.id)
      schedule[i].classes[date] = typeId
      this.setState({
        schedule,
        scheduleInfo: this.getInfo(this.state.classType, schedule)
      })
    } else {
      message.warning(`排班历史不可编辑`)
    }
  }

  onSave = () => {
    this.setState({
      loading: true,
    })
    ax.put(`/stores/${this.sid}/scheduling`, {
      month: this.month.format('YYYY-MM'),
      schedule: JSON.stringify(this.state.schedule),
    }).then(d => this.getList(this.sid))
  }


  render() {
    const scheduleCols = [{
      title: '职位',
      dataIndex: 'type',
      className: styles.tdEmlpoyeeName,
      sorter: (a, b) => a.type > b.type ? 1 : -1,
      render: (text, record) => nameSwitch('employee', text)
    }, {
      title: this.month.format('YYYY-MM'),
      dataIndex: 'name',
      className: styles.tdEmlpoyeeName,
      render: (text, record) => (`#${record.employeeNum} ${record.name}`)
    }]
    const infoCols = [{
      title: this.month.format('YYYY-MM'),
      dataIndex: 'name',
      className: styles.tdEmlpoyeeName,
      render: (text, record) => (`${record.name}`)
    }]

    const menu = (record, date, type) => {
      let m = this.state.month
      m.date(date + 1)
      if (m > moment()) {
        return (
          <Menu>
            {
              type.map(v => (
                <Menu.Item key={v.id}> <a href="javascript:;" onClick={e => this.onMenuClick(record, date, v.id)}>{v.name}</a> </Menu.Item>
              ))
            }
            <Menu.Item>
              <a href="javascript:;" className="text-red" onClick={e => this.onMenuClick(record, date, 0)}>休息</a>
            </Menu.Item>
          </Menu>
        )
      } else {
        return (
          <Menu>
            <Menu.Item key="0" disabled>排班历史不可编辑</Menu.Item>
          </Menu>
        )
      }
    }

    // const renderClassCol = (record, i) => {
    //   if (record.classes[i] == 0) {
    //     return <div className={styles.classes}>休</div>
    //   }
    //   if (this.state.classType.length <= 0 || record.classes[i] == 'null') {
    //     return <div className={styles.classes}>&nbsp;</div>
    //   }
    //   const v = _.find(this.state.classType, v => v.id == record.classes[i])
    //   return (
    //     <div className={styles.classes + ' ' + styles[`color${_.findIndex(this.state.classType, d => d.id == record.classes[i]) % 8}`]}>
    //       {v ? v.name.substr(0, 1) : null}
    //     </div>
    //   )
    // }

    const renderClassCol = (record, i) => {
      if (record.classes[i] == 0) {
        return <div onClick={e => this.onMenuClick(record, i, this.state.currentShift)} className={styles.classes}>休</div>
      }
      if (this.state.classType.length <= 0 || record.classes[i] == 'null') {
        return <div onClick={e => this.onMenuClick(record, i, this.state.currentShift)} className={styles.classes}>&nbsp;</div>
      }
      const v = _.find(this.state.classType, v => v.id == record.classes[i])
      return (
        <div onClick={e => this.onMenuClick(record, i, this.state.currentShift)} className={styles.classes + ' ' + styles[`color${_.findIndex(this.state.classType, d => d.id == record.classes[i]) % 8}`]}>
          {v ? v.name.substr(0, 1) : null}
        </div>
      )
    }

    for (let i = 0; i < this.month.daysInMonth(); i++) {
      scheduleCols.push({
        title: i + 1,
        key: 'classes' + i,
        className: styles.td,
        render: (text, record) => (
          // <Dropdown overlay={menu(record, i, this.state.classType)} placement="bottomCenter" trigger={['click']} getPopupContainer={() => document.getElementsByClassName('content-inner')[0]}>
          //   {
          //     renderClassCol(record, i)
          //   }
          // </Dropdown>
          renderClassCol(record, i)
        )
      })

      infoCols.push({
        title: i + 1 < 10 ? `0${i + 1}` : i + 1,
        key: 'classes' + i,
        className: styles.th,
        render: (t, r) => r.classes[i]
      })
    }



    return (
      <div className="content-inner" style={{ minWidth: '1200px' }}>
        <StoreSelecter data={this.state.stores} onClick={this.getList} />
        <br />
        <div className="panel">
          <div className="panel-title">
            <span>排班设置</span>
            <Button type="primary" style={{ float: 'right', marginTop: '-3px' }} onClick={() => { browserHistory.push(`/shift-setting/${this.sid}`) }}>班次设置</Button>
          </div>
          <Spin spinning={this.state.loading}>
            <div className="panel-body">
              <MonthPicker allowClear={false} {...getCalendarContainer} value={this.state.month} onChange={this.onMonthChange} />
              <div style={{ marginTop: '10px', lineHeight:'30px' }}>
                {/* { 
                  this.state.classType.length > 0
                    ? this.state.classType.map((v, i) => <Tag key={v.id}  className={styles.tag + ' ' + styles[`color${[i] % 8}`]}>{`${v.name} ${v.from} - ${v.to}`}</Tag>)
                    : null
                } */}
                <RadioGroup onChange={this.onShiftChange} value={this.state.currentShift}>
                  {
                    this.state.classType.length > 0
                      ? this.state.classType.map((v, i) => <Radio key={v.id} value={v.id}><Tag className={styles.tag + ' ' + styles[`color${[i] % 8}`]}>{`${v.name} ${v.from} - ${v.to}`}</Tag></Radio>)
                      : null
                  }
                  <Radio value={0}><Tag>休息</Tag></Radio>
                </RadioGroup>
              </div>
              <hr />
              <Table bordered columns={scheduleCols} dataSource={this.state.schedule} rowKey="id" pagination={false} />
              <hr />
              <Table bordered columns={infoCols} dataSource={this.state.scheduleInfo} rowKey="id" pagination={false} />
              <hr />
              <Button type="primary" className="margin-right" onClick={this.onSave}>保存更改</Button>
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}