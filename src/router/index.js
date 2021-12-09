import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Vote from '../views/Vote'
import Result from '../views/Result'
import Illustrator from '../views/Illustrator'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/vote',
        name: 'Vote',
        component: Vote
    },
    {
        path: '/result',
        name: 'Result',
        component: Result
    },
    {
        path: '/illustrator',
        name: 'Illustrator',
        component: Illustrator
    }
]

const router = new VueRouter({
    routes
})

export default router
