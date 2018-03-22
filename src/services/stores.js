import { config } from 'utils'
import axios from 'axios'

const { api } = config
const { stores } = api

async function query (params) {
  return  axios.get(stores, params)
    .then(function (response) {
      return response
    }).catch(function (error) {
      return error
    });
}

export default {
  query
}
