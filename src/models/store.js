// import modelExtend from 'dva-model-extend'
// import { model } from './common'
// import { query } from '../services/stores'


// const storeModel = modelExtend(model, {

//   namespace: 'store',

//   state: {
//     stores: [],
//     currentSotre: 0,
//   },

//   effects: {
//     * query({ payload }, { call, put }) {
//       const response = yield call(query, payload)
//       if (response.status  === 200 && response.data.status === 200) {
//         yield put({
//           type: 'updateState',
//           payload: {
//             stores: response.data.data.stores,
//             currentSotre: 0,
//           },
//         })
//       } else {
//         throw data
//       }
//     }
//   },

// })


// export default storeModel