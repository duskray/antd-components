
import { Card, Icon, Spin } from 'antd'
import StoreSelecter from 'components/StoreSelecter'
import { ax, fullScreen } from 'utils'
import classNames from 'classnames'
import styles from './Shift.less'
import ring from 'public/shiftRing.wav'

class Shift extends React.Component {
  state = {
    loading: false,
    stores: [],
    sid: 0,
    shift: '',
    employee: [],
    fullScreen: false,
  }

  timer = null

  fullScreen = () => {
    this.setState({
      fullScreen: !this.state.fullScreen
    }, () => {
      fullScreen(this.state.fullScreen)
    })
  }

  getList = (sid) => {

    this.setState({
      loading: true,
      sid,
    })
    ax.get(`/stores/${sid}/shift`)
      .then((data) => {
        this.setState({
          loading: false,
          employee: data.employee,
          shift: data.shift
        })
        if (data.employee.find(e => e.status == 0)) {
          const ring = document.getElementById("ring")
          ring.play()
        }
      }).catch(e => {
        this.setState({
          loading: false,
        })
      })
  }

  componentDidMount() {
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
        }, _ => {
          this.timer = setInterval(e => this.getList(this.state.sid), 10000)
        })
      })
  }

  componentWillUnmount = () => {
    clearInterval(this.timer)
  }


  render() {
    const getStatusName = (id) => {
      switch (id) {
        case 0: return '点钟'
        case 1: return '空闲'
        case 2: return '上钟'
      }
    }

    const employee = {
      will: this.state.employee.filter(v => v.status == 0),
      free: this.state.employee.filter(v => v.status == 1),
      servicing: this.state.employee.filter(v => v.status == 2),
    }

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getList} />
        <br />
        <div className={classNames('panel', { [styles.fullScreen]: this.state.fullScreen })}>
          <audio id="ring">
            <source src={ring} type="audio/wav" />
          </audio>
          <div className="panel-title">
            <span>{this.state.shift}</span>
            <Icon type={this.state.fullScreen ? 'shrink' : 'arrows-alt'} className={styles.fullScreenIcon} onClick={this.fullScreen} />
          </div>
          <div className={styles.fullScreenBody + ' panel-body'}>
            {/* <Spin spinning={this.state.loading}> */}
            <div>{employee.will.length > 0 ? '即将上钟' : ''}</div>

            <div>
              {
                employee.will.map((v, i) => {
                  return (
                    <Card key={v.id} className={styles.card + ' ' + styles.yellow}>
                      <p className={styles.title}>
                        <span className={styles.titleNumber}>{`#${v.employeeNum} `}</span>
                        <span>{v.name}</span>
                      </p>
                      <p className={styles.text}>
                        <span className={styles.serviceName}>{v.service}</span>
                        <span className={styles.time}>{v.startTime} - {v.endTime}</span>
                      </p>
                      <p className={styles.text}>{v.room}</p>
                    </Card>
                  )
                })
              }
            </div>

            <div>{employee.servicing.length > 0 ? '服务中' : ''}</div>
            <div>
              {
                employee.servicing.map((v, i) => {
                  return (
                    <Card key={v.id} className={styles.card + ' ' + styles.blue}>
                      <p className={styles.title}>
                        <span className={styles.titleNumber}>{`#${v.employeeNum} `}</span>
                        <span>{v.name}</span>
                      </p>
                      <p className={styles.text}>
                        <span className={styles.serviceName}>{v.service}</span>
                        <span className={styles.time}>{v.startTime} - {v.endTime}</span>
                      </p>
                      <p className={styles.text}>{v.room}</p>
                    </Card>
                  )
                })
              }
            </div>

            <div>{employee.free.length > 0 ? '空闲中' : ''}</div>
            <div>
              {
                employee.free.map((v, i) => {
                  return (
                    <Card key={v.id} className={styles.card}>
                      <p className={styles.title}><span className={styles.titleNumber}>{`#${v.employeeNum} `}</span><span>{v.name}</span></p>
                    </Card>
                  )
                })
              }
            </div>
            {/* </Spin> */}
          </div>
        </div>
      </div>
    )
  }
}

export default Shift