// NOTE: zmid calculation causes rendering to have depth problem
// Current situation: to minimize the effect, use high poly model
// Todo: implement depth buffer or other depth calculation algorithm
let CLOCK_MODEL = 2; // 1=low poly, 2=high poly, 3=very high poly

class Cubey extends NZObject3D {
	constructor() {
		super(Mesh.makeCubeHigh(), new Transform());
	}
	setColor(c) {
		this.mesh.onAllTris((tri) => {
			tri.baseColor = c;
		});
	}
}

class Tick extends Cubey {
	constructor(scaleX, scaleY, zOffset, color) {
		super();
		this.setColor(color);
		this.transform.scale.set(scaleX, scaleY, 0.1);
		this.transform.position.set(0, scaleY, -1 - 0.2 * zOffset);
		Mesh.applyTransform(this.mesh, this.transform);
	}
}

class Clock extends NZObject3D {
	constructor(position) {
		super(Mesh.makeCylinder(CLOCK_MODEL));
		this.dimensions = new Vec3(2, 2, 0.1); // just info
		this.transform.position = position;
		this.tickSec = OBJ.create('Tick', 0.1, 0.65, 2, C.red);
		this.tickMin = OBJ.create('Tick', 0.15, 0.6, 1, C.blue);
		this.tickHou = OBJ.create('Tick', 0.15, 0.5, 0, C.black);
		this.ticks = [this.tickSec, this.tickMin, this.tickHou];
		this.time = 0;
		this.updateTick();
	}
	updateTick() {
		// Position
		for (const t of this.ticks) {
			t.transform.position.set(this.transform.position);
			t.transform.rotation.y = this.transform.rotation.y;
		}
		// Rotation
		const t = -this.time * 0.001;
		this.tickSec.transform.rotation.z = (t % 60) * 60;
		this.tickMin.transform.rotation.z = ((t/60) % 60) * 60;
		this.tickHou.transform.rotation.z = ((t/360) % 60) * 60;
	}
	update() {
		const tmp = CLOCK_MODEL;
		if (Input.keyDown(KeyCode.Alpha1)) {
			CLOCK_MODEL = 1;
		}
		else if (Input.keyDown(KeyCode.Alpha2)) {
			CLOCK_MODEL = 2
		}
		else if (Input.keyDown(KeyCode.Alpha3)) {
			CLOCK_MODEL = 3;
		}
		if (CLOCK_MODEL !== tmp) {
			this.mesh = Mesh.makeCylinder(CLOCK_MODEL);
		}
		this.time += Time.deltaTime;
		const boost = 1 + Input.keyHold(KeyCode.Space);
		const move = Vec2.zero;
		Input.testMoving4DirWASD(move);
		move.mult(0.01);
		this.transform.position.add(move.x, 0, -move.y);
		this.transform.rotation.y += boost * (Input.keyHold(KeyCode.Left) - Input.keyHold(KeyCode.Right));
		this.transform.rotation.y += -Input.movementX * Input.mouseHoldAny();
		this.updateTick();
	}
}

OBJ.mark('3d');
OBJ.addLink('Tick', Tick);
OBJ.addLink('Clock', Clock);
OBJ.endMark();

Scene.current.start = () => {
	Debug.mode = 1;
	Stage.setPixelRatio(Stage.HIGH);
	Stage.applyPixelRatio();
	OBJ.create('Clock', new Vec3(0, 0, 2));
};

Scene.current.render = () => {
	const matProj = Mat4.makeProjection(Stage.h / Stage.w);
	const trisToRaster = [];
	for (const o of OBJ.takeMark('3d')) {
		o.processTrisToRaster(matProj, trisToRaster);
	}
	trisToRaster.sort((a, b) => a.depth < b.depth? -1 : 1);
	Draw.setLineCap(LineCap.round);
	Draw.setLineJoin(LineJoin.round);
	for (let i = trisToRaster.length - 1; i >= 0; --i) {
		const tri = trisToRaster[i];
		Draw.setColor(tri.bakedColor);
		Draw.pointTriangle(tri.p[0], tri.p[1], tri.p[2]);
		Draw.stroke();
		if (Debug.mode > 0) {
			Draw.setStroke(C.black);
			Draw.stroke();
		}
	}
};

Scene.current.renderUI = () => {
	let y = 0;
	Draw.setFont(Font.m);
	const draw = (txt) => {
		Draw.textBG(0, y, txt);
		y += Font.m.size + 10;
	};
	draw(Time.FPS);
	draw(`Clock model: ${CLOCK_MODEL}`);
	draw(`Press <U> to ${Debug.mode > 0? 'hide' : 'show'} outline.`);
	draw('Press 1, 2, 3 to change clock model.');
	draw('Click and drag mouse to rotate model and\nexamine z-mid depth calculation problem.');
	y += Font.m.size;
	draw('(look at some of the triangles drawn on the front when it should be on the back)');
};

NZ.start({
	bgColor: BGColor.lemon,
	debugModeAmount: 2
});