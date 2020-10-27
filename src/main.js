//---------------------- IMPORTS -----------------------//
// VUE STUFF
import Vue from 'vue'							// VUE
import App from './App'							// BASE APP
import router from './router'					// ROUTER
import VueFB from "vue-firestore"				// VUE FIRESTORE
import VueModal from "vue-js-modal"				// MODAL
import VueToasted from "vue-toasted"			// TOASTED
import VueSortable from 'vue-sortable'			// SORTABLE
import jQuery from "jquery"						// JQUERY

// JS
import cdsDB from "./dbAuthManager.js"			// DATABASE AND AUTH MANAGER
import cdsCopier from "./assets/js/copyManager.js"// COPY MANAGER
import cdsDate from "./assets/js/dateManager.js"// DATE MANAGER
import cdsNum from "./assets/js/priceManager.js"// NUMBER MANAGER
import cdsStat from "./assets/js/statManager.js"// STATISTICS MANAGER
import { saveAs } from 'file-saver';			// FILE SAVER

// CSS
import "./assets/css/style.css";

//----------------------- INIT -------------------------//
Vue.use(VueFB);
Vue.use(VueModal);
Vue.use(VueToasted);
Vue.use(VueSortable);
global.cdsDB = cdsDB
global.cdsCopier = cdsCopier;
global.cdsDate = cdsDate;
global.cdsNum = cdsNum;
global.cdsStat = cdsStat;
global.$ = jQuery;
global.jQuery = jQuery;

Vue.prototype.formatNum = cdsNum.display;
Vue.prototype.formatDate = cdsDate.displayDate;
Vue.prototype.formatTime = cdsDate.displayTime;

//------------------------ RUN -------------------------//
cdsDB.auth.onAuthStateChanged(user=>{
	new Vue({
		el: '#app',
		router,
		render: h => h(App)
	})
})
