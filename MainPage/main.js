function search() {
	let query = document.getElementById('search-box').value;
	$("#search-results-name").html("");
	db.collection("users").get().then((snap) => {
		snap.forEach((doc) => {
			let data = doc.data();
			if (data.name.includes(query)) {
				storage.ref(data.profilePic).getDownloadURL().then((url) => {
					let elements = "<div class='search-result'><div class='search-result-profilePic-container'><img class='search-result-profilePic' src=" + url + " ></div><div class='search-result-name-container'><div class='search-result-name'>" + data.name + "</div><div class='connect-button' onclick='makePeer('" + data.uid + "')'>Make Peer</div></div></div>";

					$("#search-results-name").append(elements);
				});
			}
		});
	});
}

auth.onAuthStateChanged((user) => {
	if (!user) {
		document.location.replace("/login.html");
	} else {
		db.collection("users").doc(auth.currentUser.uid).get().then((doc) => {
			let data = doc.data();
			let friends = data.friends;

			friends.forEach((friend) => {
				db.collection("users").doc(friend).get().then((docFriend) => {
					let friendData = docFriend.data();

					storage.ref(friendData.profilePic).getDownloadURL().then((url) => {
						let elements = `
						<a class="active-chat fade">
							<img class='chat-profilePic' src=${url} >
							<h3 class='chat-name'>${friendData.name}</h3>
						</a>`;
						$("#chat-list").append(elements);
					});
				});
			});

			if (data.tags.length == 0) {
				document.location.replace("profile.html");
			}

			db.collection("users").where("tags", "array-contains-any", data.tags).get().then((snap) => {
				snap.forEach((docOther) => {
					let dataOther = docOther.data();

					let commonTags = "";
					let count = 0;
					for (let i=0;i<data.tags.length;i++) {
						if (dataOther.tags.includes(data.tags[i])) {
							commonTags += `${data.tags[i]}, `;
							count++;
							if (count == 5) {
								break;
							}
						}
					}
					commonTags = commonTags.substring(0, commonTags.length - 2)

					storage.ref(dataOther.profilePic).getDownloadURL().then((url) => {
						let elements = `
						<div class='search-result'>
							<img class='search-result-profilePic' src="${url}" >
							<div class='search-result-data>
								<div class='search-result-name'>${dataOther.name}</div>
								<hr>
								<p>
									${commonTags}
								</p>
								<button class='connect-button' onclick='makePeer('${dataOther.uid}')'>Make Peer</button>
							</div>
							</div>
						</div>`;
						$("#similar-tags").append(elements);
					});
				});
			});
		});
	}
});
