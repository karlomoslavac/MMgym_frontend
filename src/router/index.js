import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import UserDashboard from '../components/UserDashboard.vue';
import OwnerDashboard from '../components/OwnerDashboard.vue';
import store from '../store';
import NotFound from '../components/NotFound.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/user-dashboard', component: UserDashboard, meta: { requiresAuth: true } },
    { path: '/owner-dashboard', component: OwnerDashboard, meta: { requiresAuth: true, requiresOwner: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.state.isLoggedIn) {
            next({ path: '/login' });
        } else if (to.matched.some(record => record.meta.requiresOwner)) {
            if (store.state.user.role === 'owner') {
                next();
            } else {
                next({ path: '/user-dashboard' });
            }
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;