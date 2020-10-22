//======================================================//
//														//
//						IMPORT							//
//														//
//======================================================//
const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/auth");
require("firebase/storage");
require("firebase/functions");


//======================================================//
//														//
//						INIT							//
//														//
//======================================================//
// INSERT YOUR FIREBASE
const firebaseApp = firebase.initializeApp({
})


//----------------------- UTILS ------------------------//
const db = firebaseApp.firestore();
let fieldVal = firebase.firestore.FieldValue;

const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
const functions = firebase.functions();



//======================================================//
//														//
//						 DATABASE 						//
//														//
//======================================================//
//----------------------- CREATE -----------------------//
function setDoc(path, doc, docID, notiStart, notiDone){
	if (notiStart){
		cdsNotify.toast(notiStart);
	}
	let currentTime = new Date().getTime();
	let sequence = 1000;
	if (doc.constructor === {}.constructor){
		doc.ID = docID || db.collection(path).doc().id;
		doc["Date Created"] = currentTime;
		doc["cdsSortIndex"] = sequence;	
		return db.collection(path).doc(doc.ID).set(doc).then(() =>{
			if (notiDone){
				cdsNotify.toast(notiDone);
			}
			console.log("Setting " + docID + " at " + path + " was succcessful.");
		}).catch(err=>{
			console.log(err.message);
		})
	}
	else if (doc.constructor === [].constructor){
		let batch = db.batch();
		doc.forEach(d=>{
			d.ID = d.ID || db.collection(path).doc().id;
			d["Date Created"] = currentTime;
			d["cdsSortIndex"] = sequence;
			sequence++;
			batch.set(db.collection(path).doc(d.ID), d);
		})
		return batch.commit().then(() =>{
			if (notiDone){
				cdsNotify.toast(notiDone);
			}
			console.log("Setting " + docID + " at " + path + " was succcessful.");
		}).catch(err=>{
			console.log(err.message);
		})
	}
};
//------------------------ READ ------------------------//
function getDoc(path, docID){
	return db.collection(path).doc(docID);
}
function getCol(path){
	return db.collection(path);
}
//----------------------- UPDATE -----------------------//
function updateDoc(path, doc, docID, notiStart, notiDone){
	if (notiStart){
		cdsNotify.toast(notiStart);
	}
	let currentTime = new Date().getTime();
	if (doc.constructor === {}.constructor){
		doc["Date Updated"] = currentTime;
		docID = docID || doc.ID;
		return db.collection(path).doc(docID).update(doc).then(() =>{
			if (notiDone){
				cdsNotify.toast(notiDone);
			}
			console.log("Updating " + docID + " at " + path + " succcessful.");
		}).catch(err=>{
			console.log(err.message);
		})
	}
	else if (doc.constructor === [].constructor){
		let batch = db.batch();
		doc.forEach(d=>{
			d.ID = d.ID || db.collection(path).doc().id;
			d["Date Updated"] = currentTime;
			batch.update(db.collection(path).doc(d.ID), d);
		})
		return batch.commit().then(() =>{
			if (notiDone){
				cdsNotify.toast(notiDone);
			}
			console.log("Updating " + docID + " at " + path + " was succcessful.");
		}).catch(err=>{
			console.log(err.message);
		})
	}

};
//----------------------- DELETE -----------------------//
function deleteDoc(path, docID, notiStart, notiDone){
	if (notiStart != undefined){
		cdsNotify.toast(notiStart);
	}
	if (docID.constructor === [].constructor){
		let batch = db.batch();
		if (path.constructor === [].constructor){

		}
		docID.forEach(d=>{
			batch.delete(db.collection(path).doc(d));
		})
		return batch.commit().then(() =>{
			if (notiDone){
				cdsNotify.toast(notiDone);
			}
			console.log("Deletion succcessful.");
		}).catch(err=>{
			console.log(err.message);
		})
	}
	else if (typeof(docID) === "string"){
		return db.collection(path).doc(docID).delete().then(() =>{
			if (notiDone != undefined){
				cdsNotify.toast(notiDone);
			}
			console.log("Deleting " + docID + " at " + path + " succcessful.");
		}).catch(err=>{
			console.log(err.message);
		})
	}
}
//--------------------- ID HANDLING --------------------//
function genID(){
	return db.collection("cdsBruv").doc().id;
}
//======================================================//
//														//
//						 	AUTH 						//
//														//
//======================================================//
//----------------------- EMAIL ------------------------//
async function emailLogin(email, pw){
	return new Promise((resolve, reject)=>{
		auth.signInWithEmailAndPassword(email, pw).then(user => {
			console.log("logged in")
			return resolve({
				success: true,
				user: user,
				msg: ""
			});
		}).catch(e =>{
			return resolve({
				success: false,
				user: null,
				msg: e.message
			});
		})
	})
}
async function emailRegister(email, pw){
	return new Promise((resolve, reject)=>{
		auth.createUserWithEmailAndPassword(email, pw).then(user => {
			console.log("registered")
			return resolve({
				success: true,
				user: user,
				msg: ""
			});
		}).catch(e =>{
			return resolve({
				success: false,
				user: null,
				msg: e.message
			});
		})
	})
}
async function updatePassword(email, pw, newPW){
	return new Promise((resolve, reject)=>{
		auth.signInWithEmailAndPassword(email, pw).then(user=>{
			return auth.currentUser.updatePassword(newPW).then(r=> {
				console.log("Password updated")
				return resolve({
					success: true,
					msg: ""
				})
			}).catch(e =>{
				return resolve({
					success: false,
					user: null,
					msg: e.message
				})
			})
		}).catch(e =>{
			return resolve({
				success: false,
				user: null,
				msg: e.message
			})
		})
	})
}
async function updateEmail(email, pw, Email){
	return new Promise((resolve, reject)=>{
		auth.signInWithEmailAndPassword(email, pw).then(user=>{
			return auth.currentUser.updateEmail(Email).then(r=> {
				console.log("Password updated")
				return resolve({
					success: true,
					msg: ""
				})
			}).catch(e =>{
				return resolve({
					success: false,
					user: null,
					msg: e.message
				})
			})
		}).catch(e =>{
			return resolve({
				success: false,
				user: null,
				msg: e.message
			})
		})
	})
}
//------------------- SOCIAL MEDIA ---------------------//
async function socialLogin(type){
	type = type.replace(/ /g, "").toUpperCase();
	if (["GOOGLE", "FACEBOOK", "TWITTER"].includes(type)){
		let provider;
		switch(type){
			case "GOOGLE":
				//
				provider = new firebase.auth.GoogleAuthProvider();
				break;
			//
			case "FACEBOOK":
				//
				provider = new firebase.auth.FacebookAuthProvider();
				break;
			//
			case "TWITTER":
				//
				provider = new firebase.auth.TwitterAuthProvider();
				break;
			//
		}
		return new Promise((resolve, reject)=>{
			auth.signInWithRedirect(provider).then(r=>{
				return resolve({
					success: true,
				})
			}).catch(e=>{
				return resolve({
					success: false,
					msg: e.message
				})
			})
		})
	}
	else{
		return {
			success: false,
			msg: "Only google, faceboook or twitter are supported."
		}
	}
}
//----------------------- USER -------------------------//
function getUser(){
	return auth.currentUser;
}
//---------------------- LOGOUT ------------------------//
function logOut(){
	return auth.signOut()
}
//======================================================//
//														//
//						STORAGE 						//
//														//
//======================================================//
//----------------------- UPLOAD -----------------------//
async function uploadStorage(path, file){
	return new Promise((resolve, reject)=>{
		storage.ref(path).put(file).then(async r=>{
			r.ref.getDownloadURL().then(url=>{
				resolve({
					success: true,
					url: url
				})
			}).catch(e=>{
				resolve({
					success: false,
					msg: e.message
				})
			})
		}).catch(e=>{
			resolve({
				success: false,
				msg: e.message
			})
		})
	})
}
//----------------------- DELEETE -----------------------//
async function deleteStorage(path){
	return storage.ref(path).delete();
}


//======================================================//
//														//
//						 EXPORT 						//
//														//
//======================================================//
export default{
	// DATABASE
	db,
	setDoc,
	updateDoc,
	deleteDoc,
	getDoc,
	getCol,
	genID,
	fieldVal,

	// AUTH
	auth,
	getUser: getUser,
	emailLogin,
	emailRegister,
	updateEmail,
	updatePassword,
	socialLogin,
	logOut,

	// STORAGE
	storage,
	uploadStorage,
	deleteStorage,

	// FUNCTION
	functions
}

