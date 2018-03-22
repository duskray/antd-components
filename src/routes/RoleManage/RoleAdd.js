import { Form, Input, Button, Checkbox } from 'antd';
import { browserHistory } from 'react-router'
import { formItemLayout, formButtonLayout, arrayToTree, ax } from 'utils';
import defaultMenus from 'utils/menus'

class RoleAdd extends React.Component {

  state = {
    menus: []
  }

  id = this.props.params.id
  menuData = []

  componentDidMount = () => {
    if (this.id != 'new') {
      ax.all([ax.get('/roles/' + this.id)])
        .then(ax.spread((role) => {
          this.menuData = defaultMenus
          let menuTree = arrayToTree(defaultMenus, 'id', 'bpid')
          menuTree = menuTree.map((v) => {

            const options = v.children && v.children.map((c) => {
              return {
                label: c.name,
                value: c.id,
              }
            })
            const optionsValue = v.children && v.children.map((c) => {
              return c.id
            })
            const checkedList = role.permissions.filter(p => options.find(e => e.value == p))

            return Object.assign(v, {
              checkedList,
              indeterminate: !!checkedList.length && (checkedList.length < options.length),
              checkAll: checkedList.length === options.length,
              options,
              optionsValue,
            })
          })

          this.props.form.setFieldsValue({
            name: role.name,
            description: role.description,
          })
          this.setState({
            menus: menuTree
          })
        }))
    } else {

        this.menuData = defaultMenus
        let menuTree = arrayToTree(defaultMenus, 'id', 'bpid')
        menuTree = menuTree.map((v) => {
          return Object.assign(v, {
            checkedList: [],
            indeterminate: false,
            checkAll: false,
            options: v.children && v.children.map((c) => {
              return {
                label: c.name,
                value: c.id,
              }
            }),
            optionsValue: v.children && v.children.map((c) => {
              return c.id
            }),
          })
        })
        this.setState({
          menus: menuTree
        })
    }
  }


  onCheckAllChange = (i, e) => {
    // this.setState((state, props) => ({
    //   menus: state.menus.map((v) => {
    //     if (v.id == id) {
    //       let menu = Object.assign({}, v)
    //       menu.checkedList = e.target.checked ? menu.options.map(_=>_.value) : []
    //       menu.indeterminate = false
    //       menu.checkAll = e.target.checked
    //       return menu
    //     }

    //     return v
    //   })
    // }))
    // this.setState((state, props) => {
    //   let menus = state.menus
    //   let thisMenu = menus.find(v => v.id == id)
    //   thisMenu.checkedList = e.target.checked ? thisMenu.optionsValue : []
    //   thisMenu.indeterminate = false
    //   thisMenu.checkAll = e.target.checked
    //   return {
    //     menus,
    //   }
    // })
    let menus = this.state.menus
    let thisMenu = menus[i]
    thisMenu.checkedList = e.target.checked ? thisMenu.optionsValue : []
    thisMenu.indeterminate = false
    thisMenu.checkAll = e.target.checked
    this.setState({
      menus,
    })
  }

  onCheckChange = (id, checkedList) => {
    this.setState((state, props) => ({
      menus: state.menus.map((v) => {
        let menu = Object.assign({}, v)
        if (menu.id == id) {
          menu.checkedList = checkedList
          menu.indeterminate = !!checkedList.length && (checkedList.length < menu.options.length)
          menu.checkAll = checkedList.length === menu.options.length
        }
        return menu
      })
    }))
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let checks = []
        this.state.menus.map((v, i) => {
          if (v.checkedList.length > 0) {
            checks = checks.concat(v.id)
          }
          checks = checks.concat(v.checkedList)
        })

        let permissions = checks.slice()
        checks.forEach((v, i) => {
          let children = this.menuData.filter((e) => e.bpid == v && e.mpid == '-1')
          children = children.map(_ => _.id)
          permissions = permissions.concat(children)
        })

        values.permissions = permissions
        // console.log('Received values of form: ', values);

        if (this.id == 'new') {
          ax.post('/roles', values).then(d => browserHistory.push('/role/manage'))
        } else {
          ax.patch('/roles/' + this.id, values).then(d => browserHistory.push('/role/manage'))
        }
      }
    });
  }

  render() {
    // console.log(this.state)
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="content-inner">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item
            {...formItemLayout}
            label="角色名"
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入角色名', whitespace: true }],
            })(
              <Input />
              )}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="角色描述"
          >
            {getFieldDecorator('description')(
              <Input.TextArea rows={4} />
            )}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="权限"
          >
            {
              this.state.menus.map((v, i) => {
                return (
                  <div key={v.id} style={{ border: '1px solid #e5e5e5', borderRadius: '3px', padding: '0 10px', marginBottom: '20px' }}>
                    <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                      <Checkbox
                        indeterminate={v.indeterminate}
                        onChange={this.onCheckAllChange.bind(null, i)}
                        checked={v.checkAll}
                      >
                        {v.name}（全选）
                      </Checkbox>
                    </div>
                    <Checkbox.Group options={v.options} value={v.checkedList.map(v => v.value ? v.value : v)} onChange={this.onCheckChange.bind(null, v.id)} />
                  </div>
                )
              })
            }
          </Form.Item>
          <Form.Item
            {...formButtonLayout}
          >
            <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
            <Button onClick={() => { browserHistory.push('/role/manage') }}>取消</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create()(RoleAdd);
