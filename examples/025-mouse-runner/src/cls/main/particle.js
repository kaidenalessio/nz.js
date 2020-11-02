class Particle extends NZObject {
	constructor(pos) {
		super();
		this.pos = pos;
		this.w = Mathz.range(1, 2);
		this.winc = 0.07;
		this.c = C.black;
	}
	render() {
		Draw.setColor(this.c);
		Draw.pointCircle(this.pos, this.w);
		this.w -= this.winc;
		if (this.w < this.winc) {
			OBJ.remove(this.id);
		}
	}
}