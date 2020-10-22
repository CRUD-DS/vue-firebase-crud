/*
	display(price, mode)
		- price: float
		- mode:
			- currency	: string
			- dp 		: number
*/
//======================================================//
//														//
//						CALCULATION						//
//														//
//======================================================//

//--------- OBTAIN ROUNDING TO NEAREST 5 CENTS ---------//
function roundingValue(price){
	price = parseFloat(price);
	// Var declaration
	var ringgit, cents;
	var centDigits;

	// Calculation
	ringgit = Math.floor(price);
	cents = Math.round(100*(price - ringgit));
	centDigits = cents%10;

	if (centDigits < 3){
		return centDigits/100;
	}
	else if (centDigits < 6){
		return (centDigits - 5)/100;
	}
	else if (centDigits < 8){
		return (5 -  centDigits)/100;
	}
	else{
		return (10 - centDigits)/100;
	}
}


//-------------- ROUND TO NEAREST 5 CENTS --------------//
function roundedValue(price){
	price = parseFloat(price);
	return price + roundingValue(price);
}



//======================================================//
//														//
//						DISPLAY							//
//														//
//======================================================//

//---------------------- PRICE -------------------------//
function display(price, mode){
	price = parseFloat(price);
	// Mode
	var currency = mode.currency || "";
	var dp = mode.dp || 0;
	var whole, decimal, decimalOutput = "";

	// Obtains number
	if (price<0){
		currency = "- " + currency;
		price = Math.abs(price);
	}

	// Calculation
	if (currency){
		currency = currency + " ";
	}
	whole = Math.floor(price);
	decimal = (price - whole).toString().split("");
	if (decimal.includes(".")){
		decimal = decimal.slice(decimal.indexOf(".") + 1, decimal.length);
	}
	for (var index = 0; index < dp; index++){
		decimalOutput += decimal[index] || "0";
	}

	// Output
	return  dp>0 ? currency + whole + "." + decimalOutput: currency + whole;
}



//======================================================//
//														//
//						EXPORT							//
//														//
//======================================================//
export default{
	roundingValue,
	roundedValue,
	display,
}

