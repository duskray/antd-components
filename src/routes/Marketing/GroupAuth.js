import { Form, Input, Button, Icon, InputNumber, Select, Spin, Tabs } from 'antd'
import { ax } from 'utils';
import { browserHistory } from 'react-router'
const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option
const TabPane = Tabs.TabPane

export default class GroupAuth extends React.Component {

  appId = '1000033'
  requestModules = [1, 2, 3, 4, 5, 6, 7, 8]
  state = {
    url: '',
    urlRefresh: '',
  }

  componentDidMount() {
    ax.get(`/stores`).then(d => { 
      const shopList = d.stores.map(v => {
        return {
          "shopAddress": v.address,
          "shopId": v.id,
          "shopName": v.name
        }
      })
      this.setState({
        url: `https://e.dianping.com/open/merchant/auth?appId=${this.appId}&shopList=${encodeURIComponent(JSON.stringify(shopList))}&requestModules=${encodeURIComponent(JSON.stringify(this.requestModules))}`,
        urlRefresh: `https://e.dianping.com/open/merchant/reauthorize`
      })
    })
    
  }



  render() {
    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">团购授权</div>
          <div className="panel-body" >
            
            <Tabs defaultActiveKey="1" >
              <TabPane tab="首次授权" key="1" style={{ height: '1200px' }}>
              {
                this.state.url ? <iframe src={this.state.url}  width="100%" height="100%" style={{ border: '0px' }}></iframe> : ''
              }
              </TabPane>
              {/* <TabPane tab="再次授权" key="2">
              {
                this.state.url ? <iframe src={this.state.url}  width="100%" height="100%" style={{ border: '0px' }}></iframe> : ''
              }
              </TabPane> */}
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

