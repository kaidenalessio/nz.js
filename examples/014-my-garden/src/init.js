const Manager = {
	SOIL: 0,
	WATER: 1,
	SOIL_COST: 20,
	WATER_COST: 5,
	timer: 60000,
	timerMax: 60000, // one minute
	oxygen: 0,
	oxygenSpawnTimer: 0,
	gameOver: false,
	gameOverText: 'game over',
	oxygenText: `O\u2082`,
	addOxygen(x) {
		if (!this.gameOver) {
			this.oxygen += x;
		}
	},
	doGameOver(text) {
		if (!this.gameOver) {
			this.gameOver = true;
			this.gameOverText = text;
		}
	},
	update() {
		if (this.gameOver) return;
		this.timer -= Time.deltaTime;
		// game over check
		if (this.timer <= 0) {
			this.doGameOver('OUT OF TIME');
			this.timer = 0;
		}
	},
	reset() {
		this.timer = this.timerMax;
		this.oxygen = 0;
		this.gameOver = false;
	}
};