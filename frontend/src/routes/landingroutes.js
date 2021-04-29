import FrontPage from "../landing/FrontPage";
import Register from "../landing/Register";
import SwitchUser from "../landing/Register/SwitchUser";
import Activate from "../landing/Activate";
import ProductLogin from "../landing/ProductLogin";

var landingRoutes = [
    { path: '/', exact: true, name: 'Landing', icon: 'mdi mdi-account-key', component: FrontPage },
    { path: '/switch', exact: false, name: 'Register', icon: 'mdi mdi-account-plus', component: SwitchUser },
    { path: '/register', exact: false, name: 'Register', icon: 'mdi mdi-account-plus', component: Register },
    { path: '/activate/:uid/:token', exact: false, name: 'Activate', icon: 'mdi mdi-account-plus', component: Activate },
  	{ path: null, pathTo: '/', name: 'Home', redirect: true }
];

if (process.env.NODE_ENV === 'production') {
  landingRoutes.unshift({ path: '/login',exact: false,  name: 'Register', icon: 'mdi mdi-account-plus', component: ProductLogin })
} else {
  landingRoutes.unshift({ path: '/login',exact: false,  name: 'Register', icon: 'mdi mdi-account-plus', component: ProductLogin })
}
export default landingRoutes;