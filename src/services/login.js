import { request, config, ax } from 'utils'

const { api, host } = config
const { userLogin } = api

export async function login (data) {
  return ax.post('/login', data)

}
