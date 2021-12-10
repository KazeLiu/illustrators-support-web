import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import Vote from '../views/Vote'
import Result from '../views/Result'
import Illustrator from '../views/Illustrator'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/',
                redirect: 'illustrator'
            },
            {
                path: 'vote',
                name: 'Vote',
                component: Vote
            },
            {
                path: 'result',
                name: 'Result',
                component: Result
            },
            {
                path: 'illustrator',
                name: 'Illustrator',
                component: Illustrator
            }
        ]
    },

]

const router = new VueRouter({
    routes,
})

function getToken() {
    if (localStorage.authenticated.length > 0) {
        return true
    } else {
        return false;
    }
}

router.beforeEach((to, from, next) => {
    if (getToken() || to.path === '/login') {
        next();
    } else {
        this.msgSuccess("下线，请重新登录");
        next('/login');
    }
})

export default router
