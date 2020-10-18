function search() {
	let query = document.getElementById('search-box').value;
	$("#search-results-name").html("");
	if (query.trim().length >= 1) {
		db.collection("users").get().then((snap) => {
			snap.forEach((doc) => {
				let data = doc.data();
				if (data.uid !== auth.currentUser.uid) {
					if (data.name && data.name.trim().toLowerCase().includes(query.trim().toLowerCase())) {
						storage.ref(data.profilePic).getDownloadURL().then((url) => {
							let elements = `
							<div class='search-result secondary-background fade'>
								<img class='search-result-profilePic' src="${url}" >
								<div class='search-result-data white'>
									<h3 class='search-result-name'>${data.name}</h3>
									<button class='connect-button' onclick='makePeer('${data.uid}')'>Make Peer</button>
								</div>
							</div>`;

							$("#search-results-name").append(elements);
						});
					}
				}
			});
		});
	}
}

function makePeer(uid) {
	$("#" + uid).remove();
	db.collection("users").doc(auth.currentUser.uid).update({
		friends: firebase.firestore.FieldValue.arrayUnion(uid)
	});
}

auth.onAuthStateChanged((user) => {
	if (!user) {
		document.location.replace("/login.html");
	} else {
		db.collection("users").doc(auth.currentUser.uid).onSnapshot((doc) => {
			let data = doc.data();
			let friends = data.friends;

			friends.forEach((friend) => {
				db.collection("users").doc(friend).get().then((docFriend) => {
					let friendData = docFriend.data();

					storage.ref(friendData.profilePic).getDownloadURL().then((url) => {
						let elements = `
						<a class="active-chat fade" href=chat/chat.html?id=${friendData.uid}>
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

					if (dataOther.uid !== auth.currentUser.uid && !(data.friends.join(',').includes(dataOther.uid))) {
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
							<div class='search-result primary-background fade' id="${dataOther.uid}">
								<img class='search-result-profilePic' src="${url}" >
								<div class='search-result-data white'>
									<h3 class='search-result-name'>${dataOther.name}</h3>
									<p>
										Similar Tags: ${commonTags}
									</p>
									<button class='connect-button' onclick='makePeer("${dataOther.uid}")'>Make Peer</button>
								</div>
							</div>`;
							$("#similar-tags").append(elements);
						});
					}
				});
			});
		});
	}
});
