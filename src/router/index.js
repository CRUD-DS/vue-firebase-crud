//---------------------- IMPORT ----------------------//
// VUE AND ROUTER
import Vue from "vue"
import Router from "vue-router"

// PROJECT FILES
import ManualProducts from "../components/ManualProducts";

//---------------------- EXPORT ----------------------//
Vue.use(Router)
export default new Router({
	mode: "history",
	routes: [
	// AUTH
	{
		path: "/manual-products",
		name: "Manual Products",
		component: ManualProducts
	},
	]
})

