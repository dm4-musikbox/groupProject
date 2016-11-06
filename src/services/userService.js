function userService() {
	this.setCurrentUserAndChannel = ( userId, userName, channelId ) => {
		currentUserId = userId;
		currentUserName = userName;
		currentChannel = channelId;
	};
}

export default userService;
