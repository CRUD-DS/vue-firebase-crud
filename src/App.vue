<template>
	<div id="app">
		<table>
			<tr>
				<th v-for = "path in paths">
					<router-link :to = "path.path">
						{{path.name}}
					</router-link>
				</th>
			</tr>
		</table>
		<router-view></router-view>
		<Notification></Notification>
	</div>
</template>

<script>
import Notification from "./components/Notification";
export default {
	name: 'App',
	components:{
		Notification,
	},
	data(){
		return {
			paths:[
			{
				path: "/manual-products",
				name: "Products"
			},
			],
		}
	},
	mounted(){
	},
	methods:{
	}
};
</script>

