const profileForm = document.querySelector("#profile-form");

profileForm.addEventListener('submit', (e) => {
	e.preventDefault();

	let tags = [];
	let mediaPath = document.getElementById("profile-image-upload").files[0];

	if (mediaPath) {
		updateFirebaseProfile(mediaPath);
	}

	db.collection("users").doc(auth.currentUser.uid).update({
		tags: tags
	});
});

auth.onAuthStateChanged((user) => {
	if (user) {
		db.collection("users").doc(auth.currentUser.uid).get((doc) => {
			let data = doc.data();

			storage.ref(data.profilePic).getDownloadURL().then((url) => {
				$("#profile-pic").attr("src", url);
			});

			// Update the tags
		});
	}
});

function updateFirebaseProfile(path) {
	let filepath = auth.currentUser.uid + '/u/profile' + path.name.substring(file.name.lastIndexOf('.')+1);
	let imageRef = storage.ref(filepath);
	let upload = imageRef.put(path);

	upload.on("state_changed", function progress(snapshot) {

	}, function error() {

	}, function complete() {
		db.collection("users").doc(auth.currentUser.uid).update({
			profilePic: filepath
		});
	});
}
