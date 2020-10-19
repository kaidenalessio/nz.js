Loader.loadSound('explode', 'explode.wav');
Loader.loadSound('sunnyday', 'sunnyday.mp3');

// SE=sound effect (usually play once)
const playSE = () => {
	Sound.play('explode');
};

const stopSE = () => {
	Sound.stop('explode');
};

const playAtOnceSE = () => {
	Sound.playAtOnce('explode');
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