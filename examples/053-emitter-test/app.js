// Uses NZ.Time, NZ.Draw
NZ.ParticleSystem = {
	createEmitter() {
		return {
			list: [],
			life: { // uses milliseconds (1000 = one second)
				min: 4000,
				max: 5000
			},
			area: {
				x: 200,
				y: 200,
				w: 100,
				h: 120
			},
			grav: 0.1,
			speed: {
				min: 7,
				max: 10
			},
			direction: {
				// uses radians (2 * (Math.PI=3.141592653589793) = 360 degrees)
				// counter clockwise
				// 0.00000 = 0 * Math.PI / 180 (right)
				// 1.57079 = 90 * Math.PI / 180 (down)
				// 3.14159 = 180 * Math.PI / 180 (left)
				// 4.71239 = 270 * Math.PI / 180 (up)
				// 6.28318 = 360 * Math.PI / 180 (right)
				min: 240 * Math.PI / 180,
				max: 300 * Math.PI / 180
			},
			size: {
				min: 20,
				max: 40
			},
			color: ['orange', 'orangered', 'gold'], // will be choosed randomly
			random(min, max) {
				return min + Math.random() * (max - min);
			},
			emit(n, p) {
				while (n-- > 0) {
					p = {
						life: this.random(this.life.min, this.life.max),
						x: this.random(this.area.x, this.area.x + this.area.w),
						y: this.random(this.area.y, this.area.y + this.area.h),
						grav: this.grav,
						speed: this.random(this.speed.min, this.speed.max),
						direction: this.random(this.direction.min, this.direction.max),
						size: this.random(this.size.min, this.size.max),
						color: this.color[Math.floor(Math.random() * this.color.length)]
					};
					p.lifeStep = NZ.Time.fixedDeltaTime / p.life;
					p.life = 1;
					this.list.push(p);
				}
			},
			update() {
				let p, vx, vy;
				for (let i = this.list.length - 1; i >= 0; --i) {
					p = this.list[i];
					p.life -= p.lifeStep * NZ.Time.scaledDeltaTime;
					if (p.life <= 0) {
						this.list.splice(i, 1);
						continue;
					}
					vx = Math.cos(p.direction) * p.speed;
					vy = Math.sin(p.direction) * p.speed + p.grav;
					p.grav += this.grav;
					p.x += vx;
					p.y += vy;
				}
			},
			render() {
				let p;
				for (let i = 0; i < this.list.length; i++) {
					p = this.list[i];
					NZ.Draw.setFill(p.color);
					NZ.Draw.ctx.globalAlpha = p.life;
					NZ.Draw.circle(p.x, p.y, p.size * 0.5);
					NZ.Draw.ctx.globalAlpha = 1;
				}
			},
			setLife(min, max) {
				this.life.min = min;
				this.life.max = max || min;
			},
			setArea(x, y, w=0, h=0) {
				this.area.x = x;
				this.area.y = y;
				this.area.w = w;
				this.area.h = h;
			},
			setGrav(grav) {
				this.grav = grav;
			},
			setSpeed(min, max) {
				this.speed.min = min;
				this.speed.max = max || min;
			},
			setDirection(min, max) {
				this.direction.min = min;
				this.direction.max = max || min;
			},
			setDirectionDeg(min, max) {
				if (max === undefined) max = min;
				this.direction.min = min * Math.PI / 180;
				this.direction.max = max * Math.PI / 180;
			},
			setSize(min, max) {
				this.size.min = min;
				this.size.max = max || min;
			},
			setColor(...colors) {
				this.color = colors;
			}
		};
	},
};

const ParticleSystem = NZ.ParticleSystem;
const Emitter = ParticleSystem.createEmitter();

NZ.start({
	init() {
		Global.bubbleEmitter = ParticleSystem.createEmitter();
		Global.bubbleEmitter.setGrav(0.1);
		Global.bubbleEmitter.setSpeed(5);
		Global.bubbleEmitter.setDirectionDeg(0, 360);
		Global.bubbleEmitter.setSize(5);
		Global.bubbleEmitter.setColor(C.mediumSlateBlue, C.royalBlue, C.rebeccaPurple);
	},
	render() {
		Emitter.emit(1);
		Global.bubbleEmitter.setArea(Input.mouseX, Input.mouseY);
		Global.bubbleEmitter.emit(5);
		Emitter.render();
		Emitter.update();
		Global.bubbleEmitter.render();
		Global.bubbleEmitter.update();
		Draw.textBGi(0, 0, Time.FPS);
	},
	bgColor: [C.lavenderBlush, C.pink]
});