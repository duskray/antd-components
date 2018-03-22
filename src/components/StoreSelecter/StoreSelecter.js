import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import styles from './StoreSelecter.less'
import { Card, Icon } from 'antd';
import { throttle } from 'utils';
import ReactResizeDetector from 'react-resize-detector';

class StoreSelecter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentSotre: 0,
      offset: 0,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.state.currentSotre == 0 && nextProps.data.length > 0) {
      const c = window.localStorage.getItem(`currentSotre`)
      this.handleCardClick(c && nextProps.data.map(v => v.id).includes(c) ? c : nextProps.data[0].id)
    }
  }

  handleLeftClick = () => {
    let scroll = this.refs.scroll
    let offset = Number.parseInt(this.refs.selecter.clientWidth / 290) * 290
    if (this.state.offset < 0) {
      this.setState({
        offset: Math.min(0, this.state.offset + offset)
      })
    }
  }

  handleRightClick = () => {
    let scroll = this.refs.scroll
    let offset = Number.parseInt(this.refs.selecter.clientWidth / 290) * 290
    if (- this.state.offset < scroll.clientWidth) {
      this.setState({
        offset: Math.max(-(scroll.clientWidth - offset), this.state.offset - offset)
      })
    }
  }

  handleCardClick = (id) => {
    this.props.onClick(id)
    window.localStorage.setItem(`currentSotre`, id)
    this.setState({
      currentSotre: id
    })
  }
  _onResize = () => {
    this.forceUpdate()
  }

  render() {
    return (
      <div className={styles.storeSelecter}>
        <div className={styles.selecterTitle}>
          选择门店
        </div>
        <div className={styles.arrowLeft} >
          {this.state.offset == 0 ? null : <Icon type="left" onClick={this.handleLeftClick} style={{cursor: 'pointer'}} /> }
        </div>
        <div className={styles.arrowRight} >
          {this.refs.scroll && this.refs.scroll.clientWidth + this.state.offset <= this.refs.selecter.clientWidth ? null : <Icon type="right" onClick={this.handleRightClick} style={{cursor: 'pointer'}} />}          
        </div>
        <div ref="selecter" className={styles.selecter}>
          <div ref="scroll" className={styles.scroll} style={{transform: `translate3d(${this.state.offset}px, 0px, 0px)`}}>
          {this.props.data.map((item, index) => (
            <Card key={item.id} className={classNames(styles.card, {[styles.active]: (item.id == this.state.currentSotre) })} onClick={this.handleCardClick.bind(this, item.id)}>
              <p className={styles.title}>{item.name}</p>
              <p title={item.address}><Icon type="environment" /> {item.address}</p>
            </Card>
          ))}
          </div>
        </div>
        <ReactResizeDetector handleWidth handleHeight onResize={this._onResize} />
      </div>
    )
  }
}

export default StoreSelecter
