import { createRouter, createWebHashHistory } from "vue-router";
import { NavigationGuardNext, RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric } from "vue-router";
import NotFound404 from "../modules/common/NotFound404.vue";
import LoginPage from "../modules/auth/pages/loginPage.vue";
//import ConfirmacionPage from "../modules/auth/pages/confirmacionPage.vue";
import { getCurrentUser} from "../services/auth/authService.ts";
import  isAuthenticatedGuard  from "../modules/auth/guards/is-autothenticated.guard";
import Changepass from "../modules/auth/pages/changepass.vue";

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
                 },
                {
                    path: '/register',
                    name: 'register',
                    component: () => import('../modules/auth/pages/registerPage.vue')
                },
                {
                    path: '/confirmpass',
                    name: 'confirm pass',
                    component: () => import('../modules/auth/pages/confirmPass.vue')
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

                },
                {
                    path: '/pedidos',
                    name: 'pedidos',
                    component: () => import('../modules/dashboard/pages/pedidos.vue')
                },
                 {
                    path: '/proveedores',
                    name: 'proveedores',
                    component: () => import('../modules/dashboard/pages/provPage.vue')
                },
                  {
                    path: '/proveedor/:id',
                    name: 'detalleProveedor',
                    component: () => import('../modules/dashboard/pages/detalleProv.vue')
                },
            ]
        },
         //Change pass page
         {
            path: '/changepass',
            name: 'changePass',
            meta: {requireAuth: true},
            component: Changepass,
        },
        {
            path: '/confirmpass',
            name: 'confirmpass',
            component: () => import('../modules/auth/pages/confirmPass.vue')
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

