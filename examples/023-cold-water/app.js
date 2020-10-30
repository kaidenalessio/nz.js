(() => { for (const i of ['xxl', 'xl', 'l', 'm', 'sm', 's']) { Font[i].family = 'Montserrat, sans-serif'; } })();
Font.mb = Font.generate(Font.m.size, Font.bold, Font.m.family);

Loader.loadSound('Pop', 'pop.mp3');
Loader.loadSound('BGS', 'snorkel.mp3');
Loader.loadSound('Freezing', 'freezing.mp3');

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
		this.wave = {
			amp: 1,
			freq: 0.01,
			baseAmp: 1,
			baseFreq: 0.01,
			update() {
				this.amp = Mathz.range(this.amp, this.baseAmp, 0.05);
				this.freq = Mathz.range(this.freq, this.baseFreq, 0.05);
			}
		};
	}
	start() {
		this.transform.rotation.y = 140 + (2 - this.id) * 2;
	}
	update() {
		this.transform.position.y += Math.cos(Time.time * 0.005 + this.id * 0.1) * 0.1;
		this.transform.rotation.y -= Math.cos(Time.time * 0.0005) * 0.2;
		this.transform.rotation.x = Math.cos(Time.time * this.wave.freq + this.id * this.id) * this.wave.amp;
		this.transform.rotation.z = Math.sin(Time.time * this.wave.freq + this.id * this.id) * this.wave.amp;
		this.wave.update();
	}
}

class Ice extends NZObject3D {
	constructor(pos, rot) {
		super(Mesh.makeIce(), pos, rot);
		this.mesh.onAllTris((tri) => {
			tri.baseColor = C.skyBlue;
			tri.ref = 0.2; // alpha value
		});
	}
}

class Player extends NZObject {
	constructor(position, name) {
		super();
		this.move = 0;
		this.moves = [1, 2, 3, 4, 5];
		this.vel = Vec2.zero;
		this.acc = Vec2.zero;
		this.target = Vec2.zero;
		this.position = 0;
		this.setPosition(position);
		this.sub = OBJ.create('Sub');
		this.maxlives = 2;
		this.lives = this.maxlives;
		this.name = name || '';
		this.alive = true;
	}
	hit() {
		if (this.alive) {
			this.lives--;
			this.sub.wave.amp = 10;
			this.sub.wave.baseAmp = 10 * (1 - (this.lives / this.maxlives));
			if (this.lives <= 0) {
				this.sub.wave.baseAmp = 0;
				Sound.play('Freezing');
				OBJ.create('Ice', this.sub.transform.position, this.sub.transform.rotation);
				this.alive = false;
				return true;
			}
		}
		return false;
	}
	setPosition(value) {
		this.position = value;
		this.target.y = 130 + this.position * 70;
	}
	getMove(i) {
		if (i === undefined) i = Mathz.irange(this.moves.length);
		return this.moves.splice(i, 1)[0];
	}
	start() {
		this.target.x = Stage.mid.w;
	}
	updatePhys() {
		this.vel.add(this.acc);
		this.vel.mult(0.8);
		this.vel.limit(10);
		this.acc.mult(0.1);
		this.acc.add(Vec2.sub(this.target, this).mult(0.1));
		this.x += this.vel.x;
		this.y += this.vel.y;
	}
	update() {
		this.updatePhys();
		const ydif = (Stage.mid.h - this.y) / Stage.mid.h;
		this.sub.transform.position.z = 30 + -2 * ydif;
		this.sub.transform.position.y = 30 * ydif;
	}
	render() {
		Draw.onTransform(0, Math.cos(Time.time * 0.01 + this.position) * 2, 1, 1, 0, () => {
			Draw.setFont(this === Manager.player? Font.mb : Font.m);
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
				Draw.onTransform(this.x - 50, this.y - 4, 1, 1, -10, () => {
					Draw.textBG(0, 0, `${this.move}`, { origin: new Vec2(1, 0.5), bgColor: MoveCard.colors[this.move - 1], textColor: C.black });
				});
			}
		});
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
			if (Input.touchDown(0) || Input.mouseDown(0)) {
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
						Sound.play('Pop');
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

class Particle extends NZObject {
	constructor(x, y) {
		super();
		this.x = x;
		this.y = y;
		this.xvel = Mathz.range(-1, 1);
		this.yvel = Mathz.range(-5, -1);
		this.a = 1;
		this.c = C.white;
		this.r = Mathz.range(12, 24);
		this.rvel = -0.1;
		this.nzDepth = 999;
	}
	update() {
		this.x += this.xvel;
		this.y += this.yvel;
		this.r += this.rvel;
		if (this.r < 1) {
			OBJ.remove(this.id);
		}
	}
	render() {
		Draw.setAlpha(this.a);
		Draw.setColor(this.c);
		Draw.circle(this.x, this.y, this.r);
		Draw.resetAlpha();
	}
}

OBJ.mark('3d');
OBJ.addLink('Sub', Sub);
OBJ.addLink('Ice', Ice);
OBJ.endMark();
OBJ.addLink('Player', Player);
OBJ.addLink('MoveCard', MoveCard);
OBJ.addLink('Particle', Particle);

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
	moveCheck() {
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
			if (lastPlayer.hit()) {
				if (lastPlayer.id === this.player.id) {
					this.titleText = 'You froze!';
					this.gameOver = true;
					OBJ.clear('MoveCard');
				}
				this.players.pop();
			}
			// game over check
			if (!this.gameOver && this.player.moves.length < 1) {
				this.titleText = this.player.position < 1? 'You won!' : 'You froze!';
				this.gameOver = true;
				for (const p of this.players) {
					if (p.position > 0) {
						while (p.alive) {
							p.hit();
						}
					}
				}
			}
		}
	},
	update() {
		this.moveCheck();
		if (Time.frameCount % 5 === 0 || this.gameOver) {
			const n = OBJ.create('Particle', Mathz.range(0, Stage.w), Stage.h + 100);
			n.a = 0.1;
		}
	}
};

Scene.current.start = () => {
	Manager.start();
	Utils.repeat(5, (i) => OBJ.create('MoveCard', i));
	if (!Sound.isPlaying('BGS')) {
		Sound.loop('BGS');
	}
	Sound.play('Pop');
};

Scene.current.update = () => {
	Manager.update();
};

Scene.current.render = () => {
	const mp = Mat4.makeProjection(Stage.h / Stage.w);
	const ts = [];
	for (const i of OBJ.takeMark('3d')) {
		i.processTrisToRaster(mp, ts);
	}
	ts.sort((a, b) => a.depth - b.depth);
	for (let i = ts.length - 1; i >= 0; --i) {
		if (typeof ts[i].ref === 'number') Draw.setAlpha(ts[i].ref);
		Draw.setColor(ts[i].bakedColor);
		Draw.pointTriangle(ts[i].p[0], ts[i].p[1], ts[i].p[2]);
		if (Draw.ctx.globalAlpha >= 1) {
			Draw.stroke();
		}
		Draw.resetAlpha();
	}
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
		if (Input.touchDown(0)) Scene.restart();
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
	embedGoogleFonts: 'Montserrat',
	favicon: 'favicon.png'
});