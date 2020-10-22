function copy(inputObject){
	var arrayConstructor = [].constructor;
	var objectConstructor = {}.constructor;

	var output;
	if (inputObject === null) {
		output = null;
	}
	else if (inputObject === undefined) {
		output = undefined;
	}
	else if (inputObject.constructor === arrayConstructor) {
		output = [];
		inputObject.forEach(element =>{
			output.push(copy(element));
		})
	}
	else if (inputObject.constructor === objectConstructor) {
		output = {};
		var item;
		for (item in inputObject){
			output[item] = copy(inputObject[item]);
		}
	}
	else {
		output = inputObject;
	}
	return output;
};
function copyAs(inputObject, value){
	var arrayConstructor = [].constructor;
	var objectConstructor = {}.constructor;

	var output;
	if (inputObject === null) {
		output = null;
	}
	else if (inputObject === undefined) {
		output = undefined;
	}
	else if (inputObject.constructor === arrayConstructor) {
		output = [];
		inputObject.forEach(element =>{
			output.push(copyAs(element, value));
		})
	}
	else if (inputObject.constructor === objectConstructor) {
		output = {};
		var item;
		for (item in inputObject){
			output[item] = copyAs(inputObject[item], value);
		}
	}
	else {
		output = value;
	}
	return output;
};
function countJSONKeys(input){
	var num = 0;
	for (var key in input){
		num++;
	}
	return num;
}
function arrayToJSON(input, key){
	var input = copy(input) || [];
	var output = {};
	var IDKey = key || "ID";
	var ID;

	for (var index = 0; index < input.length; index++){
		ID = input[index][IDKey] || index.toString();
		output[ID] = copy(input[index]);
		delete output[ID][IDKey];
	}

	return output;
}
function jsonToArray(input){
	var output = [];
	var elemNow;

	for (var key in input){
		elemNow = copy(input[key]);
		elemNow.ID = key;
		output.push(elemNow);
	}
	return output;
}
function copySort(input){
	var output
	if (input === null) {
		output = null;
	}
	else if (input === undefined) {
		output = undefined;
	}
	else if (input.constructor === {}.constructor){
		output = {};
		Object.keys(input).sort().forEach(key=>{
			output[key] = copySort(input[key])
		})
	}
	else if (input.constructor === [].constructor){
		if (input.length > 0){
			if (input[0].constructor === {}.constructor){
				output = [];
				input.forEach(obj=>{
					output.push(copySort(obj));
				})
			}
			else if (input[0].constructor === [].constructor){
				output = [];
				input.forEach(obj=>{
					output.push(copySort(obj));
				})
			}
			else{
				output = copy(input);
				output.sort();
			}
		}
		else{
			output = [];
		}
	}
	else{
		output = input;
	}
	return output;
}
function cdsSort(input){
	var output = [];
	var currentObject = {}, settings = {};
	input.forEach(r=>{
		settings = {};
		Object.keys(r["Settings"]).sort().forEach(key=>{
			settings[key] = r["Settings"][key];
		})
		currentObject = {
			"Name": r["Name"],
			"Type": r["Type"],
			"Settings": r["Settings"],
			"Compulsory": r["Compulsory"],
			"Multiview": r["Multiview"],
			"Unique": r["Unique"],
		};
		if (r.children){
			currentObject["children"] = cdsSort(r.children);
		}
		output.push(currentObject);
	})
	return output;
}
export default {
	copy,
	copyAs,
	copySort,
	cdsSort,
	countJSONKeys,
	arrayToJSON,
	jsonToArray
}