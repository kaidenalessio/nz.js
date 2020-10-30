(() => { for (const i of ['xxl', 'xl', 'l', 'm', 'sm', 's']) { Font[i].family = 'Montserrat, sans-serif'; } })();
Font.mb = Font.generate(Font.m.size, Font.bold, Font.m.family);

class Sub extends NZObject3D {
	constructor() {
		super(Mesh.makeSub());
		this.transform.position.z = 30;
		this.c = C.random();
		this.mesh.onAllTris((tri) => {
			if (tri.baseColor === 'rgb(255, 255, 255)') {
				tri.baseColor = this.c;
			}
		});
	}
	update() {
		this.transform.rotation.y += 1;
	}
	static render() {
		const mp = Mat4.makeProjection(Stage.h / Stage.w);
		const ts = [];
		for (const i of OBJ.take('Sub')) {
			i.processTrisToRaster(mp, ts);
		}
		ts.sort((a, b) => a.depth - b.depth);
		for (let i = ts.length - 1; i >= 0; --i) {
			Draw.setColor(ts[i].bakedColor);
			Draw.pointTriangle(ts[i].p[0], ts[i].p[1], ts[i].p[2]);
			Draw.stroke();
		}
	}
}

class Player extends NZObject {
	constructor(position, name) {
		super();
		this.yto = 0;
		this.move = 0;
		this.moves = [1, 2, 3, 4, 5];
		this.position = 0;
		this.setPosition(position);
		this.sub = OBJ.create('Sub');
		this.lives = 2;
		this.name = name || '';
	}
	hit() {
		this.lives--;
		if (this.lives <= 0) {
			OBJ.remove(this.sub.id);
			OBJ.remove(this.id);
			return true;
		}
		return false;
	}
	setPosition(value) {
		this.position = value;
		this.yto = 130 + this.position * 70;
	}
	getMove(i) {
		if (i === undefined) i = Mathz.irange(this.moves.length);
		return this.moves.splice(i, 1)[0];
	}
	update() {
		this.x = Stage.mid.w;
		this.y = Mathz.range(this.y, this.yto, 0.05);
		this.sub.transform.position.y = (Stage.mid.h - this.y) / Stage.mid.h * 30;
	}
	render() {
		Draw.setFont(Font.mb);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.l, Align.b);
		Draw.text(this.x + 50, this.y - 4, this.name);
		Utils.repeat(2, (i) => {
			const w = 14 + 2 * (i === 0);
			const gap = 20;
			Draw.setColor(i > 0? C.red : C.black);
			Utils.repeat(this.lives, (j) => {
				Draw.heart(this.x + 58 + j * gap, this.y + 8, w, w);
			});
		});
		if (this.move > 0) {
			Draw.textBG(this.x - 50, this.y - 4, `${this.move}`, { origin: new Vec2(1, 0.5), bgColor: MoveCard.colors[this.move - 1], textColor: C.black });
		}
		// Draw.text(this.x, this.y, this.id + ':' + this.moves.join() + '(' + this.move + ')' + ' lives: ' + this.lives);
	}
}

class MoveCard extends NZObject {
	static w = 48;
	static h = 72;
	static gap = 8;
	static colors = [C.lavender, C.lightSkyBlue, C.royalBlue, C.slateBlue, C.purple];
	constructor(i) {
		super();
		this.i = i;
		this.y = Stage.h;
		this.bound = BoundRect.create();
		this.c = MoveCard.colors[this.i];
		this.darkC = C.multiply(this.c, 0.5);
		this.isActive = true;
		this.yOutAcc = 0;
	}
	update() {
		this.x = Stage.mid.w + (MoveCard.w + MoveCard.gap) * (this.i - 2);
		// alignment: center top (from this.x, this.y)
		this.bound.set(this.x - MoveCard.w * 0.5, this.y - MoveCard.h, MoveCard.w, MoveCard.h);
		if (BoundRect.hover(this.bound)) {
			const p = Manager.player;
			const playerHasMove = Manager.moveIncludes(p.id);
			if (Input.mouseDown(0)) {
				if (this.isActive) {
					if (!playerHasMove) {
						this.yOutAcc = -8;
						this.isActive = false;
						Manager.addMove(p.id, p.getMove(p.moves.indexOf(this.i + 1)));
						// com play when the player play
						for (const com of Manager.players) {
							if (com.id !== p.id) {
								Manager.addMove(com.id, com.getMove());
							}
						}
					}
				}
			}
			UI.setCursor(
				this.isActive
				? playerHasMove
					? Cursor.notAllowed
					: Cursor.pointer
				: Cursor.default
			);
			UI.applyCursor(Stage.canvas);
		}
		if (!this.isActive) {
			if (this.y < Stage.h * 2) {
				this.y += this.yOutAcc;
				this.yOutAcc += 1;
			}
		}
	}
	render() {
		Draw.setColor(
			this.isActive // fill color
				? BoundRect.hover(this.bound) // if this hovered by mouse
					? C.white // white (active and hovered)
					: this.c // base color (active not hovered)
				: C.grey // darken base color (not active)
			, this.isActive? C.black : this.darkC // outline color
		);
		Draw.onTransform(this.x, this.y, 1, 1, 4 * (this.i - 2), () => {
			Draw.rect(-MoveCard.w * 0.5, 4, MoveCard.w, -MoveCard.h);
			Draw.stroke();
			Draw.setFont(Font.l);
			Draw.setColor(this.isActive? C.black : this.darkC);
			Draw.setHVAlign(Align.c, Align.m);
			Draw.text(0, -MoveCard.h * 0.5, this.i + 1);
		});
		// hover area
		// Draw.boundRect(this.bound);
	}
}

OBJ.addLink('Sub', Sub);
OBJ.addLink('Player', Player);
OBJ.addLink('MoveCard', MoveCard);

const Manager = {
	player: null,
	players: [],
	moveBuffer: [],
	gameOver: false,
	titleText: 'Cold Water',
	moveIncludes(id) {
		for (let i = this.moveBuffer.length - 1; i >= 0; --i) {
			if (this.moveBuffer[i].id === id) return true;
		}
		return false;
	},
	addMove(id, move) {
		if (!this.moveIncludes(id)) this.moveBuffer.push({ id, move });
	},
	start() {
		this.players.length = 0;
		Utils.repeat(5, (i) => this.players.push(OBJ.create('Player', i, 'COM')));
		this.player = Utils.pick(this.players);
		this.player.name = 'You';
		this.gameOver = false;
		this.titleText = 'Cold Water';
	},
	update() {
		if (this.moveBuffer.length >= this.players.length) {
			Utils.repeat(this.players.length, () => {
				const n = this.moveBuffer.shift();
				OBJ.get(n.id).move = n.move;
			});
			this.players.sort((a, b) => b.move - a.move);
			Utils.repeat(this.players.length, (i) => this.players[i].setPosition(i));
			this.moveBuffer.length = 0;
			const lastPlayer = this.players[this.players.length - 1];
			// game over check
			if (lastPlayer.id === this.player.id // if we are the last
				&& lastPlayer.moves.length > 0 // and we still have moves, means the game not end yet
				&& lastPlayer.lives === 1) { // but we have one left and we about to get hit, so,
				// we lost
				lastPlayer.lives = 0;
				this.titleText = 'You froze!';
				this.gameOver = true;
			}
			if (this.gameOver) return;
			if (lastPlayer.hit()) {
				this.players.pop();
			}
			// game over check
			if (this.player.moves.length < 1) {
				this.titleText = this.player.position < 3? `#${this.player.position+1}` : 'Game over';
				this.gameOver = true;
			}
		}
	}
};

Scene.current.start = () => {
	Manager.start();
	Utils.repeat(5, (i) => OBJ.create('MoveCard', i));
};

Scene.current.update = () => {
	Manager.update();
};

Scene.current.render = () => {
	Sub.render();
};

Scene.current.renderUI = () => {
	Draw.setFont(Font.m);
	Draw.setColor(C.black);
	Draw.setVAlign(Align.b);
	if (!Manager.gameOver) {
		Draw.setHAlign(Align.l);
		Draw.text(10, Stage.h - MoveCard.h - 10, 'Pick your move:');
	}
	else {
		Draw.setHAlign(Align.c);
		Draw.text(Stage.mid.w, Stage.h - 20, 'Press space to restart game.');
		Draw.setFont(Font.mb);
		Draw.text(Stage.mid.w, Stage.h - 20 - Font.m.size * 2, 'Thanks for playing!');
	}
	Draw.setFont(Font.xxl);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.t);
	Draw.text(Stage.mid.w, 20, Manager.titleText);
	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

NZ.start({
	w: 360,
	h: 640,
	bgColor: BGColor.sea,
	stylePreset: StylePreset.noGapCenter,
	embedGoogleFonts: 'Montserrat'
});