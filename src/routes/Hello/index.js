import React from 'react'
import { Icon } from 'antd'
import styles from './index.less'

const Hello = () => (<div className="content-inner">
  <div className={styles.error}>
    <Icon type="smile-o" />
    <h1>Hello</h1>
  </div>
</div>)

export default Hello
