import React from 'react'
import { connect } from 'dva'
import { Button, Row, Col, Card, Icon, Menu, Dropdown, Tag, Spin, Modal } from 'antd';
import { browserHistory } from 'react-router'
import { ax } from 'utils'
import _ from 'lodash'
import styles from './StoreManage.less';
const confirm = Modal.confirm

// const StoreManage = ({ location, dispatch, loading, storeManage}) => {
export default class StoreManage extends React.Component {

  state = {
    loading: [],
    stores: []
  }

  loadingOn = (id) => {
    this.setState((prevState, props) => ({
      loading: [...prevState.loading, id]
    }))
  }

  loadingOff = (id) => {
    if (id) {
      this.setState((prevState, props) => {
        let loading = prevState.loading
        _.remove(loading, (n) => { n == id })
        return {
          loading: loading
        }
      })
    } else {
      this.setState({ loading: [] })
    }
  }

  getList = () => {
    ax.get('/stores/all')
      .then((data) => {
        this.setState({
          stores: data.stores,
          loading: []
        })
      })
  }

  handleDisable = (id) => {
    this.loadingOn(id)
    ax.patch('/stores/' + id + '/status', {
      status: 0
    }).then(d => {
      this.getList()
    })
  }

  handleEnable = (id) => {
    this.loadingOn(id)
    ax.patch('/stores/' + id + '/status', {
      status: 1
    }).then(d => this.getList())
  }

  handleEdit = (id) => {
    browserHistory.push('/store/manage/' + id)
  }

  handleDel = (id, name) => {
    const _this = this
    confirm({
      title: `删除${name}？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          ax.delete('/stores/' + id).then(d => {
            _this.getList()
            resolve()
          }).catch(() => reject())
        })
      },
      onCancel() { },
    })
  }

  componentDidMount = () => {
    this.getList()
  }

  render() {
    const storeCards = this.state.stores.map((item, index) => {
      const enabledMenu = (
        <Menu>
          <Menu.Item key="0">
            <a href="javascript:;" onClick={this.handleEdit.bind(null, item.id)}>编辑</a>
          </Menu.Item>
          <Menu.Item key="1" >
            <a href="javascript:;" onClick={this.handleDisable.bind(null, item.id)} className={styles.menuDisable}>停用</a>
          </Menu.Item>
        </Menu>
      )

      const disabledMenu = (
        <Menu>
          <Menu.Item key="0">
            <a href="javascript:;" onClick={this.handleEdit.bind(null, item.id)}>编辑</a>
          </Menu.Item>
          <Menu.Item key="1">
            <a href="javascript:;" className={styles.menuEnable} onClick={this.handleEnable.bind(null, item.id)}>启用</a>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="3">
            <a href="javascript:;" className={styles.menuDel} onClick={this.handleDel.bind(null, item.id, item.name)}>删除</a>
          </Menu.Item>
        </Menu>
      )

      return (
        <Spin key={item.id} spinning={this.state.loading.indexOf(item.id) >= 0} wrapperClassName={styles.spin}>
          <Card className={styles.card}>
            <div style={{ position: 'absolute', right: '10px', top: '20px' }}>
              {
                item.status == 1 ? <Tag className="tag-green">启用</Tag> : <Tag className="tag-red">停用</Tag>
              }
            </div>
            <p title={item.name} className={styles.cardTitle}>{item.name}</p>
            <p title={item.address}><Icon type="environment" /> {item.address}</p>
            <p><Icon type="calendar" /> {item.createTime} </p>
            <p><Icon type="user" /> {item.createUser} </p>
            <Dropdown overlay={item.status == 1 ? enabledMenu : disabledMenu}>
              <a className="ant-dropdown-link" href="javascript:;">
                操作 <Icon type="down" />
              </a>
            </Dropdown>
          </Card>
        </Spin>
      )
    })

    return (
      <div className="content-inner">
        <Row type="flex" justify="space-between">
          <Col span={12} style={{ lineHeight: '28px', fontSize: '14px', fontWeight: 'bold' }}>所有门店列表</Col>
          <Col span={12}><Button type="primary" style={{ float: 'right' }} onClick={() => { browserHistory.push('/store/manage/new') }}>新开门店</Button></Col>
        </Row>
        <hr />
        <div>
          {this.state.stores.length > 0 ? storeCards : <Spin style={{margin:'120px 50%'}}/>}
        </div>
      </div>
    )
  }
}


