const firebaseConfig = {
	apiKey: '*',
	authDomain: '*',
	databaseURL: '*',
	projectId: '*',
	storageBucket: '*',
	messagingSenderId: '*',
	appId: '*'
};

const Manager = {
	oxygen: 0,
	oxygenSpawnTimer: 0,
	addOxygen(x) {
		this.oxygen += x;
	}
};