class Crumbs extends Particle {
	constructor(pos) {
		super(pos);
		this.acc = new Vec2(0, 0.1);
		this.vel = Vec2.polar(Mathz.range(200, 340), 3);
		this.c = Mathz.choose(C.orange, C.darkOrange, C.darkOrange);
	}
	update() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
	}	
}

OBJ.addLink('Crumbs', Crumbs);