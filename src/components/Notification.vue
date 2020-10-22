<template>
	<div>
		<modal name = "loading" :clickToClose = "false">
			<img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif" alt="">
		</modal>
	</div>
</template>


<script>
export default{
	mounted(){
		global.cdsNotify = {
			toast: (string, time, position, action)=>{
				if (!['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'].includes(position)){
					position = "top-right";
				}
				this.$toasted.show(string, { 
					theme: "toasted-primary", 
					position: position, 
					duration : time || 3000,
					action: action || {}
				});
			},
			loadStart: ()=>{
				this.$modal.show("loading");
			},
			loadEnd: ()=>{
				this.$modal.hide("loading");
			}
		}
	}
};
</script>
