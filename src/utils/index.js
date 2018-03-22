/* global window */
import classnames from 'classnames'
import lodash from 'lodash'
import qs from 'qs'
import config from './config'
import request from './request'
import axios from 'axios'
import { Tag, message } from 'antd'
import NProgress from 'nprogress'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

/**
 * 函数节流
 */
const throttle = function (fn, delay, mustRunDelay) {
  var timer = null;
  var t_start;
  return function () {
    var context = this, args = arguments, t_curr = +new Date();
    clearTimeout(timer);
    if (!t_start) {
      t_start = t_curr;
    }
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(context, args);
      t_start = t_curr;
    }
    else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  };
};

/**
 * 栅格设置
 */
const formItemLayout = {
  colon: false,
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const formButtonLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 4 },
  }
}

const getPopupContainer = {
  getPopupContainer: () => document.getElementsByClassName('content-inner')[0]
}

const getCalendarContainer = {
  getCalendarContainer: () => document.getElementsByClassName('content-inner')[0]
}

/**
 * 进入或退出全屏状态
 * @param {Boolean} state 
 */
const fullScreen = (state) => {
  if (state) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozExitFullscreen) {
      document.mozExitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

/**
 * PieLabel
 * @param {*} props 
 */
const renderCustomizedLabel = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name} ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent).toFixed(2)}%)`}
      </text>
    </g>
  )
}

/**
 * 键值对转换
 * @param {String} 类型 
 * @param {*} ID 
 */
const nameSwitch = (type, id) => {
  if (type == 'order') {
    switch (id) {
      case 0: return '未付款'
      case 1: return '待服务'
      case 2: return '服务中'
      case 3: return '已完成'
      case 4: return '已评价'
      case 5: return '已取消'
      case 6: return '已退款'
      case 7: return '已返券'
      default: return null
    }
  } else if (type == 'order-tag') {
    switch (id) {
      case 0: return <Tag key={id} className="tag-gray">已关闭</Tag>
      case 1: return <Tag key={id} className="tag-yellow">待服务</Tag>
      case 2: return <Tag key={id} className="tag-green">服务中</Tag>
      case 3: return <Tag key={id} className="tag-blue">已完成</Tag>
      case 4: return <Tag key={id} className="tag-blue">已评价</Tag>
      case 5: return <Tag key={id} className="tag-gray">已取消</Tag>
      case 6: return <Tag key={id} className="tag-red">已退款</Tag>
      case 7: return <Tag key={id} className="tag-red">已返券</Tag>
      default: return null
    }
  } else if (type == 'employee') {
    switch (id) {
      case 0: return '技师'
      case 1: return '技师老师'
      case 2: return '迎宾'
      case 3: return '保洁'
      case 4: return '吧员'
      case 5: return '店长'
      case 6: return '店长助理'
      default: return null
    }
  } else if (type == 'employee-status') {
    switch (id) {
      case 0: return '已停用'
      case 1: return '已启用'
      case 2: return '待调出'
      case 3: return '已离职'
      default: return null
    }
  } else if (type == 'employee-status-tag') {
    switch (id) {
      case 0: return <Tag className="tag-red">停用</Tag>
      case 1: return <Tag className="tag-green">启用</Tag>
      case 2: return <Tag className="tag-yellow">待调出</Tag>
      case 3: return <Tag className="tag-gray">已离职</Tag>
      default: return null
    }
  } else if (type == 'payment') {
    switch (id) {
      case 1: return '微信'
      case 2: return '支付宝'
      case 3: return '余额'
      case 4: return '团购'
      case 9: return '其他'
      default: return null
    }
  } else if (type == 'waiter-status') {
    switch (id) {
      case 1: return '已上钟'
      case 2: return '已下钟'
      case 0: return '未上钟'
      default: return null
    }
  }
}

const download = (url, param) => {
  ax.get(url, param).then(d => {
    const iframe = document.createElement('iframe')
    iframe.src = d
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
  })
}

const q = (method = 'get', url = '', data = {}) => {
  NProgress.start()
  const params = method == 'get' ? 'params' : 'data'

  let _data = {}
  _data = data
  // Object.keys(data).map((v) => {
  //   if (Array.isArray(data[v]) && data[v].length == 0) {
  //     _data[v] = ['']
  //   } else {
  //     _data[v] = data[v] ? data[v] : ''
  //   }
  // })
  const p = method == 'get' ? _data : qs.stringify(_data, { arrayFormat: 'brackets' })
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      [params]: p,
      withCredentials: true,
      headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        // 'X-Requested-With': 'XMLHttpRequest'
      }
    }).then((r) => {
      NProgress.done()
      if (r.status === 200) {
        if (r.data.message) {
          message.success(r.data.message)
        }
        resolve(r.data)
      } else {
        reject(r.data)
        if (r.data.message) {
          // message.error(r.data.message)
        }
      }
    }).catch((e) => {
      NProgress.done()
      reject(e)
      if (e.response.status === 401) {
        if (config.openPages && config.openPages.indexOf(location.pathname) < 0) {
          let from = location.pathname
          window.location = `${location.origin}/login?from=${from}`
        }
      } else {
        if (e.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          message.error(e.response.data.message ? e.response.data.message : e.response.statusText)
          console.log(e.response)
        } else if (e.request) {
          message.error('服务器无响应，您可能需要来自管理员的帮助。')
          // The request was made but no response was received
          // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(e.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', e.message)
        }
        console.log(e.config)
      }
    })
  })
}

const ax = {}
if (process.env.NODE_ENV == "development") {
  ax.baseUrl = '/host'
} else if (location.port == '8001') {
  ax.baseUrl = 'http://www.daqianzudao.com'
} else {
  ax.baseUrl = 'https://www.daqianzudao.com'
}

// ax.get = (url, data) => q('get', ax.baseUrl + url, data)
ax.get = (url, data) => {
  if (url.startsWith('/')) {
    return q('get', ax.baseUrl + url, data)

  } else {
    return q('get', url, data)
  }
}
ax.post = (url, data) => q('post', ax.baseUrl + url, data)
ax.patch = (url, data) => q('patch', ax.baseUrl + url, data)
ax.put = (url, data) => q('put', ax.baseUrl + url, data)
ax.delete = (url, data) => q('delete', ax.baseUrl + url, data)
ax.all = axios.all
ax.spread = axios.spread

const getQueryParam = function() {

    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
}


module.exports = {
  config,
  request,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  throttle,
  formItemLayout,
  formButtonLayout,
  getPopupContainer,
  getCalendarContainer,
  renderCustomizedLabel,
  fullScreen,
  nameSwitch,
  download,
  ax,
  getQueryParam,
}
