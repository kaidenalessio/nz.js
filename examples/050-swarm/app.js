NZ.start({
	init() {
		Global.target = null;
		Global.velocity = 10;
		Global.particles = [];
		Global.numParticle = 10;
		Global.bestParticle = null;
		Global.learningRate = 0.5;
		Global.cost = (p) => {
			if (!p) return Number.POSITIVE_INFINITY;
			let dx =  Global.target.x - p.x,
				dy =  Global.target.y - p.y,
				distanceSquared = dx*dx + dy*dy;
			return distanceSquared;
		};
	},
	start() {
		Global.target = {
			x: Stage.randomX,
			y: Stage.randomY
		};
		Global.particles.length = 0;
		for (let i = 0; i < Global.numParticle; i++) {
			const p = {
				x: Stage.randomX,
				y: Stage.randomY,
				vx: Mathz.range(-Global.velocity, Global.velocity),
				vy: Mathz.range(-Global.velocity, Global.velocity),
				best: {}
			};

			p.best.x = p.x;
			p.best.y = p.y;

			if (Global.cost(p) < Global.cost(Global.bestParticle)) {
				Global.bestParticle = p;
			}

			Global.particles[i] = p;
		}
	},
	update() {
		for (let i = 0; i < Global.numParticle; i++) {
			const p = Global.particles[i],
			xm = 0.93,
			pm = 0.01,
			gm = 0.02,
			lr = 1;

			if (p.dead) continue;

			p.vx = xm * p.vx + pm * (p.best.x - p.x) + gm * (Global.bestParticle.x - p.x);
			p.vy = xm * p.vy + pm * (p.best.y - p.y) + gm * (Global.bestParticle.y - p.y);

			let length = Math.sqrt(p.vx*p.vx + p.vy*p.vy);

			if (length > Global.velocity) {
				p.vx = p.vx / length * Global.velocity;
				p.vy = p.vy / length * Global.velocity;
			}

			p.x += p.vx * lr;
			p.y += p.vy * lr;

			if (Global.cost(p) < 100) {
				p.dead = false;
				continue;
			}

			if (Global.cost(p) < Global.cost(p.best)) {
				p.best.x = p.x;
				p.best.y = p.y;

				if (Global.cost(p) < Global.cost(Global.bestParticle)) {
					Global.bestParticle = p;
				}
			}
		}
	},
	render() {
		Draw.setFill(C.red);
		Draw.circle(Global.target.x, Global.target.y, 12);
		Draw.setFill(C.blue);
		for (let i = 0; i < Global.numParticle; i++) {
			const p = Global.particles[i];
			Draw.circle(p.x, p.y, 5);
		}
	}
});