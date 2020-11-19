// Uses NZ.Time, NZ.Draw
NZ.ParticleSystem = {
	createEmitter() {
		return {
			list: [],
			get count() {
				return this.list.length;
			},
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
						vx: 0,
						vy: 0,
						grav: 0,
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
				let p;
				for (let i = this.list.length - 1; i >= 0; --i) {
					p = this.list[i];
					p.life -= p.lifeStep * NZ.Time.scaledDeltaTime;
					if (p.life <= 0) {
						this.list.splice(i, 1);
						continue;
					}
					p.vx = Math.cos(p.direction) * p.speed;
					p.vy = Math.sin(p.direction) * p.speed;
					p.grav += this.grav;
					p.x += p.vx;
					p.y += p.vy + p.grav;
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
			constraint() {
				let p;
				for (let i = this.list.length - 1; i >= 0; --i) {
					p = this.list[i];
					if (p.x > NZ.Stage.w) {
						p.x = NZ.Stage.w;
						p.vx = -p.vx;
					}
					else if (p.x < 0) {
						p.x = 0;
						p.vx = -p.vx;
					}
					else if (p.y > NZ.Stage.h) {
						p.y = NZ.Stage.h;
						p.vy = -p.vy;
						p.grav = 0;
					}
					else if (p.y < 0) {
						p.y = 0;
						p.vy = -p.vy;
						p.grav = 0;
					}
					p.direction = Math.atan2(p.vy, p.vx);
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
		Emitter.setLife(5000);
		Emitter.setGrav(0.1);
		Emitter.setSpeed(5, 10);
		Emitter.setDirectionDeg(0, 360);
		Emitter.setSize(5, 10);
		Emitter.setColor(C.mediumSlateBlue, C.royalBlue, C.rebeccaPurple);
	},
	render() {
		Emitter.setArea(Input.mouseX - 32, Input.mouseY - 32, 64, 64);
		Emitter.emit(1);
		Emitter.render();
		Emitter.update();
		Emitter.constraint();
		Draw.textBGi(0, 0, Time.FPS);
		Draw.textBGi(0, 1, Emitter.count);
	},
	bgColor: [C.lavenderBlush, C.pink]
});