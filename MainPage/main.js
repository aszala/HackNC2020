function search(query) {
	db.collections("users").where("name", ">=", query).get().then((snap) => {
		snap.forEach((doc) => {
			let data = doc.data();

			storage.ref(data.profilePic).getDownloadURL().then((url) => {
				let elements = "<div class='search-result'><div class='search-result-profilePic-container'><img class='search-result-profilePic' src=" + url + " ></div><div class='search-result-name-container'><div class='search-result-name'>" + data.name + "</div><div class='connect-button' onclick='makePeer('" + data.uid + "')'>Make Peer</div></div></div>";
				$("#search-results-name").append(elements);
			});
		});
	});
}

auth.onAuthStateChanged((user) => {
	if (!user) {
		document.location.replace("/login.html");
	} else {
		db.collections("users").doc(auth.currentUser.uid).get().then((doc) => {
			let data = doc.data();
			let friends = doc.friends;

			for (let i=0;i<friends.length;i++) {
				db.collections("users").doc(friends[i]).get().then((docFriend) => {
					let friendData = docFriend.data();

					storage.ref(friendData.profilePic).getDownloadURL().then((url) => {
						let elements = "<div class='active-chat'><div class='chat-profilePic-container'><img class='chat-profilePic' src=" + url + " ></div><div class='chat-name-container'><div class='chat-name'>" + friendData.name + "</div></div></div>";
						$("#chat-list").append(elements);
					});
				});
			}

			db.collections("users").where("tags", "array-contains-any", data.tags).get().then((snap) => {
				snap.forEach((doc) => {
					let data = doc.data();

					storage.ref(data.profilePic).getDownloadURL().then((url) => {
						let elements = "<div class='search-result'><div class='search-result-profilePic-container'><img class='search-result-profilePic' src=" + url + " ></div><div class='search-result-name-container'><div class='search-result-name'>" + data.name + "</div><div class='connect-button' onclick='makePeer('" + data.uid + "')'>Make Peer</div></div></div>";
						$("#similar-tags").append(elements);
					});
				});
			});
		});
	}
});
