import { defineConfig } from 'umi';

export default defineConfig({
  layout: {
    name: 'LNight光夜社'
  },
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {
    loading: '@/pages/Loading'
  },
  history: {
    type: 'hash'
  },
  favicon: '/favicon.ico',
  routes: [
    {
      path: '/',
      component: '@/pages/index',
      name: '开始',
      icon: 'home'
    },
    {
      path: '/globalDefine',
      component: '@/pages/globalDefine',
      name: '全局规则',
      icon: 'profile'
    },
    {
      path: '/lang',
      component: '@/pages/lang',
      name: '语言',
      icon: 'edit'
    },
    {
      path: '/live',
      name:'直播间',
      icon: 'PlayCircleFilled',
      routes: [
        {
          path: '/live/index',
          component: '@/pages/live/index',
          name: '设置'
        },
        {
          path: '/live/define',
          component: '@/pages/live/define',
          name: '预设规则'
        },
        {
          path: '/live/gift',
          component: '@/pages/live/gift',
          name: '礼物'
        },
        {
          path: '/live/danmaku',
          component: '@/pages/live/danmaku',
          name: '弹幕'
        },
      ]
    },
    {
      path: '/up',
      name:'UP主',
      icon: 'user',
      routes: [
        {
          path: '/up/index',
          component: '@/pages/up/index',
          name: '设置'
        },
        {
          path: '/up/fans',
          component: '@/pages/up/fans',
          name: '粉丝数'
        }
      ]
    },
    {
      path: '/finish',
      component: '@/pages/finish',
      name: '完成',
      icon: 'rocket'
    },
  ],
  fastRefresh: {},
});
