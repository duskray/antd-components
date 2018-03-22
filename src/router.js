import React from 'react'
import PropTypes from 'prop-types'
import { Router, IndexRedirect  } from 'dva/router'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      // onEnter: (nextState, replace) => {
      //   if (nextState.location.pathname == '/') {
      //     replace('/store/manage')
      //   }
      // },
      getIndexRoute (nextState, cb) {
        require.ensure([], (require) => {
          cb(null, { component: require('./routes/Hello/') })
        }, 'hello')
      },
      childRoutes: [
        {
          path: 'password',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Option/Password'))
            }, 'password')
          },
        }, 
        {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        },
        {
          path: 'store/manage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/StoreManage/StoreManage'))
            }, 'store-manage')
          },
        },
        // {
        //   path: 'store/add',
        //   getComponent (nextState, cb) {
        //     require.ensure([], (require) => {
        //       cb(null, require('./routes/StoreManage/StoreAdd'))
        //     }, 'store-add')
        //   },
        // },
        {
          path: 'store/manage/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/StoreManage/StoreAdd'))
            }, 'store-manage-id')
          },
        },
        {
          path: 'account/manage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/AccountManage/AccountManage'))
            }, 'account-manage')
          },
        },
        {
          path: 'account/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/AccountManage/AccountAdd'))
            }, 'account')
          },
        },
        {
          path: 'role/manage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/RoleManage/RoleManage'))
            }, 'role-manage')
          },
        },
        {
          path: 'role/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/RoleManage/RoleAdd'))
            }, 'role')
          },
        },
        {
          path: 'system/new-waiter-rules',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/System/WaiterNew'))
            }, 'new-waiter-rules')
          },
        },
        {
          path: 'system/evaluation-rules',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/System/EvaluationRules'))
            }, 'evaluation-rules')
          },
        },
        {
          path: 'system/behavior-entry-rules',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/System/BehaviorEntryRules'))
            }, 'behavior-entry-rules')
          },
        },
        {
          path: 'system/points-rules',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/System/PointsRules'))
            }, 'points-rules')
          },
        },
        {
          path: 'system/member',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/System/Member'))
            }, 'system-member')
          },
        },
        // {
        //   path: 'system/attendance-rules',
        //   getComponent (nextState, cb) {
        //     require.ensure([], (require) => {
        //       cb(null, require('./routes/System/AttendanceRules'))
        //     }, 'system-attendance-rules')
        //   },
        // },
        {
          path: 'system/log',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/System/SystemLog'))
            }, 'system-log')
          },
        },
        {
          path: 'store/setting',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/StoreSetting/StoreSetting'))
            }, 'store-setting')
          },
        },
        {
          path: 'room/manage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Room/RoomManage'))
            }, 'room-manage')
          },
        },
        {
          path: 'store/:sid/room/:rid',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Room/RoomAdd'))
            }, 'room')
          },
        },
        {
          path: 'room/list',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Room/RoomList'))
            }, 'room-list')
          },
        },
        {
          path: 'service',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/ServiceManage/ServiceManage'))
            }, 'service-manage')
          },
        },
        {
          path: 'service/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/ServiceManage/ServiceAdd'))
            }, 'service')
          },
        },
        {
          path: 'item',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/ItemManage/ItemManage'))
            }, 'item')
          },
        },
        {
          path: 'item/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/ItemManage/ItemAdd'))
            }, 'item')
          },
        },
        {
          path: 'employee/manage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/EmployeeManage/EmployeeManage'))
            }, 'employee-manage')
          },
        },
        {
          path: 'store/:sid/employee/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/EmployeeManage/EmployeeAdd'))
            }, 'employee')
          },
        },
        {
          path: 'employee/transfer/:sid',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/EmployeeManage/EmployeeTransfer'))
            }, 'employee-transfer')
          },
        },
        {
          path: 'employee/detail/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/EmployeeManage/EmployeeDetail'))
            }, 'employee-detail')
          },
        },
        {
          path: 'attendance/manage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/AttendanceManage/AttendanceManage'))
            }, 'attendance-manage')
          },
        },
        {
          path: 'stores/:sid/attendance/detail/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/AttendanceManage/AttendanceDetail'))
            }, 'attendance-detail')
          },
        },
        {
          path: 'leave-approval',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/LeaveApproval/LeaveApproval'))
            }, 'leave-approval')
          },
        },
        {
          path: 'scheduling',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Scheduling/Scheduling'))
            }, 'scheduling')
          },
        },
        {
          path: 'shift-setting/:sid',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Scheduling/ShiftSetting'))
            }, 'shift-setting')
          },
        },
        {
          path: 'scheduling/search',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Scheduling/SchedulingSearch'))
            }, 'scheduling-search')
          },
        },
        {
          path: 'shift',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/OrderManage/Shift'))
            }, 'shift')
          },
        },
        {
          path: 'store/service',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/StoreServiceManage/ServiceManage'))
            }, 'store-service-manage')
          },
        },
        {
          path: 'store/:sid/service/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/StoreServiceManage/ServiceAdd'))
            }, 'store-service')
          },
        },
        {
          path: 'store/item/manage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/StoreItemManage/ItemManage'))
            }, 'store-item-manage')
          },
        },
        {
          path: 'store/:sid/item/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/StoreItemManage/ItemAdd'))
            }, 'store-item')
          },
        },
        {
          path: 'order',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/OrderManage/OrderManage'))
            }, 'order')
          },
        },
        // {
        //   path: 'order/detail',
        //   getComponent (nextState, cb) {
        //     require.ensure([], (require) => {
        //       cb(null, require('./routes/OrderManage/OrderDetail'))
        //     }, 'order-detail')
        //   },
        // },
        {
          path: 'order/item',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/OrderManage/ItemOrderManage'))
            }, 'order-item')
          },
        },
        {
          path: 'order/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/OrderManage/OrderDetail'))
            }, 'order-detail')
          },
        },
        {
          path: 'order/:id/:sid',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/OrderManage/SubOrderDetail'))
            }, 'sub-order-detail')
          },
        },
        
        {
          path: 'customer',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Customer/CustomerManage'))
            }, 'customer')
          },
        },
        {
          path: 'customer/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Customer/CustomerDetail'))
            }, 'customer-detail')
          },
        },
        {
          path: 'push',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/Push'))
            }, 'push')
          },
        },
        {
          path: 'push/new',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/PushAdd'))
            }, 'push-new')
          },
        },
        {
          path: 'coupon',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/Coupon'))
            }, 'coupon')
          },
        },
        {
          path: 'coupon/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/CouponAdd'))
            }, 'coupon-new')
          },
        },
        // {
        //   path: 'coupon/send',
        //   getComponent (nextState, cb) {
        //     require.ensure([], (require) => {
        //       cb(null, require('./routes/Marketing/CouponSend'))
        //     }, 'coupon-send')
        //   },
        // },
        // {
        //   path: 'coupon/send/new',
        //   getComponent (nextState, cb) {
        //     require.ensure([], (require) => {
        //       cb(null, require('./routes/Marketing/CouponSendAdd'))
        //     }, 'coupon-send-new')
        //   },
        // },
        {
          path: 'coupon-receive',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/CouponReceive'))
            }, 'coupon-receive')
          },
        },
        {
          path: 'coupon-receive/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/CouponReceiveAdd'))
            }, 'coupon-receive-new')
          },
        },
        {
          path: 'coupon-exchange',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/CouponExchange'))
            }, 'coupon-exchange')
          },
        },
        {
          path: 'coupon-exchange/new',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/CouponExchangeAdd'))
            }, 'coupon-exchange-new')
          },
        },
        {
          path: 'group-auth',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/GroupAuth'))
            }, 'group-auth')
          },
        },
        {
          path: 'group-purchase',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/GroupPurchase'))
            }, 'group-purchase')
          },
        },
        {
          path: 'group-purchase/log',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/GroupTicketCheck'))
            }, 'group-purchase-log')
          },
        },
        {
          path: 'group-purchase/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Marketing/GroupPurchaseAdd'))
            }, 'group-purchase-new')
          },
        },
        {
          path: 'wage/rules',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/Rules'))
            }, 'wage-rules')
          },
        },
        {
          path: 'stores/:sid/wage/rules/0',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/RuleSetting0'))
            }, 'wage-ruleSetting-0')
          },
        },
        {
          path: 'stores/:sid/wage/rules/1',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/RuleSetting1'))
            }, 'wage-ruleSetting-1')
          },
        },
        {
          path: 'stores/:sid/wage/rules/2',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/RuleSetting2'))
            }, 'wage-ruleSetting-2')
          },
        },
        {
          path: 'stores/:sid/wage/rules/3',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/RuleSetting3'))
            }, 'wage-ruleSetting-3')
          },
        },
        {
          path: 'stores/:sid/wage/rules/4',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/RuleSetting4'))
            }, 'wage-ruleSetting-4')
          },
        },
        {
          path: 'stores/:sid/wage/rules/5',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/RuleSetting5'))
            }, 'wage-ruleSetting-5')
          },
        },
        {
          path: 'stores/:sid/wage/rules/6',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/RuleSetting6'))
            }, 'wage-ruleSetting-6')
          },
        },
        {
          path: 'wage/search',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/WageSearch'))
            }, 'wage-search')
          },
        },
        {
          path: 'wage/create',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/WageCreate'))
            }, 'wage-create')
          },
        },
        {
          path: 'wage/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Wage/Wage'))
            }, 'wage-release')
          },
        },
        {
          path: 'charts/recharge',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/Recharge'))
            }, 'charts-recharge')
          },
        },
        {
          path: 'charts/new',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/New'))
            }, 'charts-new')
          },
        },
        {
          path: 'charts/revenue',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/Revenue'))
            }, 'charts-revenue')
          },
        },
        {
          path: 'charts/customer',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/Customer'))
            }, 'charts-customer')
          },
        },
        {
          path: 'charts/performance',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/Performance'))
            }, 'charts-performance')
          },
        },
        {
          path: 'charts/performance/:date/:type',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/PerformanceDetail'))
            }, 'charts-performance-detail')
          },
        },
        {
          path: 'charts/service',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/Service'))
            }, 'charts-service')
          },
        },
        {
          path: 'charts/new/user/:date',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/UserDetail'))
            }, 'charts-new-user-detail')
          },
        },
        {
          path: 'charts/new/member/:date',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/MemberDetail'))
            }, 'charts-new-member-detail')
          },
        },
        {
          path: 'charts/room',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/Room'))
            }, 'charts-room')
          },
        },
        {
          path: 'charts/analysis',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/Charts/Analysis'))
            }, 'charts-analysis')
          },
        },
        {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} >
  </Router>;
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
