Loader.loadSound('splash', 'splash.mp3');
Loader.loadSound('sunnyday', 'sunnyday.mp3');

// SE=sound effect (usually play once)
const playSE = () => {
	Sound.play('splash');
};

const stopSE = () => {
	Sound.stop('splash');
};

const playAtOnceSE = () => {
	Sound.playAtOnce('splash');
};

// BGM=background music (usually loop until stop)
const loopBGM = () => {
	Sound.loop('sunnyday');
};

const stopBGM = () => {
	Sound.stop('sunnyday');
};

const pauseBGM = () => {
	Sound.pause('sunnyday');
};

const resumeBGM = () => {
	Sound.resume('sunnyday');
};