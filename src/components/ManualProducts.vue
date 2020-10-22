<template>
	<div>
		<!-- ADD / EDIT / DUPLICATE FORMS -->
		<div v-if = "adding || editing">
			<div>
				<button @click = "cancel">Cancel</button>
				<button @click = "submit">Submit</button>
			</div>
			<table>
				<tr>
					<th>Name</th>
					<td>
						<input placeholder = "Name" type="text" v-model = "form.Name" :maxlength = "NameMaxLength" :minlength = "NameMinLength">
						<p v-if = "errorMsg.Name">{{errorMsg.Name}}</p>
					</td>
				</tr>
				<tr>
					<th>Description</th>
					<td>
						<textarea placeholder = "Description" type="text" v-model = "form.Description" :maxlength = "DescriptionMaxLength" :minlength = "DescriptionMinLength"></textarea>
						<p v-if = "errorMsg.Description">{{errorMsg.Description}}</p>
					</td>
				</tr>
				<tr>
					<th>Price</th>
					<td>
						<input placeholder = "Price" type="text" v-model = "form.Price" :max = "PriceMax" :min = "PriceMin">
						<p v-if = "errorMsg.Price">{{errorMsg.Price}}</p>
					</td>
				</tr>
			</table>
		</div>

		<!-- VIEW FORM -->
		<div v-else-if = "viewing">
			<div>
				<button @click = "cancel">Back</button>
			</div>
			<table>
				<tr>
					<th>Name</th>
					<td>
						{{form.Name}}
					</td>
				</tr>
				<tr>
					<th>Description</th>
					<td>
						{{form.Description}}
					</td>
				</tr>
				<tr>
					<th>Price</th>
					<td>
						{{formatNum(form.Price, {dp: 2, currency: "USD"})}}
					</td>
				</tr>
			</table>
		</div>

		<!-- SORT MULTI-VIEW -->
		<div v-else-if = "sorting">
			<div>
				<button @click = "cancel">Cancel</button>
				<button @click = "sortSubmit">Update</button>
			</div>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Price</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody id = "sortItems">
					<tr v-for = "(item, index) in items" :id = "index">
						<td>{{item.Name}}</td>
						<td>{{item.Description}}</td>
						<td>{{formatNum(item.Price, {dp: 2, currency: "USD"})}}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- READ MULTI-VIEW -->
		<div v-else>
			<div>
				<button @click = "addStart">Add</button>
				<button @click = "sortStart">Sort</button>
			</div>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Price</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for = "item in items">
						<td>{{item.Name}}</td>
						<td>{{item.Description}}</td>
						<td>{{formatNum(item.Price, {dp: 2, currency: "USD"})}}</td>
						<td>
							<button @click = "duplicate(item)">Duplicate</button>
							<button @click = "editStart(item)">Edit</button>
							<button @click = "deleteItem(item)">Delete</button>
							<button @click = "viewItem(item)">View</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script type="text/javascript">
export default{
	data(){
		return {
			// DISPLAY
			adding: false,
			editing: false,
			viewing: false,
			sorting: false,

			// FORMS
			form: {
				"Name": "",
				"Description": "",
				"Price": "0"
			},
			errorMsg: {
				"Name": "",
				"Description": "",
				"Price": ""
			},
			items: [],
			editID: "",

			// RANGES
			NameMinLength: "5",
			NameMaxLength: "50",
			DescriptionMinLength: "0",
			DescriptionMaxLength: "150",
			PriceMin: "5",
			PriceMax: "50",


		}
	},
	firestore(){
		this.$binding("items", cdsDB.getCol("products").orderBy("cdsSortIndex"));
	},
	methods:{
		// CANCEL
		cancel(){
			this.editing = false;
			this.adding = false;
			this.viewing = false;
			this.sorting = false;
		},
		// SORT
		sortStart(){
			this.sorting = true;
			this.$nextTick(()=>{
				$("#sortItems").sortable();
			})
		},
		sortSubmit(){
			let array = $("#sortItems").sortable("toArray");
			let batch = cdsDB.db.batch();
			this.items.forEach((item, itemIndex)=>{
				batch.update(cdsDB.getDoc("products", item[".key"]), {cdsSortIndex: parseInt(array[itemIndex])});
			})
			batch.commit();
			this.cancel();
		},
		// VIEW
		viewItem(item){
			this.form = {
				Name: item.Name,
				Description: item.Description,
				Price: item.Price.toString(),
			};
			this.viewing = true;
		},
		// ADD
		addStart(){
			this.form = {
				Name: "",
				Description: "",
				Price: "0"
			};
			this.errorMsg = {
				Name: "",
				Description: "",
				Price: ""
			};
			this.adding = true;
		},
		submit(){
			let form = cdsCopier.copy(this.form);
			let error = false;
			let errorMsg = {
				Name: "",
				Description: "",
				Price: ""
			};
			form.Price = parseFloat(form.Price);

			if (form.Name.length < this.NameMinLength){
				error = true;
				errorMsg.Name = "Name must be at least " + this.NameMinLength + " characters long.";
			}
			else if (form.Name.length > this.NameMaxLength){
				error = true;
				errorMsg.Name = "Name cannot be more than " + this.NameMaxLength + " characters long.";
			}
			if (form.Description.length < this.DescriptionMinLength){
				error = true;
				errorMsg.Description = "Description must be at least " + this.DescriptionMinLength + " characters long.";
			}
			else if (form.Description.length > this.DescriptionMaxLength){
				error = true;
				errorMsg.Description = "Description cannot be more than " + this.DescriptionMaxLength + " characters long.";
			}
			if (parseFloat(form.Price) < this.PriceMin){
				error = true;
				errorMsg.Price = "Price must be at least " + this.formatNum(this.PriceMin, {dp: 2, currency: "USD"}) + ".";
			}
			this.errorMsg = errorMsg;

			if (!error){
				if (this.adding){
					cdsDB.setDoc("products", form);
				}
				else if (this.editing){
					cdsDB.updateDoc("products", form, this.editID);
				}
				this.cancel();
			}
		},

		// DUPLICATE
		duplicate(item){
			this.form = {
				Name: item.Name,
				Description: item.Description,
				Price: item.Price.toString(),
			};
			this.errorMsg = {
				Name: "",
				Description: "",
				Price: ""
			};
			this.editID = item[".key"];
			this.adding = true;
		},

		// EDIT
		editStart(item){
			this.form = {
				Name: item.Name,
				Description: item.Description,
				Price: item.Price.toString(),
			};
			this.errorMsg = {
				Name: "",
				Description: "",
				Price: ""
			};
			this.editID = item[".key"];
			this.editing = true;
		},

		// DELETE
		deleteItem(item){
			cdsDB.deleteDoc("products", item[".key"]);
		}
	}
};
</script>