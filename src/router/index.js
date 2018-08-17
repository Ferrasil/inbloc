import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/components/Home')
const AuthHome = () => import('@/components/AuthHome')
const Profile = () => import('@/components/User/Profile')
const Signup = () => import('@/components/User/Signup')
const Signin = () => import('@/components/User/Signin')
const InsurerHome = () => import('@/components/InsurerHome')
const AssessorHome = () => import('@/components/AssessorHome')
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home page'
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: AuthHome,
      meta: {
        requiresAuth: true,
        title: 'My claims'
      }
    },
    {
      path: '/insurer',
      name: 'Insurer dashboard',
      component: InsurerHome,
      meta: {
        requiresAuth: true,
        title: 'Insurer dashboard'
      }
    },
    {
      path: '/assessor',
      name: 'Assessor dashboard',
      component: AssessorHome,
      meta: {
        requiresAuth: true,
        title: 'Assessor dashboard'
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true,
        title: 'Profile page'
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      meta: {
        title: 'Signup page'
      }
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin,
      meta: {
        title: 'Signin page'
      }
    }
  ],
  mode: 'history'
})
