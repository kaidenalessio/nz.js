class Sub extends NZObject3D {
	constructor() {
		super(Mesh.makeSub());
		this.transform.position.z = 24;
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
		this.lives = 3;
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
		this.yto = 165 + this.position * 100;
	}
	getMove(i) {
		i = i || Mathz.irange(this.moves.length);
		return this.moves.splice(i, 1)[0];
	}
	update() {
		this.x = Stage.mid.w;
		this.y = Mathz.range(this.y, this.yto, 0.05);
		this.sub.transform.position.y = (Stage.mid.h - this.y) / Stage.mid.h * 25;
	}
	render() {
		Draw.setFont(Font.l);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.l, Align.m);
		Draw.text(this.x + 40, this.y - 4, `${this.name}`);
		// Draw.text(this.x, this.y, this.id + ':' + this.moves.join() + '(' + this.move + ')' + ' lives: ' + this.lives);
	}
}

class MoveCard extends NZObject {
	static w = 48;
	static h = 72;
	static gap = 8;
	constructor(i) {
		super();
		this.i = i;
		this.y = Stage.h;
		this.bound = BoundRect.create();
		this.c = [C.lavender, C.lightSkyBlue, C.royalBlue, C.slateBlue, C.purple][this.i];
		this.darkC = C.multiply(this.c, 0.5);
		this.isActive = true;
		this.yOutAcc = 0;
	}
	update() {
		this.x = Stage.mid.w + (MoveCard.w + MoveCard.gap) * (this.i - 2);
		// alignment: center top (from this.x, this.y)
		this.bound.set(this.x - MoveCard.w * 0.5, this.y - MoveCard.h, MoveCard.w, MoveCard.h);
		if (BoundRect.hover(this.bound)) {
			if (Input.mouseDown(0)) {
				if (this.isActive) {
					this.isActive = false;
					this.yOutAcc = -8;
				}
			}
			UI.setCursor(this.isActive? Cursor.pointer : Cursor.default);
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
	addMove(id, move) {
		for (let i = this.moveBuffer.length - 1; i >= 0; --i) {
			if (this.moveBuffer[i].id === id) {
				// you already pick a move
				return false;
			}
		}
		// add move
		this.moveBuffer.push({ id, move });
		return true;
	},
	start() {
		this.players.length = 0;
		Utils.repeat(4, (i) => this.players.push(OBJ.create('Player', i, 'COM')));
		this.player = Utils.pick(this.players);
		this.player.name = 'You';
	},
	update() {
		if (this.moveBuffer.length >= this.players.length) {
			for (const p of this.players) {
				p.move = this.moveBuffer.shift().move;
			}
			this.players.sort((a, b) => b.move - a.move);
			Utils.repeat(this.players.length, (i) => this.players[i].setPosition(i));
			if (this.players[this.players.length - 1].hit()) {
				this.players.pop();
			}
			this.moveBuffer.length = 0;
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
	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

NZ.start({
	w: 360,
	h: 640,
	bgColor: BGColor.sea,
	stylePreset: StylePreset.noGapCenter,
	embedGoogleFonts: 'Grandstander'
});