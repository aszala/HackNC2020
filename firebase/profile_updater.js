const profileForm = document.querySelector("#profile-form");

profileForm.addEventListener('submit', (e) => {
	e.preventDefault();

	let tags = profileForm['tags'].value.split(",");
	let mediaPath = document.getElementById("profile-image-upload").files[0];
	let firstname = profileForm['first-name'].value;
	let lastname = profileForm['last-name'].value;

	db.collection("users").doc(auth.currentUser.uid).update({
		tags: tags,
		name: firstname + " " + lastname,
		firstname: firstname,
		lastname: lastname
	}).then(() => {
		if (mediaPath) {
			updateFirebaseProfile(mediaPath);
		} else {
			document.location.replace("main.html");
		}
	});
});

auth.onAuthStateChanged((user) => {
	if (user) {
		db.collection("users").doc(auth.currentUser.uid).get().then((doc) => {
			let data = doc.data();

			document.getElementById('first-name').value = data.firstname;
			document.getElementById('last-name').value = data.lastname;
			document.getElementById('tags').value = data.tags.join();

			$("#hello-name").html("Hello " + data.name + "!");

			storage.ref(data.profilePic).getDownloadURL().then((url) => {
				$("#profile-pic").attr("src", url);
			});
		});
	}
});

function updateFirebaseProfile(path) {
	let filepath = auth.currentUser.uid + '/u/profile' + path.name.substring(path.name.lastIndexOf('.')+1);
	let imageRef = storage.ref(filepath);
	let upload = imageRef.put(path);

	upload.on("state_changed", function progress(snapshot) {

	}, function error() {

	}, function complete() {
		db.collection("users").doc(auth.currentUser.uid).update({
			profilePic: filepath
		}).then(() => {
			document.location.replace("main.html");
		});
	});
}
