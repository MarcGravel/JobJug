import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Schedule from '../views/Schedule.vue'
import Jobs from '../views/Jobs.vue'
import Users from '../views/Users.vue'
import Clients from '../views/Clients.vue'

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
    path: '/jobs/:jobId?',
    name: 'Jobs',
    props: true,
    component: Jobs
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Clients
  },
]

const router = new VueRouter({
  routes
})

export default router
