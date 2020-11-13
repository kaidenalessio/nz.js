class Point {
	static update(p) {
		if (p.pinned) return;
		p.vx = (p.x - p.px) * p.fric;
		p.vy = (p.y - p.py) * p.fric;
		p.px = p.x;
		p.py = p.y;
		p.x += p.vx;
		p.y += p.vy;
		p.y += p.grav;
	}
	static constraint(p) {
		if (p.pinned) return;
		p.vx = (p.x - p.px) * p.fric;
		p.vy = (p.y - p.py) * p.fric;

		if (p.x > Stage.w) {
			p.x = Stage.w;
			p.px = p.x + p.vx * p.bounce;
		}
		if (p.x < 0) {
			p.x = 0;
			p.px = p.x + p.vx * p.bounce;
		}
		if (p.y > Stage.h) {
			p.y = Stage.h;
			p.py = p.y + p.vy * p.bounce;
		}
		if (p.y < 0) {
			p.y = 0;
			p.py = p.y + p.vy * p.bounce;
		}
	}
	constructor(x, y, vx=0, vy=0) {
		this.id = Global.ID++;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.px = this.x - this.vx;
		this.py = this.y - this.vy;
		this.grav = 0.5;
		this.fric = 0.99;
		this.bounce = 0.2;
		this.pinned = false;
	}
}

class Stick {
	constructor(points, length, stiffness=1) {
		this.id = Global.ID++;
		this.p = points;
		this.c = this.id % 2 === 0? C.dimGrey : C.black;
		this.length = length || this.dist();
		this.stiffness = stiffness;
	}
	dist() {
		let dx = this.p[1].x - this.p[0].x,
			dy = this.p[1].y - this.p[0].y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	update() {
		if (this.p[0].pinned && this.p[1].pinned) return;
		let dx = this.p[1].x - this.p[0].x,
			dy = this.p[1].y - this.p[0].y,
			dist = Math.sqrt(dx*dx + dy*dy),
			offs = (this.length - dist) / dist * 0.5 * this.stiffness,
			ox = dx * offs,
			oy = dy * offs;

		if (!this.p[0].pinned) {
			this.p[0].x -= ox;
			this.p[0].y -= oy;
		}
		if (!this.p[1].pinned) {
			this.p[1].x += ox;
			this.p[1].y += oy;
		}
	}
}

class Player extends Point {
	// origin center top
	constructor(x, y) {
		super(x, y);
		this.baseGrav = 0.7;
		this.grav = this.baseGrav;
		this.fric = 0.98;
		this.w = 16;
		this.h = 32;
		this.mid = {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
		this.grapple = {
			// amount of gravity on each point at start
			startGrav: 0,
			// amount of gravity to apply when player move while grappling
			// see: `// reset grapple gravity` comment
			baseGrav: 0.5,
			range: 600,
			length: 50,
			segment: 10,
			points: [],
			sticks: [],
			// if distance between player and grapple pinned point
			// smaller than targetDistance, destroy grapple
			targetDistance: 20,
			// of if grapple time > grapple duration, destroy grapple
			time: 0,
			duration: 180, // (60 frames = 1 second)
			isGrappling: false,
			targetBlock: null,
			targetBlockOffsetX: 0,
			targetBlockOffsetY: 0,
			pinpoint: {
				x: 0,
				y: 0
			},
			head: {
				x: 0,
				y: 0,
				length: 10
			},
			isCreated() {
				return this.points.length > 0;
			},
			timeScaled() {
				return this.time / this.duration;
			}
		};
		this.acc = 0.8;
		this.limit = 10;
		this.jumpAcc = -3;
		this.canJump = false;
		this.isGrounded = false;
		this.wallOnLeft = false;
		this.wallOnRight = false;
		this.jumpHoldTime = 0;
		this.canDoubleJump = false;
		this.jumpHoldDuration = 5;
		this.isGroundedThreshold = 20;
		this.keyA = false;
		this.keyD = false;
		this.keyJump = false;
		this.keyJumpPressed = false;
		this.keyJumpReleased = false;
		this.keyGrapplePressed = false;
	}
	createGrapple(x, y) {
		let dx = x - this.x,
			dy = y - this.y,
			dist = Math.sqrt(dx*dx + dy*dy);

		// if (dist > this.grapple.range) return false; // out of range

		let len = Math.min(this.grapple.length, dist),
			segment = this.grapple.segment,
			segmentScalar = 1;

		// decrease the segment if distance is short
		if (dist < this.grapple.length * 1.5) segmentScalar *= 0.5;
		else if (dist < this.grapple.length * 3) segmentScalar *= 0.7;

		len /= segment;
		len *= segmentScalar;

		segment *= segmentScalar;

		dx /= segment;
		dy /= segment;

		this.grapple.points.length = 0;
		this.grapple.sticks.length = 0;

		for (let i = segment, n; i >= 0; i--) {
			n = OBJ.rawPush('Point', new Point(this.x + dx * i, this.y + dy * i));
			n.grav = this.grapple.startGrav;
			this.grapple.points.push(n);
		}

		let stiffness = 0.1;

		for (let i = 0; i < this.grapple.points.length - 1; i++) {
			this.grapple.sticks.push(OBJ.rawPush('Stick', new Stick([this.grapple.points[i], this.grapple.points[i+1]], len, stiffness)));
		}

		this.grapple.points[0].pinned = true;
		this.grapple.sticks.push(OBJ.rawPush('Stick', new Stick([this.grapple.points[this.grapple.points.length - 1], this]))); // connect rope

		return true;
	}
	destroyGrapple() {
		for (const p of this.grapple.points) {
			OBJ.rawRemove('Point', (x) => x.id === p.id);
		}
		for (const s of this.grapple.sticks) {
			OBJ.rawRemove('Stick', (x) => x.id === s.id);
		}
		this.grapple.points.length = 0;
		this.grapple.sticks.length = 0;
	}
	updateInput() {
		this.keyA = Input.keyHold(KeyCode.A) || Input.keyHold(KeyCode.Left);
		this.keyD = Input.keyHold(KeyCode.D) || Input.keyHold(KeyCode.Right);
		this.keyJump = Input.keyHold(KeyCode.W) || Input.keyHold(KeyCode.Up) || Input.keyHold(KeyCode.Space);
		this.keyJumpPressed = Input.keyDown(KeyCode.W) || Input.keyDown(KeyCode.Up) || Input.keyDown(KeyCode.Space);
		this.keyJumpReleased = Input.keyUp(KeyCode.W) || Input.keyUp(KeyCode.Up) || Input.keyUp(KeyCode.Space);
		this.keyGrapplePressed = Input.mouseDown(0) || Input.keyDown(KeyCode.Q);
	}
	updateGrapple() {
		if (this.grapple.isGrappling && this.grapple.isCreated()) {

			if (this.grapple.targetBlock) {
				this.grapple.points[0].x = this.grapple.targetBlock.x + this.grapple.targetBlockOffsetX;
				this.grapple.points[0].y = this.grapple.targetBlock.y + this.grapple.targetBlockOffsetY;
			}

			const dist = Utils.distance(this, this.grapple.points[0]);
			// if we are close enough to grapple pinned point or grapple time exceeds grapple duration
			// new: end grapple on ground
			if (dist < this.grapple.targetDistance || this.grapple.time++ > this.grapple.duration || (this.grapple.time > 5 && this.isGrounded)) {
				// end of grapple
				this.destroyGrapple();
				// reapply gravity
				this.grav = this.baseGrav;
				// end of graplling routine
				this.grapple.isGrappling = false;
			}
			if (this.grav != this.baseGrav) {
				// any input that start movement while grappling will apply gravity
				if (this.keyA || this.keyD || this.keyJumpPressed) {
					// reset grapple gravity
					for (let i = 0; i < this.grapple.points.length; i++) {
						this.grapple.points[i].grav = this.grapple.baseGrav;
					}
					// reset gravity
					this.grav = this.baseGrav;
				}
			}
		}

		// grapple cue
		let a = Math.atan2(Input.mouseY - this.y, Input.mouseX - this.x);
		this.grapple.head.x = this.x + Math.cos(a) *  this.grapple.head.length;
		this.grapple.head.y = this.y + Math.sin(a) *  this.grapple.head.length;

		// grapple creation
		if (this.keyGrapplePressed) {
			// canceling
			if (this.grapple.isGrappling) {
				// you can cancel grapple early by pressing the
				// same input button used to start grapple
				if (this.grapple.isCreated()) {
					// end of grapple
					this.destroyGrapple();
					// reapply gravity
					this.grav = this.baseGrav;
					// end of graplling routine
					this.grapple.isGrappling = false;
				}
			}
			// creating
			else {
				// init
				let x = Input.mouseX, // target x
					y = Input.mouseY, // target y
					dist = Utils.distanceDXY(x - this.x, y - this.y),
					afterAnimationEnd;

				// if out of range
				if (dist > this.grapple.range) {
					// clamp dist to grapple range
					dist = Math.min(dist, this.grapple.range);
					// recalculate target
					let a = Math.atan2(y - this.y, x - this.x);
					x = this.x + Math.cos(a) *  dist;
					y = this.y + Math.sin(a) *  dist;
				}

				afterAnimationEnd = () => {
					// get block on given target
					// grapple has to be attached to a block
					this.grapple.targetBlock = OBJ.rawGet('Block', (b) => b.containsPoint(x, y));
					if (this.grapple.targetBlock) {
						// yes, we have the target inside block
						// calculate offset
						this.grapple.targetBlockOffsetX = x - this.grapple.targetBlock.x;
						this.grapple.targetBlockOffsetY = y - this.grapple.targetBlock.y;
						// start of grapple creation
						if (this.createGrapple(x, y)) {
							// setup
							this.grav = this.grapple.startGrav;
							this.grapple.time = 0;
						}
						else {
							// return false means failed to create grapple
							// end of graplling routine
							this.grapple.isGrappling = false;
						}
					}
					else {
						// if target is not inside any block
						// end of graplling routine
						this.grapple.isGrappling = false;
					}
				};

				// start animation of throwing pinpoint,
				// after given duration, execute `afterAnimationEnd`
				// which will be the actual creation of grapple
				let duration = Math.max(dist * 0.02, 4);
				this.grapple.pinpoint.x = this.grapple.head.x;
				this.grapple.pinpoint.y = this.grapple.head.y;
				Tween.tween(this.grapple.pinpoint, { x, y }, duration, Easing.QuintEaseOut, 0, afterAnimationEnd);

				// start of grappling routine
				this.grapple.isGrappling = true;
			}
		}
	}
	updateMovement() {
		// accelerate
		if (this.keyA && !this.wallOnLeft) {
			this.x -= this.acc;
		}
		if (this.keyD && !this.wallOnRight) {
			this.x += this.acc;
		}
		// decelerate to limit
		if (this.isGrounded && !this.grapple.isGrappling) {
			if (this.x - this.px > this.limit) {
				this.x -= this.acc;
			}
			if (this.x - this.px < -this.limit) {
				this.x += this.acc;
			}
		}
	}
	updateRoutine() {
		if (this.keyJumpPressed) {
			// reset jump on ground
			if (this.isGrounded) {
				this.canJump = true;
				this.canDoubleJump = true;
			}
			if (this.canJump) {
				// start of jump
				this.py = this.y;
			}
		}
		if (this.keyJump && this.canJump) {
			if (this.jumpHoldTime++ < this.jumpHoldDuration) {
				this.y += this.jumpAcc;
			}
		}
		else {
			this.jumpHoldTime = 0;
		}
		if (this.keyJumpReleased) {
			this.canJump = this.canDoubleJump;
			this.canDoubleJump = false;
		}
	}
	updatePhysics() {
		Point.update(this);
		this.constraint();
	}
	update() {
		this.updateInput();
		this.updateGrapple();
		this.updateMovement();
		this.updateRoutine();
		this.updatePhysics();
	}
	constraint() {
		this.vx = (this.x - this.px) * this.fric;
		this.vy = (this.y - this.py) * this.fric;

		this.isGrounded = false;
		if (this.y + this.h + this.isGroundedThreshold > Stage.h) {
			this.isGrounded = true;
		}
		if (this.x > Stage.w - this.mid.w) {
			this.x = Stage.w - this.mid.w;
			this.px = this.x + this.vx * this.bounce;
		}
		if (this.x < this.mid.w) {
			this.x = this.mid.w;
			this.px = this.x + this.vx * this.bounce;
		}
		if (this.y > Stage.h - this.h) {
			this.y = Stage.h - this.h;
			this.py = this.y + this.vy * this.bounce;
		}
		if (this.y < 0) {
			this.y = 0;
			this.py = this.y + this.vy * this.bounce;
		}
	}
}

class Block {
	// origin left top
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.top = this.y;
		this.left = this.x;
		this.right = this.x + this.w;
		this.bottom = this.y + this.h;
	}
	intersectsPlayer(p) {
		// player origin center top
		return p.x+p.mid.w > this.left && p.x-p.mid.w < this.right && p.y+p.h > this.top && p.y < this.bottom;
	}
	containsPoint(x, y) {
		return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
	}
	calcBound() {
		this.top = this.y;
		this.left = this.x;
		this.right = this.x + this.w;
		this.bottom = this.y + this.h;
	}
	update() {
		// call this after ground check because
		// `player.isGrounded = false` is there
		this.calcBound();
		const p = OBJ.rawTake('Player')[0] || null;
		if (p) {
			p.wallOnLeft = false;
			p.wallOnRight = false;
			if (this.intersectsPlayer(p)) {
				// so player hit us huh?
				// calculate velocity
				p.vx = (p.x - p.px) * p.fric;
				p.vy = (p.y - p.py) * p.fric;
				// check if player hit us from above
				if (p.vy > 0 && (p.py + p.h - this.top) <= p.mid.h) {
					// clamp to our top
					p.y = this.top - p.h;
					// no bouncy bounce
					p.py = p.y;
					// make player grounded
					p.isGrounded = true;
				}
				// check if player hit us from the left
				else if (p.vx > 0 && (Math.abs(p.px + p.mid.w - this.left) <= p.mid.w || p.px <= this.left - p.mid.w)) {
					// clamp to our left
					p.x = this.left - p.mid.w;
					// bouncy bounce
					p.px = p.x + p.vx * p.bounce;
					// player hit wall on its right yet
					// still want to go to the right?
					if (p.keyD) {
						// make player walled
						p.wallOnRight = true;
						// no bouncy bounce :(
						p.px = p.x;
					}
				}
				// check if player hit us from the right
				else if (p.vx < 0 && (Math.abs(p.px - p.mid.w - this.right) <= p.mid.w || p.px >= this.right + p.mid.w)) {
					// clamp to our right
					p.x = this.right + p.mid.w;
					// bouncy bounce
					p.px = p.x + p.vx * p.bounce;
					// player hit wall on its left yet
					// still want to go to the left?
					if (p.keyA) {
						// make player walled
						p.wallOnLeft = true;
						// no bouncy bounce :(
						p.px = p.x;
					}
				}
				// no bottom check, one way platform
			}
		}
	}
}

NZ.start({
	init() {
		OBJ.rawAdd('Point');
		OBJ.rawAdd('Stick');
		OBJ.rawAdd('Block');
		OBJ.rawAdd('Player');
		Global.ID = 0;
		Global.iter = 10;
		Global.player = null;
		Global.blockStart = { x: 0, y: 0 };
		Stage.setPixelRatio(Stage.HIGH);
		Stage.applyPixelRatio();
	},
	start() {
		OBJ.rawClearAll();
		Global.player = OBJ.rawPush('Player', new Player(Stage.mid.w, Stage.mid.h));
		const n = OBJ.rawPush('Block', new Block(100, Stage.mid.h, 100, 64));
		const loop = () => {
			Tween.tween(n, { x: Stage.w - 100 - n.w }, 240, Easing.QuadEaseInOut)
				 .chain(n, { x: 100 }, 240, Easing.QuadEaseInOut, 0, loop);
		};
		loop();
	},
	render() {

		// block creation
		if (Input.mouseDown(2)) {
			Global.blockStart.x = Input.mouseX;
			Global.blockStart.y = Input.mouseY;
		}
		if (Input.mouseUp(2)) {
			let x = Global.blockStart.x,
				y = Global.blockStart.y,
				w = Input.mouseX - x,
				h = Input.mouseY - y;
			if (w < 0) x += w;
			if (h < 0) y += h;
			w = Math.abs(w);
			h = Math.abs(h);
			if (w > 4 || h > 4) {
				OBJ.rawPush('Block', new Block(x, y, w, h));
			}
		}

		// logic
		Global.player.update();

		// physics
		for (const p of OBJ.rawTake('Point')) {
			Point.update(p);
		}

		// constraint updates
		let iter = Global.iter;
		while (iter-- > 0) {
			for (const s of OBJ.rawTake('Stick')) { s.update(); }
			for (const p of OBJ.rawTake('Point')) { Point.constraint(p); }
			Global.player.constraint();
		}
		for (const b of OBJ.rawTake('Block')) { b.update(); }

		// draw blocks
		Draw.setColor(C.black);
		for (const b of OBJ.rawTake('Block')) {
			Draw.rect(b.left, b.top, b.w, b.h, true);
		}

		Draw.setLineCap(LineCap.round);
		Draw.setLineJoin(LineJoin.round);
		Draw.setLineWidth(2);

		let p = Global.player;

		// draw grapple pinpoint (the one that gets thrown before grapple occurs)
		Draw.setColor(C.black);
		if (p.grapple.isGrappling && !p.grapple.isCreated()) {
			Draw.pointArrow(p, p.grapple.pinpoint, 5);
		}
		// draw grapple cue
		if (!p.grapple.isGrappling) {
			Draw.pointArrow(p, p.grapple.head, 5);
			// draw grapple hand
			Draw.pointCircle(p, 2);
		}


		// draw all sticks
		for (const s of OBJ.rawTake('Stick')) {
			Draw.setStroke(s.c);
			if (s.id === p.grapple.sticks[0].id && p.grapple.isCreated()) {
				Draw.pointArrow(s.p[1], s.p[0], 5 * (1 - p.grapple.timeScaled()));
			}
			else {
				Draw.pointLine(s.p[0], s.p[1]);
			}
		}

		Draw.resetLineWidth();

		// draw player
		Draw.setColor(C.red, C.black);
		// origin center top
		Draw.rect(p.x - p.mid.w, p.y, p.w, p.h);
		Draw.stroke();

		if (Debug.mode > 0) {
			for (const p of OBJ.rawTake('Point')) {
				Draw.setColor(C.black);
				Draw.pointCircle(p, 4, true);
			}
			Draw.circle(p.x, p.y, p.grapple.range, true);
			Draw.rect(p.px - p.mid.w, p.py, p.w, p.h, true);
		}

		if (Input.mouseHold(2)) {
			let x = Global.blockStart.x,
				y = Global.blockStart.y,
				w = Input.mouseX - x,
				h = Input.mouseY - y;
			Draw.setStroke(C.black);
			Draw.rect(x, y, w, h, true);
		}

		const options = { bgColor: C.none, textColor: C.black };
		Draw.setFont(Font.sm);
		Draw.textBGi(0, 0, 'Click a block to start grappling', options);
		Draw.textBGi(0, 1, 'Move using WASD or arrow keys', options);
		Draw.textBGi(0, 2, `Press <U> to ${Debug.mode > 0? 'disable' : 'enable'} debug mode`, options);
		Draw.textBGi(0, 3, 'Click and drag right mouse button to create block', options);
		Draw.textBGi(0, 4, 'You can also use <Q> to grapple and space to jump', options);

		// Input.testRestartOnSpace();
	},
	debugModeAmount: 2,
	preventContextMenu: true
});