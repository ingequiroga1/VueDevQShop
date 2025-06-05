
import { NavigationGuardNext, RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric } from "vue-router";
import { getCurrentUser} from "../../../services/auth/authService.ts";
// const isAuthenticatedGuard = (to:RouteLocationNormalizedGeneric,
//     next: NavigationGuardNext) => {
//         const userId = localStorage.getItem('userId');
//         localStorage.setItem('lastPath',to.path);
//         if(!userId){
//             return next({
//                 name: 'login'
//             });
//         }

//         return next();

//     }
const isAuthenticatedGuard = async (_to:RouteLocationNormalizedGeneric,
    _:RouteLocationNormalizedLoadedGeneric,
    next: NavigationGuardNext) => {
        const urlParams = new URLSearchParams(_to.fullPath);
        const type = urlParams.get('type')
        const user = await getCurrentUser();
        if(user){
            if (type == 'recovery') {
                return next({name: 'changePass'})
            }
            
            return next();
        }
        return next();
    
    }



export default isAuthenticatedGuard