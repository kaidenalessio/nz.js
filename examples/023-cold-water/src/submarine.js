class Submarine extends NZObject3D {
	constructor(pos, baseColor) {
		super(Mesh.makeSub(), pos);
		this.mesh.onAllTris((tri) => {
			if (tri.baseColor === `rgb(255, 255, 255)`) {
				tri.baseColor = baseColor;
			}
		});
		this.wave = {
			amp: 1,
			freq: 0.01,
			baseAmp: 1,
			baseFreq: 0.01,
			update() {
				this.amp = Mathz.range(this.amp, this.baseAmp, 0.05);
				this.freq = Mathz.range(this.freq, this.baseFreq, 0.05);
			}
		};
		this.alive = true;
		this.lives = 4;
		this.maxlives = 4;
		this.move = 0;
		this.c = baseColor;
	}
	hit() {
		if (this.alive) {
			this.lives--;
			if (this.lives <= 0) {
				this.alive = false;
			}
			this.wave.baseAmp = 10 * (1 - (this.lives / this.maxlives));
		}
		this.wave.amp = 10;
	}
	start() {
		this.transform.rotation.y = 110 + this.id * 10;
	}
	update() {
		this.transform.position.y += Math.cos(Time.time * 0.005 + this.id * 0.1) * 0.1;
		this.transform.rotation.y -= Math.cos(Time.time * 0.0005) * 0.2;
		this.transform.rotation.x = Math.cos(Time.time * this.wave.freq + this.id * this.id) * this.wave.amp;
		this.transform.rotation.z = Math.sin(Time.time * this.wave.freq + this.id * this.id) * this.wave.amp;
		this.wave.update();
		if (!this.alive) {
			this.transform.position.z += 0.1;
			this.transform.position.y -= 0.5;
			if (this.transform.position.y < -50) {
				OBJ.remove(this.id);
			}
		}
	}
}

OBJ.mark('3d');
OBJ.addLink('Submarine', Submarine);