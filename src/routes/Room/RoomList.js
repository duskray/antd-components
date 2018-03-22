import StoreSelecter from 'components/StoreSelecter'
import { Card, Icon, Spin } from 'antd'
import styles from './Room.less'
import classNames from 'classnames'
import { fullScreen, ax } from 'utils'
import ring from 'public/roomRing.wav'

/**
 * 关于房间状态 status:
 *   0: 空闲
 *   1: 服务中
 *   2: 将清洁
 *   3: 下钟
 *   4: 停用
 */

class RoomList extends React.Component {
  state = {
    loading: false,
    fullScreen: false,
    stores: [],
    rooms: [],
  }
  sid = 0

  getList = (id) => {
    this.setState({
      loading: true,
    })
    this.sid = id
    ax.get('/stores/' + id + '/rooms')
      .then((data) => {
        this.setState({
          rooms: data.rooms,
          loading: false,
        })
        if (data.rooms.find(e => e.status == 2)) {
          const ring = document.getElementById("ring")
          ring.play()
        }
      })
  }

  componentDidMount = () => {
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
        }, _ => {
          this.timer = setInterval(e => this.getList(this.sid), 10000)
        })
      })
  }

  componentWillUnmount = () => {
    clearInterval(this.timer)
  }

  showStatusClass = (statusFlag) => {
    switch (statusFlag) {
      case 0: return styles.room0
      case 1: return styles.room1
      case 2: return styles.room2
      case 3: return styles.room3
      case 4: return styles.room4
    }
  }

  showStatusText = (statusFlag) => {
    switch (statusFlag) {
      case 0: return '空闲'
      case 1: return '服务中'
      case 2: return '待清洁'
      case 3: return '下钟'
      case 4: return '停用'
    }
  }

  fullScreen = () => {
    this.setState({
      fullScreen: !this.state.fullScreen
    }, () => {
      fullScreen(this.state.fullScreen)
    })
  }


  render() {

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getList} />
        <br />
        <div className={classNames('panel', { [styles.fullScreen]: this.state.fullScreen })}>
          <audio id="ring">
            <source src={ring} type="audio/wav" />
          </audio>
          <div className="panel-title">
            <span>房间列表</span>
            <Icon type={this.state.fullScreen ? 'shrink' : 'arrows-alt'} className={styles.fullScreenIcon} onClick={this.fullScreen} />
          </div>
          {/* <Spin spinning={this.state.loading}> */}
          <div className={styles.body}>
            {
              this.state.rooms.map((item, index) => (
                <Card className={this.showStatusClass(item.status)} bodyStyle={{ padding: '20px 10px', textAlign: 'center' }} key={item.id}>
                  <p style={{ fontSize: '18px', marginBottom: '5px' }}>{item.name}</p>
                  <p style={{ fontWeight: 'normal', fontSize: '10px', marginBottom: '5px' }}><Icon type="team" />{item.bedQuantity}</p>
                  <p style={{ fontWeight: 'normal', fontSize: '14px' }}>{this.showStatusText(item.status)}</p>
                </Card>
              ))
            }
          </div>
          {/* </Spin> */}
        </div>
      </div>
    )
  }
}


export default RoomList
