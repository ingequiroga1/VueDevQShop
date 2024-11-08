import { createRouter, createWebHashHistory } from "vue-router";
import { NavigationGuardNext, RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric } from "vue-router";
import NotFound404 from "../modules/common/NotFound404.vue";
import LoginPage from "../modules/auth/pages/loginPage.vue";
import ConfirmacionPage from "../modules/auth/pages/confirmacionPage.vue";
import { getCurrentUser} from "../services/supabaseClient";
import  isAuthenticatedGuard  from "../modules/auth/guards/is-autothenticated.guard";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path:'/',
            beforeEnter: [isAuthenticatedGuard],
            component: () => import('../modules/auth/layout/authLayout.vue'),
            children: [
                 {
                     path: '/',
                     name: 'login',
                     component: LoginPage
                     //component: () => import('../modules/auth/pages/loginPage.vue')
                 },
                 {
                    path: '/access_token=:access_token',
                    name: 'confirmar',
                    component: ConfirmacionPage,
                    props: route => ({
                        accessToken: route.hash.match(/access_token=([^&]*)/)?.[1] || '',
                        expiresAt: route.hash.match(/expires_at=([^&]*)/)?.[1] || '',
                        expiresIn: route.hash.match(/expires_in=([^&]*)/)?.[1] || '',
                        refreshToken: route.hash.match(/refresh_token=([^&]*)/)?.[1] || '',
                        tokenType: route.hash.match(/token_type=([^&]*)/)?.[1] || '',
                        type: route.hash.match(/type=([^&]*)/)?.[1] || ''
                      })
                },
                {
                    path: '/register',
                    name: 'register',
                    component: () => import('../modules/auth/pages/registerPage.vue')
                },
             
             ]
        },
        {
            path:'/dashboard',
            redirect: {name: 'home'},
           // beforeEnter: [isAuthenticatedGuard],
            name: 'dashboard',
            component: () => import('../modules/dashboard/layout/dashboardLayout.vue'),
            meta: {requireAuth: true},
            children:[
                {
                    path: '/ventas',
                    name: 'ventas',
                    component: () => import('../modules/dashboard/pages/ventasPage.vue')

                },
                {
                    path: '/inventario',
                    name: 'inventario',
                    component: () => import('../modules/dashboard/pages/inventarioPage.vue')

                },
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('../modules/dashboard/pages/homePage.vue')

                }
            ]
        },
        //404 page
        {
            path: '/:pathMatch(.*)*',
            component: NotFound404
        }
    ]
});

router.beforeEach(async(to:RouteLocationNormalizedGeneric,_:RouteLocationNormalizedLoadedGeneric,next:NavigationGuardNext) => {
    const requireAuth = to.matched.some(record => record.meta.requireAuth);
    
    if (requireAuth) {
        const user = await getCurrentUser();
        
        
        if (user) {
            next();
        }else{
            next({name: 'login'})
        }  
    }else{
        next();
    }
});

export default router;