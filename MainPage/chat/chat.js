const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

Talk.ready.then(function () {
	auth.onAuthStateChanged((user) => {
		if (!user) {
			document.location.replace("/login.html");
		} else {
			db.collection('users').doc(auth.currentUser.uid).get().then((doc) => {
				db.collection('users').doc(urlParams.get('id')).get().then((otherDoc) => {
					let userData = doc.data();
					let otherData = otherDoc.data();

					storage.ref(userData.profilePic).getDownloadURL().then((url) => {
						storage.ref(otherData.profilePic).getDownloadURL().then((urlOther) => {
							var me = new Talk.User({
								id: auth.currentUser.uid,
								name: userData.name,
								email: userData.email,
								photoUrl: url
							});
							var other = new Talk.User({
								id: urlParams.get("id"),
								name: otherData.name,
								email: otherData.email,
								photoUrl: urlOther
							});
							window.talkSession = new Talk.Session({
								appId: "tPPos2DI",
								me: me
							});

							var conversation = talkSession.getOrCreateConversation(Talk.oneOnOneId(me, other))
							conversation.setParticipant(me);
							conversation.setParticipant(other);

							var inbox = talkSession.createChatbox(conversation);
							inbox.mount(document.getElementById("talkjs-container"));
						});
					});
				});

				let data = doc.data();
				let friends = data.friends;

				friends.forEach((friend) => {
					db.collection("users").doc(friend).get().then((docFriend) => {
						let friendData = docFriend.data();

						storage.ref(friendData.profilePic).getDownloadURL().then((url) => {
							let elements = `
							<a class="active-chat fade" href=chat.html?id=${friendData.uid}>
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
			});
		}
	});

	$('main').append(
		`<a class="action-button primary-background white fade" href='../Drawing/drawing.html${queryString}'><i class="fas fa-pen"></i></a>`
	)
});
