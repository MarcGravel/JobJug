import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Schedule from '../views/Schedule.vue'
import Jobs from '../views/Jobs.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: Schedule
  },
  {
    path: '/jobs/:jobId',
    name: 'Jobs',
    props: true,
    component: Jobs
  },
  {
    path: '/jobs/',
    name: 'Jobs',
    component: Jobs
  },
  
]

const router = new VueRouter({
  routes
})

export default router
