import StoreSelecter from 'components/StoreSelecter'
import { PicturesWall } from 'components'
import { Form, Row, Col, Input, Button, Icon, Spin } from 'antd'
import styles from './StoreSetting.less'
import { formItemLayout, formButtonLayout, ax } from 'utils'
const FormItem = Form.Item

class StoreSetting extends React.Component {

  state = {
    loading: false,
    stores: [],
    storeDetail: {
      wifi: []
    }
  }

  wifiIndex = 0

  getDetail = (id) => {
    this.setState({
      loading: true
    })
    ax.get('/stores/' + id + '/detail').then(d => {
      this.id = d.id
      this.refs.topImg.setImg([d.topImg])
      this.refs.img.setImg(d.img)
      this.wifiIndex = 0


      let fv = {}
      fv.businessHours = d.businessHours
      if (d.wifi && d.wifi.length > 0) {
        d.wifi.map(v => {
          v.id = this.wifiIndex++
          return v
        })
        fv.wifi = d.wifi
      } else {
        d.wifi = [{
          id: this.wifiIndex++,
          name: '',
          mac: '',
        }]
        fv.wifi = [{
          id: this.wifiIndex++,
          name: '',
          mac: '',
        }]
      }

      this.setState({
        storeDetail: d,
        loading: false
      })

      this.props.form.setFieldsValue(fv)
      this.wifiIndex = d.wifi.length
    })
  }

  componentDidMount = () => {
    ax.get('/stores')
      .then((data) => {
        this.setState({
          stores: data.stores,
        }, _ => {

        })
      })
  }

  addWifi = () => {
    this.setState({
      storeDetail: {
        ...this.state.storeDetail,
        wifi: [...this.state.storeDetail.wifi, {
          id: this.wifiIndex++,
          name: '',
          mac: '',
        }]
      }
    })
  }

  removeWifi = (k) => {
    if (this.state.storeDetail.wifi.length <= 1) {
      return;
    }

    this.setState({
      storeDetail: {
        ...this.state.storeDetail,
        wifi: this.state.storeDetail.wifi.filter(item => item.id !== k)
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.topImg = this.refs.topImg.getImgId()[0]
        values.img = this.refs.img.getImgId()
        values.wifi = JSON.stringify(values.wifi.filter(v => v ? true : false))
        ax.patch(`/stores/${this.state.storeDetail.id}/detail`, values).then()
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form
    const storeDetail = this.state.storeDetail

    const wifiItem = storeDetail.wifi.map((item, index) => {
      return (
        <div key={item.id}>
          <hr />
          <FormItem
            {...formItemLayout}
            label="WiFi名称"
          >
            {getFieldDecorator(`wifi[${item.id}].name`, {
              rules: [{ required: true, message: '请输入WiFi名称', whitespace: true }],
            })(
              <Input style={{ width: 'calc(100% - 95px)', marginRight: 5 }} />
              )}
            {storeDetail.wifi.length > 1 ? (
              <Button onClick={() => this.removeWifi(item.id)}>删除WiFi</Button>
            ) : null}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="MAC地址"
          >
            {getFieldDecorator(`wifi[${item.id}].mac`, {
              rules: [{ required: true, message: '请输入MAC地址', whitespace: true }],
            })(
              <Input style={{ width: 'calc(100% - 95px)', marginRight: 5 }} />
              )}
          </FormItem>
        </div>
      )
    });

    return (
      <div className="content-inner">
        <StoreSelecter data={this.state.stores} onClick={this.getDetail} />
        <br />
        <div className="panel">
          <div className="panel-title">门店基本信息</div>
          <Spin spinning={this.state.loading}>
            <div className="panel-body">
              <Form onSubmit={this.handleSubmit} style={{ padding: '10px' }}>
                <FormItem
                  {...formItemLayout}
                  label="门店名"
                >
                  <span>{storeDetail.name}</span>
                </FormItem>
                <hr />
                <FormItem
                  {...formItemLayout}
                  label="门店头图"
                >
                  <PicturesWall ref="topImg" limit="1"></PicturesWall>
                </FormItem>
                <hr />
                <FormItem
                  {...formItemLayout}
                  label="门店其他图片"
                >
                  <PicturesWall ref="img"></PicturesWall>
                </FormItem>
                <hr />
                <FormItem
                  {...formItemLayout}
                  label="营业时间"
                >
                  {getFieldDecorator(`businessHours`)(
                    <Input />
                  )}
                </FormItem>
                {wifiItem}
                <hr />
                <FormItem {...formButtonLayout}>
                  <Button type="dashed" onClick={this.addWifi} style={{ width: 'calc(100% - 95px)' }}>
                    <Icon type="plus" /> 新增WiFi
                </Button>
                </FormItem>
                <hr />
                <FormItem {...formButtonLayout}>
                  <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                </FormItem>
              </Form>
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}

export default Form.create()(StoreSetting)
