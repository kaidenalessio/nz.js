NZ.start({
	init() {
		Global.radius = 2;
		Global.target = null;
		Global.velocity = 9;
		Global.iteration = Number.POSITIVE_INFINITY;
		Global.particles = [];
		Global.numParticle = 100;
		Global.bestParticle = null;
		Global.vMult = 0.99; // inertia weight parameter, how much previous velocity affects
		Global.pMult = 0.03; // individual-cognition parameter, how much local best position attracts*
		Global.gMult = 0.01; // social learning parameter, how much global best position attracts*
		// * and will be multiplied by a random value ranged 0-1
		Global.learningRate = 1;
		Global.targetRadius = 6;
		Global.allowDead = false;
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
				r: Global.radius * Mathz.range(1, 2),
				vx: Mathz.range(-Global.velocity, Global.velocity),
				vy: Mathz.range(-Global.velocity, Global.velocity),
				best: {}
			};

			p.best.x = p.x;
			p.best.y = p.y;

			p.deadCost = p.r*p.r + Global.targetRadius*Global.targetRadius;

			if (Global.cost(p) < Global.cost(Global.bestParticle)) {
				Global.bestParticle = p;
			}

			Global.particles[i] = p;
		}
		Global.i = 0;
	},
	update() {
		if (Input.mouseHold(0)) {
			Global.target.x += 0.5 * (Input.mouseX - Global.target.x);
			Global.target.y += 0.5 * (Input.mouseY - Global.target.y);
		}
		if (Global.i < Global.iteration) {
			for (let i = 0; i < Global.numParticle; i++) {
				if (Global.particles[i].dead) continue;

				const p = Global.particles[i];

				if (Input.keyDown(KeyCode.Space)) {
					p.vx = Mathz.range(-Global.velocity, Global.velocity);
					p.vy = Mathz.range(-Global.velocity, Global.velocity);
				}

				// Algorithm used:
				// nv = pv + pm*r*best + gm*r*gbest
				p.vx = Global.vMult * p.vx + Global.pMult * Math.random() * (p.best.x - p.x) + Global.gMult * Math.random() * (Global.bestParticle.x - p.x);
				p.vy = Global.vMult * p.vy + Global.pMult * Math.random() * (p.best.y - p.y) + Global.gMult * Math.random() * (Global.bestParticle.y - p.y);
				// nv = new velocity
				// pv = product between parameter 'inertia weight' and particle's previous velocity
				// r = random value between 0-1
				// best = difference between the particle’s own best position and its current position
				// gbest = difference between the swarm/global best position and its current position
				// pm = parameter 'individual-cognition'
				// gm = parameter 'social learning'
				//
				// Note: x and y have different random value

				const length = Math.sqrt(p.vx*p.vx + p.vy*p.vy);

				if (length > Global.velocity) {
					p.vx = (p.vx / length) * Global.velocity;
					p.vy = (p.vy / length) * Global.velocity;
				}

				p.x += p.vx * Global.learningRate;
				p.y += p.vy * Global.learningRate;

				if (Global.cost(p) < Global.cost(p.best)) {
					p.best.x = p.x;
					p.best.y = p.y;

					if (Global.cost(p) < Global.cost(Global.bestParticle)) {
						Global.bestParticle = p;
					}
				}

				if (Global.allowDead && Global.cost(p) < p.deadCost) {
					p.dead = true;
				}
			}
			Global.i++;
		}
	},
	render() {
		Draw.setColor(C.red, C.black);
		Draw.circle(Global.target.x, Global.target.y, Global.targetRadius);
		Draw.stroke();
		Draw.setFill(C.gold);
		for (let i = 0; i < Global.numParticle; i++) {
			const p = Global.particles[i];
			Draw.circle(p.x, p.y, p.r);
			Draw.stroke();
		}
		Draw.setFill(C.blue);
		Draw.circle(Global.bestParticle.x, Global.bestParticle.y, Global.bestParticle.r);
		Draw.stroke();
		Draw.textBGi(0, 0, `Press space to separate particles.`);
		Draw.textBGi(0, 1, `Press enter to restart.`);
		Draw.textBGi(0, 2, `Iteration: ${Global.i}/${Global.iteration}`);
		Draw.textBGi(0, 3, `Best Cost: ${Math.round(Math.sqrt(Global.cost(Global.bestParticle)))}`);
		Draw.textBGi(0, 4, `FPS: ${Time.FPS}`);
		if (Input.keyDown(KeyCode.Enter)) Scene.restart();
	}
});