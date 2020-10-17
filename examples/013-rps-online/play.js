/*
BUFFER STRUCTURE
0: connection (client to master)
1: master play (master to client)
2: game over text (client to master)
*/

const ID_CLIENT_CONNECT = 0;
const ID_MASTER_PLAY = 1;
const ID_MASTER_GAME_OVER_TEXT = 2; // send by client

const PLAY_ROCK = 0;
const PLAY_PAPER = 1;
const PLAY_SCISSORS = 2;

const TXT_WIN = 'WIN';
const TXT_LOSE = 'LOSE';
const TXT_DRAW = 'DRAW';

let GAME_OVER_TEXT; // 'WIN', 'LOSE', 'DRAW'

let CLIENT_MASTER_PLAY;

let STATE = {
	state: 0,
	WAITING: 0,
	MASTER_PLAY: 1,
	CLIENT_PLAY: 2,
	GAME_OVER: 3,
	changeState(state) {
		this.state = state;
	}
};

Play.start = () => {
	Net.init(firebaseConfig, ROOM_NAME);
	if (MASTER) masterStart();
	else clientStart();
};

const masterStart = () => {
	Net.sendEmptyBuffers(); // in case room already exists, just clear it
	STATE.changeState(STATE.WAITING);
};

const clientStart = () => {
	Net.send(ID_CLIENT_CONNECT, Net.DUMMY); // just send dummy to tell master we're connected
	STATE.changeState(STATE.MASTER_PLAY); // TODO: better double check here, right now we assume there is an existing master with given room name
};

const masterUpdate = () => {
	switch (STATE.state) {
		case STATE.WAITING:
			// check for client connection
			Net.read(ID_CLIENT_CONNECT, () => {
				// any data send to buffer 0 will execute this block
				STATE.changeState(STATE.MASTER_PLAY);
			});
			break;

		case STATE.MASTER_PLAY:
			let masterPlay;
			if (Input.keyDown(KeyCode.R)) masterPlay = PLAY_ROCK;
			else if (Input.keyDown(KeyCode.P)) masterPlay = PLAY_PAPER;
			else if (Input.keyDown(KeyCode.S)) masterPlay = PLAY_SCISSORS;
			if (masterPlay !== undefined) {
				Net.send(ID_MASTER_PLAY, masterPlay);
				STATE.changeState(STATE.CLIENT_PLAY);
			}
			break;

		case STATE.CLIENT_PLAY:
			Net.read(ID_MASTER_GAME_OVER_TEXT, () => {
				GAME_OVER_TEXT = Net.pop(ID_MASTER_GAME_OVER_TEXT);
				STATE.changeState(STATE.GAME_OVER);
			});
			break;
	}
};

const checkWin = (play, challenge) => {
	return ((play === PLAY_ROCK && challenge === PLAY_SCISSORS) || (play === PLAY_PAPER && challenge === PLAY_ROCK) || (play === PLAY_SCISSORS && challenge === PLAY_PAPER));
};

const clientUpdate = () => {
	switch (STATE.state) {
		case STATE.MASTER_PLAY:
			Net.read(ID_MASTER_PLAY, () => {
				const masterPlay = Net.pop(ID_MASTER_PLAY);
				CLIENT_MASTER_PLAY = masterPlay;
				STATE.changeState(STATE.CLIENT_PLAY);
			});
			break;

		case STATE.CLIENT_PLAY:
			let clientPlay;
			if (Input.keyDown(KeyCode.R)) clientPlay = PLAY_ROCK;
			else if (Input.keyDown(KeyCode.P)) clientPlay = PLAY_PAPER;
			else if (Input.keyDown(KeyCode.S)) clientPlay = PLAY_SCISSORS;
			if (clientPlay !== undefined) {
				// game over check here
				let masterGameOverText;
				if (checkWin(clientPlay, CLIENT_MASTER_PLAY)) {
					GAME_OVER_TEXT = TXT_WIN; // client win
					masterGameOverText = TXT_LOSE; // master lose
				}
				else if (checkWin(CLIENT_MASTER_PLAY, clientPlay)) {
					GAME_OVER_TEXT = TXT_LOSE; // client lose
					masterGameOverText = TXT_WIN; // master win
				}
				else {
					// draw
					masterGameOverText = GAME_OVER_TEXT = TXT_DRAW;
				}
				Net.send(ID_MASTER_GAME_OVER_TEXT, masterGameOverText);
				STATE.changeState(STATE.GAME_OVER);
			}
			break;
	}
};

const masterRender = () => {
	switch (STATE.state) {
		case STATE.WAITING:
			Draw.setFont(Font.l);
			Draw.textBackground(Stage.mid.w, Stage.mid.h, 'WAITING FOR CONNECTION...', { origin: Vec2.center });
			break;

		case STATE.MASTER_PLAY:
			Draw.setFont(Font.m);
			Draw.textBackground(Stage.mid.w, Stage.mid.h, 'Press <R>/<P>/<S> to play Rock/Paper/Scissors.', { origin: Vec2.center });
			break;

		case STATE.CLIENT_PLAY:
			Draw.setFont(Font.m);
			Draw.textBackground(Stage.mid.w, Stage.mid.h, 'WAITING FOR CLIENT PLAY...', { origin: Vec2.center });
			break;
	}
};

const clientRender = () => {
	switch (STATE.state) {
		case STATE.MASTER_PLAY:
			Draw.setFont(Font.m);
			Draw.textBackground(Stage.mid.w, Stage.mid.h, 'WAITING FOR MASTER PLAY...', { origin: Vec2.center });
			break;

		case STATE.CLIENT_PLAY:
			Draw.setFont(Font.m);
			Draw.textBackground(Stage.mid.w, Stage.mid.h, 'Press <R>/<P>/<S> to play Rock/Paper/Scissors.', { origin: Vec2.center });
			break;
	}
};

Play.update = () => {
	if (MASTER) masterUpdate();
	else clientUpdate();
};

Play.renderUI = () => {
	Draw.textBackground(0, 0, `Room name: ${ROOM_NAME}`);
	if (MASTER) masterRender();
	else clientRender();
	if (STATE.state === STATE.GAME_OVER) {
		Draw.setFont(Font.l);
		Draw.textBackground(Stage.mid.w, Stage.mid.h, GAME_OVER_TEXT, { origin: Vec2.center });
		Draw.setFont(Font.m);
		Draw.textBackground(Stage.mid.w, Stage.h, 'Reload the page to restart.', { origin: new Vec2(0.5, 1) });
	}
};