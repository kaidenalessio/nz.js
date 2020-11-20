// Uses NZ.Time, NZ.Draw, NZ.Stage
NZ.ParticleSystem = {
	createEmitter() {
		return {
			canvas: document.createElement('canvas'),
			list: [],
			get count() {
				return this.list.length;
			},
			life: { // uses milliseconds
				min: 2000,
				max: 3000
			},
			area: {
				x: 0,
				y: 0,
				w: NZ.Stage.w,
				h: 0
			},
			grav: 0.5,
			speed: {
				min: 15,
				max: 18
			},
			speedInc: { // speed increment
				min: -0.5,
				max: 0.5
			},
			direction: { // uses radians
				min: 0,
				max: Math.PI
			},
			directionInc: { // direction increment (in radians as well)
				min: -0.1,
				max: 0.1
			},
			bounce: 0.9, // 0=no bounce, 1=full bounce
			friction: 0.99, // 0=no velocity, 1=no friction
			size: {
				min: 10,
				max: 25
			},
			sizeEnd: {
				min: 0.1, // size scalar at the end of life (begin from 1)
				max: 0.2
			},
			color: ['skyblue', 'royalblue', 'gold'], // will be choosed randomly
			// 0-1 start of fade out (0.5=fade out at half of life, 0=no fade out)
			fadeOut: {
				min: 0.2,
				max: 0.4
			},
			random(min, max) {
				return min + Math.random() * (max - min);
			},
			emit(n, p) {
				while (n-- > 0) {
					p = {
						life: this.random(this.life.min, this.life.max),
						x: this.random(this.area.x, this.area.x + this.area.w),
						y: this.random(this.area.y, this.area.y + this.area.h),
						speed: this.random(this.speed.min, this.speed.max),
						speedInc: this.random(this.speedInc.min, this.speedInc.max),
						direction: this.random(this.direction.min, this.direction.max),
						directionInc: this.random(this.directionInc.min, this.directionInc.max),
						size: this.random(this.size.min, this.size.max),
						sizeEnd: this.random(this.sizeEnd.min, this.sizeEnd.max),
						color: this.color[Math.floor(Math.random() * this.color.length)],
						fadeOut: this.random(this.fadeOut.min, this.fadeOut.max)
					};
					p.lifeStep = NZ.Time.fixedDeltaTime / p.life;
					p.life = 1;
					p.vx = Math.cos(p.direction) * p.speed;
					p.vy = Math.sin(p.direction) * p.speed;
					this.list.push(p);
				}
			},
			update() {
				for (let i = this.list.length - 1; i >= 0; --i) {
					const p = this.list[i];
					p.life -= p.lifeStep * NZ.Time.scaledDeltaTime;
					if (p.life <= 0) {
						this.list.splice(i, 1);
						continue;
					}
					p.speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
					p.direction = Math.atan2(p.vy, p.vx);
					p.speed += p.speedInc;
					p.direction += p.directionInc;
					p.vx = Math.cos(p.direction) * p.speed;
					p.vy = Math.sin(p.direction) * p.speed;
					p.vy += this.grav;
					p.vx *= this.friction;
					p.vy *= this.friction;
					p.x += p.vx;
					p.y += p.vy;
				}
			},
			render() {
				for (let i = 0; i < this.list.length; i++) {
					const p = this.list[i];
					NZ.Draw.setFill(p.color);
					NZ.Draw.ctx.globalAlpha = p.fadeOut === 0? 1 : Math.min(1, p.life / p.fadeOut);
					NZ.Draw.circle(p.x, p.y, p.size * 0.5 * (1 - (1 - p.sizeEnd) * (1 - p.life)));
					NZ.Draw.ctx.globalAlpha = 1;
				}
			},
			constraint() {
				for (let i = 0; i < this.list.length; i++) {
					const p = this.list[i];
					if (p.x > NZ.Stage.w) {
						p.x = NZ.Stage.w;
						p.vx = -p.vx * this.bounce;
					}
					else if (p.x < 0) {
						p.x = 0;
						p.vx = -p.vx * this.bounce;
					}
					else if (p.y > NZ.Stage.h) {
						p.y = NZ.Stage.h;
						p.vy = -p.vy * this.bounce;
					}
					else if (p.y < 0) {
						p.y = 0;
						p.vy = -p.vy * this.bounce;
					}
				}
			},
			dynamicCollision() {
				let a, b, dx, dy, dist, diff, percent, intersects = [];
				for (let i = 0; i < this.list.length; i++) {
					a = this.list[i];
					for (let j = 0; j < this.list.length; j++) {
						if (j === i) continue;
						b = this.list[j];
						dx = b.x - a.x;
						dy = b.y - a.y;
						dist = Math.sqrt(dx*dx + dy*dy);
						size = (a.size + b.size) * 0.5;
						if (dist < size) {
							intersects.push([a, b]);
							diff = size - dist;
							percent = diff / dist * 0.5;
							offsetX = dx * percent;
							offsetY = dy * percent;
							a.x -= offsetX;
							a.y -= offsetY;
							b.x += offsetX;
							b.y += offsetY;
						}
					}
				}
				for (const pair of intersects) {
					a = pair[0];
					b = pair[1];
					dx = b.x - a.x;
					dy = b.y - a.y;
					dist = Math.sqrt(dx*dx + dy*dy);
					let nx = dx / dist,
						ny = dy / dist,
						tx = -ny,
						ty = nx,
						dpta = a.vx * tx + a.vy * ty,
						dptb = b.vx * tx + b.vy * ty,
						ua = a.vx * nx + a.vy * ny,
						ub = b.vx * nx + b.vy * ny,
						ma = a.size * 10,
						mb = b.size * 10,
						mm = ma + mb,
						va = ((ma - mb) * ua + 2*mb * ub) / mm,
						vb = ((mb - ma) * ub + 2*ma * ua) / mm;

					a.vx = tx * dpta + nx * va;
					a.vy = ty * dpta + ny * va;
					b.vx = tx * dptb + nx * vb;
					b.vy = ty * dptb + ny * vb;
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
			setSpeedInc(min, max) {
				this.speedInc.min = min;
				this.speedInc.max = max || min;
			},
			setDirection(min, max) {
				this.direction.min = min;
				this.direction.max = max || min;
			},
			setDirectionInc(min, max) {
				this.directionInc.min = min;
				this.directionInc.max = max || min;
			},
			setDirectionDeg(min, max) {
				if (max === undefined) max = min;
				this.direction.min = min * Math.PI / 180;
				this.direction.max = max * Math.PI / 180;
			},
			setDirectionIncDeg(min, max) {
				if (max === undefined) max = min;
				this.directionInc.min = min * Math.PI / 180;
				this.directionInc.max = max * Math.PI / 180;
			},
			setBounce(bounce) {
				this.bounce = bounce;
			},
			setFriction(friction) {
				this.friction = friction;
			},
			setSize(min, max) {
				this.size.min = min;
				this.size.max = max || min;
			},
			setSizeEnd(min, max) {
				this.sizeEnd.min = min;
				this.sizeEnd.max = max || min;
			},
			setColor(...colors) {
				this.color = colors;
			},
			setFadeOut(min, max) {
				this.fadeOut.min = min;
				this.fadeOut.max = max || min;
			}
		};
	},
};

let Emitter;

NZ.start({
	init() {
		Emitter = NZ.ParticleSystem.createEmitter();
	},
	render() {
		Emitter.emit(1);
		Emitter.render();
		Emitter.update();
		Emitter.dynamicCollision();
		Draw.textBGi(0, 0, Time.FPS);
		Draw.textBGi(0, 1, Emitter.count);
	},
	bgColor: C.white
});