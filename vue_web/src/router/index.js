import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
import AppLayout from '@/layout/AppLayout.vue';
import axios from 'axios';
const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('@/views/Dashboard.vue')
            },
            {
                path: '/uikit/monitor',
                name: 'monitor',
                component: () => import('@/views/uikit/Monitor.vue')
            },
            
            {
                path: '/uikit/rf',
                name: 'randomforest',
                component: () => import('@/views/uikit/RF.vue')
            },
            {
                path: '/uikit/form',
                name: 'form',
                component: () => import('@/views/uikit/Form.vue')
            },
            {
                path: '/uikit/file',
                name: 'file',
                component: () => import('@/views/uikit/File.vue')
            },
            {
                path: '/uikit/charts',
                name: 'charts',
                component: () => import('@/views/uikit/Chart.vue')
            },
           
            {
                path: '/pages/person',
                name: 'person',
                component: () => import('@/views/pages/Person.vue')
            },
        
    
            {
                path: '/auth/register',
                name: 'register',
                component: () => import('@/views/pages/auth/Register.vue')
            },
            {
                path: '/auth/accounts',
                name: 'accounts',
                component: () => import('@/views/pages/auth/Accounts.vue')
            },
            {
                path: '/auth/report',
                name: 'report',
                component: () => import('@/views/pages/auth/Reportcheck.vue')
            },
            {
                path: '/auth/announcement',
                name: 'announcement',
                component: () => import('@/views/pages/auth/Announcement.vue')
            }
        ]
    },

    {
        path: '/auth/login',
        name: 'login',
        component: () => import('@/views/pages/auth/Login.vue')
    },
    {
        path: '/auth/error',
        name: 'error',
        component: () => import('@/views/pages/auth/Error.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/auth/login', '/auth/error'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = store.getters.isAuthenticated;

    if (authRequired && !loggedIn) {
        return next('/auth/login');
    }

    next();
});

// router.post('/api/login', async (req, res) => {
//     const { account, password } = req.body;

//     try {
//         const response = await axios.post('/api/login', { account, password });
//         if (response.data.success) {
//             // 登入成功，執行相應的操作，例如導向到首頁
//             router.push('/');
//         } else {
//             // 登入失敗，顯示錯誤訊息
//             console.log('Invalid account or password.');
//         }
//     } catch (error) {
//         console.error('Error logging in:', error);
//         // 處理錯誤
//     }
// });
export default router;
