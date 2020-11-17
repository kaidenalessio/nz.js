class WaterSpring {
	constructor(x, y, w, h, segment) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.k = 0.05;
		this.friction = 0.96;
		this.list = [];
		this.segment = segment;
		this.segmentWidth = this.w / this.segment;
		for (let i = 0; i < this.segment+1; i++) {
			this.list.push({
				x: this.x + i * this.segmentWidth,
				y: this.y,
				vy: 0,
				springPoint: {
					x: this.x + i * this.segmentWidth,
					y: this.y + this.h
				}
			});
		}
	}
	updateSpring() {
		for (let i = 0; i < this.list.length; i++) {
			let a = this.list[i],
				b = this.list[i].springPoint,
				dy = b.y - a.y,
				dist = Math.sqrt((b.x-a.x)*(b.x-a.x) + dy*dy),
				x = (dy / dist) * (dist - this.h) + Math.sin((Time.frameCount + i) * 0.05) * 10;
			a.vy += this.k * x; // hookes law: f = -kx

			let left = this.list[i-1],
				right = this.list[i+1];
			x *= this.k * 0.1;
			if (left) left.vy += x;
			if (right) right.vy += x;
		}
	}
	updateInteract() {
		let nearest = -1;
		if (Input.mouseHold(0)) {
			let max = Infinity, d;
			for (let i = 0; i < this.list.length; i++) {
				d = Math.abs(Input.mouseX - this.list[i].x);
				if (d < max) {
					max = d;
					nearest = i;
				}
			}
			if (nearest !== -1) {
				let near = this.list[nearest],
					left = this.list[nearest-1],
					right = this.list[nearest+1],
					f = this.h * 0.001;
				near.vy += f;
				if (left) left.vy += f;
				else if (right) right.vy += f;
			}
		}
	}
	updateMotion() {
		for (let i = 0; i < this.list.length; i++) {
			const a = this.list[i];
			a.vy *= this.friction;
			a.y += a.vy;
		}
	}
	update() {
		this.updateSpring();
		this.updateInteract();
		this.updateMotion();
	}
	render() {
		// Draw.rect(this.x, this.y, this.w, this.h);
		for (let i = 0; i < this.list.length; i++) {
			const a = this.list[i];
			if (i < this.list.length - 1) {
				const b = this.list[i + 1];
				Draw.primitiveBegin();
				Draw.vertex(a.x, a.y);
				Draw.vertex(a.x, a.springPoint.y);
				Draw.vertex(b.x, b.springPoint.y);
				Draw.vertex(b.x, b.y);
				Draw.setColor(C.blue, Debug.mode > 0? C.black : C.blue);
				Draw.primitiveEnd();
				Draw.stroke();
			}
		}
	}
}

NZ.start({
	init() {
		Global.waterSpring = new WaterSpring(0, Stage.mid.h, Stage.w, Stage.mid.h, 50);
		Debug.mode = 1;
	},
	render() {
		Global.waterSpring.update();
		Global.waterSpring.render();
		Draw.textBGi(0, 0, 'Left click and drag to interact with water.');
		Draw.textBGi(0, 1, `Press U to toggle debug mode (${Debug.mode > 0? 'ENABLED' : 'DISABLED'})`);
	},
	debugModeAmount: 2
});