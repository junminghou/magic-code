import Vue from 'vue'
import Router from 'vue-router'
import flash from '@/components/flash'
import beautiful from '@/components/beautiful'


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
    }
  ]
})
