import { routerRedux } from 'dva/router'
import { queryURL } from 'utils'
import { login } from '../services/login'

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
  },

  effects: {
    * login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      let data
      try {
        data = yield call(login, payload)
      } catch (e) {
        yield put({ type: 'hideLoginLoading' })
      }
      yield put({ type: 'hideLoginLoading' })
      if (data.user_id) {
        const from = queryURL('from')
        yield put({ type: 'app/query' })
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/'))
        }
      } else {
        throw data
      }
    },
  },
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
  },
}
