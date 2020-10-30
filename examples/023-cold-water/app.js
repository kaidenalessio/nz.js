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
	constructor(position) {
		super();
		this.yto = 0;
		this.move = 0;
		this.moves = [1, 2, 3, 4, 5];
		this.position = 0;
		this.setPosition(position);
		this.sub = OBJ.create('Sub');
		this.lives = 3;
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
		Draw.setHVAlign(Align.c, Align.m);
		Draw.text(this.x, this.y, this.id + ':' + this.moves.join() + '(' + this.move + ')' + ' lives: ' + this.lives);
	}
}

OBJ.addLink('Sub', Sub);
OBJ.addLink('Player', Player);

const Manager = {
	player: null,
	players: []
};

Scene.current.start = () => {
	Manager.players.length = 0;
	Utils.repeat(4, (i) => Manager.players.push(OBJ.create('Player', i)));
	Manager.player = Utils.pick(Manager.players);
};

Scene.current.update = () => {
	if (Input.mouseDown(0)) {
		for (const p of Manager.players) {
			p.move = p.getMove();
		}
		Manager.players.sort((a, b) => b.move - a.move);
		Utils.repeat(Manager.players.length, (i) => Manager.players[i].setPosition(i));
		if (Manager.players[Manager.players.length - 1].hit()) {
			Manager.players.pop();
		}
	}
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