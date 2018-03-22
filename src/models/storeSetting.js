// import modelExtend from 'dva-model-extend'
// import storeModel from './store'

// export default modelExtend(storeModel, {
  
//   namespace: 'storeSetting',

//   subscriptions: {
//     setup ({ dispatch, history }) {
//       history.listen((location) => {
//         if (location.pathname === '/store/setting') {
//           dispatch({ 
//             type: 'query',
//             payload: {}
//           })
//         }
//       })
//     },
//   },

//   reducers: {
//     select (state, { payload }) {
//       const { list, pagination } = payload
//       return {
//         ...state,
//         ...payload
//       }
//     },
//   }

// })