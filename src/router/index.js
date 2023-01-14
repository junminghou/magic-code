import Vue from 'vue'
import Router from 'vue-router'
import flash from '@/components/flash'
import beautiful from '@/components/beautiful'
import memory from '@/components/memory'
import xman from '@/components/xman'
import qingcao from '@/components/qingcao'
import method from '@/components/method'
import field_check from '@/components/field_check'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'flash',
      component: flash
    },
    {
      path: '/v1',
      name: 'beautiful',
      component: beautiful
    },
    {
      path: '/memory',
      name: 'memory',
      component: memory
    },
    {
      path: '/xman',
      name: 'xman',
      component: xman
    },
    {
      path: '/qingcao',
      name: 'qingcao',
      component: qingcao
    },
    {
      path: '/method',
      name: 'method',
      component: method
    }
  ]
})
