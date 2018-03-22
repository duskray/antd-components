/* global location */
import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'dva/router'
import pathToRegexp from 'path-to-regexp'
import { queryArray } from 'utils'
import styles from './Bread.less'

const Bread = ({ menu }) => {
  // 匹配当前路由
  let pathArray = []
  let current
  let title
  for (let index in menu) {
    if (menu[index].route && pathToRegexp(menu[index].route).exec(location.pathname)) {
      current = menu[index]
      break
    }
  }

  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.bpid) {
      getPathArray(queryArray(menu, item.bpid, 'id'))
    }
  }

  if (!current) {
    if (location.pathname == '/') {
      title = '首页'
      pathArray.push({
        id: 1,
        icon: 'laptop',
        name: '首页',
      })
    } else if (location.pathname == '/password') {
      title = '修改密码'
      pathArray.push({
        id: 2,
        icon: 'setting',
        name: '修改密码',
      })
    } else {
      title = ''
      pathArray.push({
        id: 404,
        icon: 'question-circle-o',
        name: '',
      })
    }
    
    // pathArray.push({
    //   id: 404,
    //   name: 'Not Found',
    // })
  } else {
    getPathArray(current)
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.icon
        ? <Icon type={item.icon} style={{ marginRight: 4 }} />
        : ''}{item.name}</span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key)
          ? <Link to={item.route}>
            {content}
          </Link>
          : content}
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread}>
      <div className={styles.title}>{current ? current.name : title}</div>
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array,
}

export default Bread
