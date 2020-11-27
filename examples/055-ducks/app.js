class Duck {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Barrier {
	constructor() {
		this.angle = 0;
		this.isClosed = true;
		this.canClose = true;
		this.canCloseTime = 0;
		this.closeDuration = 15;
	}
	update() {
		if (this.canClose && Input.keyDown(KeyCode.Space)) {
			this.isClosed = !this.isClosed;
			if (this.isClosed) {
				Tween.tween(this, { angle: 0 }, this.closeDuration, Easing.BackEaseOut);
			}
			else {
				Tween.tween(this, { angle: 90 }, this.closeDuration, Easing.BackEaseOut);
			}
			this.canClose = false;
			this.canCloseTime = Time.fixedFrameCount + this.closeDuration;
		}
		if (!this.canClose && Time.fixedFrameCount > this.canCloseTime) {
			this.canClose = true;
		}
	}
	render() {
		Draw.onTransform(Global.BARRIER_X, Global.BARRIER_Y, 1, 1, this.angle, () => {
			Draw.rect(Global.BARRIER_H / 2, -Global.BARRIER_H / 2, -Global.BARRIER_W, Global.BARRIER_H);
		});
	}
}

const Manager = {
	STATES: {
		PAUSED: 'Paused', // -> PLAY
		INTRO:  'Intro',  // -> PLAY
		PLAY:   'Play',   // -> PAUSED
		END:    'End'     // -> INTRO
	},
	state: 'Intro',
	gameOver: false,
	barrier: null,
	changeToPaused() {
		if (this.state !== this.STATES.PLAY) {
			// cancel changing state,
			// can only pause from play
			return false;
		}
		return true;
	},
	changeToIntro() {
		return true;
	},
	changeToPlay() {
		return true;
	},
	changeToEnd() {
		this.gameOver = true;
		return true;
	},
	changeState(newState) {
		if (newState === this.STATES.PAUSED) {
			if (!this.changeToPaused()) {
				return;
			}
		}
		if (newState === this.STATES.INTRO) {
			if (!this.changeToIntro()) {
				return;
			}
		}
		if (newState === this.STATES.PLAY) {
			if (!this.changeToPlay()) {
				return;
			}
		}
		if (newState === this.STATES.END) {
			if (!this.changeToEnd()) {
				return;
			}
		}
		this.state = newState;
		this.start();
	},
	startPaused() {
	},
	startIntro() {
		OBJ.rawClearAll();
	},
	startPlay() {
		this.barrier = new Barrier();
	},
	startEnd() {
	},
	updatePaused() {
	},
	updateIntro() {
		if (Input.keyDown(KeyCode.Space)) {
			this.changeState(this.STATES.PLAY);
		}
	},
	updatePlay() {
		this.barrier.update();
	},
	updateEnd() {
	},
	renderPaused() {
	},
	renderIntro() {
	},
	renderPlay() {
		this.barrier.render();
	},
	renderEnd() {
	},
	init() {
		this.gameOver = false;
	},
	start() {
		if (this.state === this.STATES.PAUSED) this.startPaused();
		if (this.state === this.STATES.INTRO) this.startIntro();
		if (this.state === this.STATES.PLAY) this.startPlay();
		if (this.state === this.STATES.END) this.startEnd();
	},
	update() {
		if (this.state === this.STATES.PAUSED) {
			this.updatePaused();
		}
		if (this.state === this.STATES.INTRO) {
			this.updateIntro();
		}
		if (this.state === this.STATES.PLAY) {
			this.updatePlay();
		}
		if (this.state === this.STATES.END) {
			this.updateEnd();
		}
	},
	render() {
		if (this.state === this.STATES.PAUSED) {
			this.renderPaused();
		}
		if (this.state === this.STATES.INTRO) {
			this.renderIntro();
		}
		if (this.state === this.STATES.PLAY) {
			this.renderPlay();
		}
		if (this.state === this.STATES.END) {
			this.renderEnd();
		}
	}
};

NZ.start({
	init() {
		Global.BARRIER_X = Stage.w * 0.8;
		Global.BARRIER_Y = Stage.h * 0.8;
		Global.BARRIER_W = Stage.w * 0.6;
		Global.BARRIER_H = Global.BARRIER_W * 0.1;
		OBJ.rawAdd('Duck');
	},
	start() {
		Manager.start();
	},
	update() {
		Manager.update();
	},
	render() {
		Manager.render();
	}
});