 export default [
  {
    id: '10000',
    icon: 'setting',
    name: '系统管理',
  },
  {
    id: '10100',
    icon: 'shop',
    mpid: '10000',
    bpid: '10000',
    name: '门店管理',
    route: '/store/manage',
  },
  {
    id: '10101',
    icon: 'shop',
    mpid: '-1',
    bpid: '10100',
    name: '新开门店',
    route: '/store/manage/new',
  },
  {
    id: '10102',
    icon: 'shop',
    mpid: '-1',
    bpid: '10100',
    name: '门店编辑',
    route: '/store/manage/:id',
  },
  {
    id: '10200',
    icon: 'user',
    mpid: '10000',
    bpid: '10000',
    name: '账号管理',
    route: '/account/manage',
  },
  {
    id: '10201',
    icon: 'user',
    mpid: '-1',
    bpid: '10200',
    name: '新建账号',
    route: '/account/new',
  },
  {
    id: '10202',
    icon: 'user',
    mpid: '-1',
    bpid: '10200',
    name: '账号编辑',
    route: '/account/:id',
  },
  {
    id: '10300',
    icon: 'user',
    mpid: '10000',
    bpid: '10000',
    name: '角色管理',
    route: '/role/manage',
  },
  {
    id: '10301',
    icon: 'user',
    mpid: '-1',
    bpid: '10300',
    name: '新建角色',
    route: '/role/new',
  },
  {
    id: '10302',
    icon: 'user',
    mpid: '-1',
    bpid: '10300',
    name: '角色编辑',
    route: '/role/:id',
  },
  {
    id: '11100',
    icon: 'coffee',
    mpid: '10000',
    bpid: '10000',
    name: '项目管理',
    route: '/service',
  },
  {
    id: '11101',
    icon: 'coffee',
    mpid: '-1',
    bpid: '11100',
    name: '新建项目',
    route: '/service/new',
  },
  {
    id: '11102',
    icon: 'coffee',
    mpid: '-1',
    bpid: '11100',
    name: '项目编辑',
    route: '/service/:id',
  },
  {
    id: '11200',
    icon: 'gift',
    mpid: '10000',
    bpid: '10000',
    name: '商品管理',
    route: '/item',
  },
  {
    id: '11201',
    icon: 'gift',
    mpid: '-1',
    bpid: '11200',
    name: '新增商品',
    route: '/item/new',
  },
  {
    id: '11202',
    icon: 'gift',
    mpid: '-1',
    bpid: '11200',
    name: '商品编辑',
    route: '/item/:id',
  },
  {
    id: '10400',
    icon: 'user',
    mpid: '10000',
    bpid: '10000',
    name: '技师推新规则',
    route: '/system/new-waiter-rules',
  },
  {
    id: '10500',
    icon: 'setting',
    mpid: '10000',
    bpid: '10000',
    name: '评价规则',
    route: '/system/evaluation-rules',
  },
  {
    id: '10600',
    icon: 'setting',
    mpid: '10000',
    bpid: '10000',
    name: '消费行为录入规则',
    route: '/system/behavior-entry-rules',
  },
  {
    id: '10700',
    icon: 'setting',
    mpid: '10000',
    bpid: '10000',
    name: '积分规则',
    route: '/system/points-rules',
  },
  {
    id: '10800',
    icon: 'setting',
    mpid: '10000',
    bpid: '10000',
    name: '会员年费设置',
    route: '/system/member',
  },
  // {
  //   id: '10900',
  //   icon: 'setting',
  //   mpid: '10000',
  //   bpid: '10000',
  //   name: '考勤设置',
  //   route: '/system/attendance-rules',
  // },
  {
    id: '11000',
    icon: 'setting',
    mpid: '10000',
    bpid: '10000',
    name: '操作日志',
    route: '/system/log',
  },
  {
    id: '20000',
    icon: 'shop',
    name: '门店管理',
  },
  {
    id: '20100',
    icon: 'shop',
    mpid: '20000',
    bpid: '20000',
    name: '门店设置',
    route: '/store/setting',
  },
  {
    id: '20200',
    icon: 'home',
    mpid: '20000',
    bpid: '20000',
    name: '房间设置',
    route: '/room/manage',
  },
  {
    id: '20201',
    icon: 'home',
    mpid: '-1',
    bpid: '20200',
    name: '新建房间',
    route: '/store/:sid/room/new',
  },
  {
    id: '20202',
    icon: 'home',
    mpid: '-1',
    bpid: '20200',
    name: '房间编辑',
    route: '/store/:sid/room/:rid',
  },
  {
    id: '20300',
    icon: 'home',
    mpid: '20000',
    bpid: '20000',
    name: '房态查询',
    route: '/room/list',
  },
  {
    id: '20400',
    icon: 'coffee',
    mpid: '20000',
    bpid: '20000',
    name: '项目设置',
    route: '/store/service',
  },
  {
    id: '20401',
    icon: 'coffee',
    mpid: '-1',
    bpid: '20400',
    name: '新建项目',
    route: '/store/:sid/service/new',
  },
  {
    id: '20402',
    icon: 'coffee',
    mpid: '-1',
    bpid: '20400',
    name: '项目编辑',
    route: '/store/:sid/service/:id',
  },
  {
    id: '20500',
    icon: 'gift',
    mpid: '20000',
    bpid: '20000',
    name: '商品设置',
    route: '/store/item/manage',
  },
  {
    id: '20501',
    icon: 'gift',
    mpid: '-1',
    bpid: '20500',
    name: '新增商品',
    route: '/store/:sid/item/new',
  },
  {
    id: '20502',
    icon: 'gift',
    mpid: '-1',
    bpid: '20500',
    name: '商品编辑',
    route: '/store/:sid/item/:id',
  },
  {
    id: '20600',
    icon: 'user',
    mpid: '20000',
    bpid: '20000',
    name: '员工管理',
    route: '/employee/manage',
  },
  {
    id: '20601',
    icon: 'user',
    mpid: '-1',
    bpid: '20600',
    name: '新增员工',
    route: '/store/:sid/employee/new',
  },
  {
    id: '20602',
    icon: 'user',
    mpid: '-1',
    bpid: '20600',
    name: '员工编辑',
    route: '/store/:sid/employee/:id',
  },
  {
    id: '20603',
    icon: 'user',
    mpid: '-1',
    bpid: '20600',
    name: '调入员工',
    route: '/employee/transfer/:sid',
  },
  {
    id: '20604',
    icon: 'user',
    mpid: '-1',
    bpid: '20600',
    name: '员工信息',
    route: '/employee/detail/:id',
  },
  {
    id: '20800',
    icon: 'schedule',
    mpid: '20000',
    bpid: '20000',
    name: '请假审批',
    route: '/leave-approval',
  },
  {
    id: '20900',
    icon: 'schedule',
    mpid: '20000',
    bpid: '20000',
    name: '排班设置',
    route: '/scheduling',
  },
  {
    id: '20901',
    icon: 'schedule',
    mpid: '-1',
    bpid: '20900',
    name: '班次设置',
    route: '/shift-setting/:sid',
  },
  {
    id: '21000',
    icon: 'schedule',
    mpid: '20000',
    bpid: '20000',
    name: '班次查询',
    route: '/scheduling/search',
  },
  {
    id: '21100',
    icon: 'clock-circle-o',
    mpid: '20000',
    bpid: '20000',
    name: '排钟查询',
    route: '/shift',
  },
  {
    id: '30000',
    icon: 'solution',
    name: '订单管理',
  },
  {
    id: '30200',
    icon: 'solution',
    mpid: '30000',
    bpid: '30000',
    name: '服务订单查询',
    route: '/order',
  },
  {
    id: '30300',
    icon: 'solution',
    mpid: '30000',
    bpid: '30000',
    name: '商品订单查询',
    route: '/order/item',
  },
  {
    id: '30201',
    icon: 'solution',
    mpid: '-1',
    bpid: '30200',
    name: '订单详情',
    route: '/order/:id',
  },
  {
    id: '30202',
    icon: 'solution',
    mpid: '-1',
    bpid: '30200',
    name: '子订单详情',
    route: '/order/:id/:sid',
  },
  {
    id: '40000',
    icon: 'team',
    name: '用户管理',
  },
  {
    id: '40100',
    icon: 'team',
    mpid: '40000',
    bpid: '40000',
    name: '用户查询',
    route: '/customer',
  },
  {
    id: '40101',
    icon: 'team',
    mpid: '-1',
    bpid: '40000',
    name: '用户详情',
    route: '/customer/:id',
  },
  {
    id: '50000',
    icon: 'bulb',
    name: '营销管理',
  },
  {
    id: '50100',
    icon: 'bulb',
    mpid: '50000',
    bpid: '50000',
    name: '营销推送',
    route: '/push',
  },
  {
    id: '50101',
    icon: 'bulb',
    mpid: '-1',
    bpid: '50100',
    name: '新建推送',
    route: '/push/new',
  },
  {
    id: '50200',
    icon: 'bulb',
    mpid: '50000',
    bpid: '50000',
    name: '优惠券管理',
    route: '/coupon',
  },
  {
    id: '50201',
    icon: 'bulb',
    mpid: '-1',
    bpid: '50200',
    name: '新建优惠券',
    route: '/coupon/new',
  },
  {
    id: '50202',
    icon: 'bulb',
    mpid: '-1',
    bpid: '50200',
    name: '更新优惠券',
    route: '/coupon/:id',
  },
  // {
  //   id: '50300',
  //   icon: 'bulb',
  //   mpid: '50000',
  //   bpid: '50000',
  //   name: '优惠券发放',
  //   route: '/coupon/send',
  // },
  // {
  //   id: '50301',
  //   icon: 'bulb',
  //   mpid: '-1',
  //   bpid: '50300',
  //   name: '新建优惠券发放',
  //   route: '/coupon/send/new',
  // },
  {
    id: '50300',
    icon: 'bulb',
    mpid: '50000',
    bpid: '50000',
    name: '优惠券发放',
    route: '/coupon-receive',
  },
  {
    id: '50301',
    icon: 'bulb',
    mpid: '-1',
    bpid: '50300',
    name: '新建优惠券发放',
    route: '/coupon-receive/new',
  },
  {
    id: '50303',
    icon: 'bulb',
    mpid: '-1',
    bpid: '50300',
    name: '更新优惠券发放',
    route: '/coupon-receive/:id',
  },
  {
    id: '50400',
    icon: 'bulb',
    mpid: '50000',
    bpid: '50000',
    name: '优惠券兑换',
    route: '/coupon-exchange',
  },
  {
    id: '50401',
    icon: 'bulb',
    mpid: '-1',
    bpid: '50400',
    name: '新建优惠券兑换',
    route: '/coupon-exchange/new',
  },
  {
    id: '50600',
    icon: 'bulb',
    mpid: '50000',
    bpid: '50000',
    name: '团购授权',
    route: '/group-auth',
  },
  {
    id: '50500',
    icon: 'bulb',
    mpid: '50000',
    bpid: '50000',
    name: '团购管理',
    route: '/group-purchase',
  },
  {
    id: '50501',
    icon: 'bulb',
    mpid: '-1',
    bpid: '50500',
    name: '新建团购',
    route: '/group-purchase/new',
  },
  {
    id: '50700',
    icon: 'bulb',
    mpid: '50000',
    bpid: '50000',
    name: '验券查询',
    route: '/group-purchase/log',
  },
  {
    id: '50502',
    icon: 'bulb',
    mpid: '-1',
    bpid: '50500',
    name: '更新团购',
    route: '/group-purchase/:id',
  },
  
  {
    id: '60000',
    icon: 'red-envelope',
    name: '工资管理',
  },
  {
    id: '60100',
    icon: 'red-envelope',
    mpid: '60000',
    bpid: '60000',
    name: '工资规则',
    route: '/wage/rules',
  },
  {
    id: '60101',
    icon: 'red-envelope',
    mpid: '-1',
    bpid: '60100',
    name: '技师工资规则',
    route: '/stores/:sid/wage/rules/0',
  },
  {
    id: '60102',
    icon: 'red-envelope',
    mpid: '-1',
    bpid: '60100',
    name: '技师老师工资规则',
    route: '/stores/:sid/wage/rules/1',
  },
  {
    id: '60103',
    icon: 'red-envelope',
    mpid: '-1',
    bpid: '60100',
    name: '迎宾工资规则',
    route: '/stores/:sid/wage/rules/2',
  },
  {
    id: '60104',
    icon: 'red-envelope',
    mpid: '-1',
    bpid: '60100',
    name: '保洁工资规则',
    route: '/stores/:sid/wage/rules/3',
  },
  {
    id: '60105',
    icon: 'red-envelope',
    mpid: '-1',
    bpid: '60100',
    name: '吧员工资规则',
    route: '/stores/:sid/wage/rules/4',
  },
  {
    id: '60106',
    icon: 'red-envelope',
    mpid: '-1',
    bpid: '60100',
    name: '店长工资规则',
    route: '/stores/:sid/wage/rules/5',
  },
  {
    id: '60107',
    icon: 'red-envelope',
    mpid: '-1',
    bpid: '60100',
    name: '店助工资规则',
    route: '/stores/:sid/wage/rules/6',
  },
  {
    id: '60200',
    icon: 'red-envelope',
    mpid: '60000',
    bpid: '60000',
    name: '工资发布',
    route: '/wage/search',
  },
  {
    id: '60202',
    icon: 'red-envelope',
    mpid: '-1',
    bpid: '60200',
    name: '新建工资发布',
    route: '/wage/create',
  },
  {
    id: '60201',
    icon: 'red-envelope',
    mpid: '-1',
    bpid: '60200',
    name: '工资发布',
    route: '/wage/:id',
  },
  {
    id: '70000',
    icon: 'area-chart',
    name: '统计报表',
  },
  {
    id: '70100',
    icon: 'area-chart',
    mpid: '70000',
    bpid: '70000',
    name: '充值统计',
    route: '/charts/recharge',
  },
  {
    id: '70200',
    icon: 'area-chart',
    mpid: '70000',
    bpid: '70000',
    name: '用户统计',
    route: '/charts/new',
  },
  {
    id: '70300',
    icon: 'area-chart',
    mpid: '70000',
    bpid: '70000',
    name: '营收统计',
    route: '/charts/revenue',
  },
  {
    id: '70400',
    icon: 'area-chart',
    mpid: '70000',
    bpid: '70000',
    name: '员工业绩统计',
    route: '/charts/performance',
  },
  {
    id: '70500',
    icon: 'area-chart',
    mpid: '-1',
    bpid: '70400',
    name: '员工业绩明细',
    route: '/charts/performance/:date/:type',
  },
  {
    id: '70600',
    icon: 'area-chart',
    mpid: '-1',
    bpid: '70200',
    name: '用户明细',
    route: '/charts/new/user/:date',
  },
  {
    id: '70700',
    icon: 'area-chart',
    mpid: '-1',
    bpid: '70200',
    name: '会员明细',
    route: '/charts/new/member/:date',
  },
  {
    id: '70800',
    icon: 'area-chart',
    mpid: '70000',
    bpid: '70000',
    name: '房间统计',
    route: '/charts/room',
  },
  {
    id: '70900',
    icon: 'area-chart',
    mpid: '70000',
    bpid: '70000',
    name: '营业分析',
    route: '/charts/analysis',
  },
    {
    id: '71000',
    icon: 'area-chart',
    mpid: '70000',
    bpid: '70000',
    name: '考勤统计',
    route: '/attendance/manage',
  },
  {
    id: '71001',
    icon: 'area-chart',
    mpid: '-1',
    bpid: '71000',
    name: '考勤明细',
    route: '/stores/:sid/attendance/detail/:id',
  },
]
