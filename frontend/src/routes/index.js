import StoreLayout from '../layouts/StoreLayout.js';
import LandingLayout from "../layouts/LandingLayout";

var indexRoutes = [
    { path: "/s", name: 'Dashboard', component: StoreLayout },
    { path: '/', name: '/', component: LandingLayout },
];

export default indexRoutes;
