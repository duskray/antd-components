import { request, config, ax } from 'utils'

const { api } = config
const { user, userLogout, userLogin } = api

export async function login (params) {
  return request({
    url: '/login',
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return ax.get('/logout')
  // request({
  //   url: userLogout,
  //   method: 'get',
  //   data: params,
  // })
}

export async function query (params) {
  return ax.get('/user')
}
