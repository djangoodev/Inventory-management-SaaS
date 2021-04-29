import Dashboard from '../../../store/dashboard/dashboard';
import CategoryManagement from '../../../store/category'
import ListProduct from "../../../store/product/list-product";
import Setting from "../../../store/setting";
import Billing from "../../../store/billing";

var Menu = [
	{
		path: '/s/dashboard',
		name: 'Dashboard',
		icon: 'ti-dashboard',
		component: Dashboard
	},
	{
		path: "/s/settings",
		name: "Settings",
		icon: "mdi mdi-settings",
		component: Setting
	},
	{
		path: "/s/category",
		name: "Categories",
		icon: "mdi mdi-buffer",
		component: CategoryManagement
	},
	{
		path: "/s/product",
		name: "Products",
		icon: "mdi mdi-reproduction",
		component: ListProduct
	},
	{
		path: "/s/customer",
		name: "Customers",
		icon: "mdi mdi-account-multiple",
		component: Dashboard
	},
	{
		path: "/s/sales",
		name: "Sales",
		icon: "mdi mdi-sale",
		component: Dashboard
	},
	{
		path: "/s/logistics",
		name: "Logistics",
		icon: "mdi mdi-truck-delivery",
		component: Dashboard
	},
	{
		path: "/s/billing",
		name: "Billing",
		icon: "mdi mdi-currency-usd",
		component: Billing
	},
	{
		path: "/s/website",
		name: "Website",
		icon: "mdi mdi-web",
		component: Dashboard
	},


];
export default Menu;
