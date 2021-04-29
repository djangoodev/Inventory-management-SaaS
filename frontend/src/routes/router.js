import Dashboard from '../store/dashboard/dashboard';
import CategoryManagement from '../store/category'
import ListProduct from "../store/product/list-product";
import EditProduct from "../store/product/edit-product";
import NewProduct from '../store/product/new-product';
import Logistic from "../store/logistic";
import Setting from "../store/setting";
import CompleteProfile from "../store/complete-profile";
import Billing from "../store/billing";

var StoreRoutes = [
	{
		navlabel: true,
		name: "Personal",
		icon: "mdi mdi-dots-horizontal",
	},
	{
		path: "/s/complete-profile",
		name: "CompleteProfile",
		icon: "mdi mdi-setting",
		component: CompleteProfile
	},
	{
		path: '/s/dashboard',
		name: 'Dashboard',
		icon: 'ti-dashboard',
		component: Dashboard
	},
	{
		path: "/s/category",
		name: "Category",
		icon: "mdi mdi-buffer",
		component: CategoryManagement
	},
	{
		path: "/s/product/:id",
		name: "Edit Product",
		icon: "mdi mdi-reproduction",
		component: EditProduct
	},
	{
		path: "/s/product/",
		name: "Product",
		icon: "mdi mdi-reproduction",
		component: ListProduct
	},
	{
		path: "/s/product-new",
		name: "Product",
		icon: "mdi mdi-reproduction",
		component: NewProduct
	},
	{
		path: "/s/product-edit",
		name: "Product",
		icon: "mdi mdi-reproduction",
		component: NewProduct
	},
	{
		path: "/s/logistics",
		name: "Logistics",
		icon: "mdi mdi-reproduction",
		component: Logistic
	},
	{
		path: "/s/settings",
		name: "Settings",
		icon: "mdi mdi-setting",
		component: Setting
	},
	{
		path: "/s/billing",
		name: "Settings",
		icon: "mdi mdi-setting",
		component: Billing
	},
	{ path: '/s', pathTo: '/s/dashboard', name: 'Dashboard', redirect: true }
];
export default StoreRoutes;
