//-------------------------- OTHER -------------------------//
digit = function(input, n){
	return Math.round(input*10**n)/10**n;
}
//--------------------------- SORT -------------------------//
sortBy = function(array, field, order){
	var field = field || [];
	var order = order || "asc";
	var orderFunction = {
		"asc"(x,y){
			return x - y;
		},
		"desc"(x,y){
			return y - x;
		}
	}
	if (typeof(field) == "string"){
		field = [field];
	}
	return array.sort((x, y)=>{
		field.forEach(f=>{
			x = x[f];
			y = y[f];
		})
		return orderFunction(x, y);
	});
}
binBy = function(array, field, outputType){
	var outputType = outputType || "json";
	var field = field || [];
	var output = {};
	var fieldVal;
	if (typeof(field) == "string"){
		field = [field];
	}
	array.forEach(elem=>{
		fieldVal = elem;
		field.forEach(f=>{
			fieldVal = fieldVal[f];
		})
		if (output[fieldVal] == undefined){
			output[fieldVal] = [];
		}
		output[fieldVal].push(elem);
	})

	if (outputType == "json"){
		return cdsCopier.copy(output);
	}
	else{
		return jsonToArray(output);
	}
}
arrayToJson = function(input, key){
	var input = cdsCopier.copy(input) || [];
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
jsonToArray = function(input){
	var output = [];
	var elemNow;

	for (var key in input){
		elemNow = cdsCopier.copy(input[key]);
		elemNow[".key"] = key;
		output.push(elemNow);
	}
	return output;
}

//-------------------------- BASIC -------------------------//
sum = function(array, field){
	var field = field || [];
	if (typeof(field) == "string"){
		field = [field];
	}
	return array.reduce((x, y)=>{
		field.forEach(f=>{
			y = y[f];
		})
		return x + y;
	}, 0);
}
mean = function(array, field){
	var field = field || [];
	return sum(array, field)/(array.length || 1);
}
median = function(array, field){
	var field = field || [];
	var sortedArray = sortBy(array, field);
	var arrLen = array.length;
	var isEven = arrLen%2 == 0;
	if (isEven){
		var start = array.length/2;
		return mean(array.slice(start, start + 2));
	}
	else{
		return cdsCopier.copy(array[(arrLen + 1)/2 - 1]);
	}
}
std = function(array, field){
	var field = field || [];
	var mu = mean(array, field);
	if (typeof(field) == "string"){
		field = [field];
	}
	return Math.sqrt(array.map(r=>{
		field.forEach(f=>{
			r = r[f];
		})
		return (r - mu)**2;
	}).reduce((x,y)=>{
		return x + y;
	}, 0)/(array.length || 1));
}






//------------------------- EXPORT -------------------------//
exports.digit = digit;
exports.sortBy = sortBy;
exports.binBy = binBy;
exports.sum = sum;
exports.mean = mean;
exports.median = median;
exports.std = std;