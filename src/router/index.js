import Vue from 'vue'
import Router from 'vue-router'
import flash from '@/components/flash'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'flash',
      component: flash
    }
  ]
})
