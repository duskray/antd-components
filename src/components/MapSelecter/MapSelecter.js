import { Map, Marker } from 'react-amap';
import PropTypes from 'prop-types'

class MapSelecter extends React.Component {

  geocoder = null

  constructor(props) {
    super(props);

    const _this = this;
    this.state = {
      visible: false,
      center: { longitude: 107, latitude: 34 },
      position: { longitude: 0, latitude: 0 },
      clickable: false,
      draggable: false,
      zoom: 1,
    };

    this.mapPlugins = [{
      name: 'ToolBar',
      options: {
        autoPosition: false,
        ruler: false,
        noIpLocate: false,
        locate: false,
      }
    }];

    this.events = {
      created: (map) => {
        _this.map = map
        AMap.plugin('AMap.Geocoder', () => {
          this.geocoder = new AMap.Geocoder();
        })
      },
      click: (e) => {
        this.setState({
          visible: true,
          position: { longitude: e.lnglat.lng, latitude: e.lnglat.lat },
          center: { longitude: e.lnglat.lng, latitude: e.lnglat.lat },
        })
        this.props.onChange(e.lnglat.lng + ', ' + e.lnglat.lat)
      }
    }
  }

  setAddr = (addr) => {
    if (this.geocoder) {
      this.geocoder.getLocation(addr, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          let p = result.geocodes[0]
          let zoom = 10
          switch (p.level) {
            case '省':
              zoom = 5
              break
            case '市':
              zoom = 10
              break
            case '区县':
              zoom = 10
              break
            case '道路':
              zoom = 13
              break
            case '兴趣点':
              zoom = 15
              break
          }
          this.setState({
            center: { longitude: p.location.lng, latitude: p.location.lat },
            zoom: zoom,
          })
        }
      })
    }
  }

  setPosition = (position = [107, 34]) => {
    this.setState({
      visible: true,
      position: { longitude: position[0], latitude: position[1] },
      center: { longitude: position[0], latitude: position[1] },
      zoom: 15,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.center.longitude == this.state.center.longitude
      && nextState.center.latitude == this.state.center.latitude
      && nextState.position.longitude == this.state.position.longitude
      && nextState.position.longitude == this.state.position.longitude) {
      return false
    }
    return true
  }

  render() {
    return (
      <div style={{ width: '100%', height: 360 }}>
        <Map plugins={this.mapPlugins} center={this.state.center} zoom={this.state.zoom} events={this.events}>
          <Marker
            position={this.state.position}
            visible={this.state.visible}
            clickable={this.state.clickable}
            draggable={this.state.draggable}
          />
        </Map>
      </div>
    )
  }
}

export default MapSelecter