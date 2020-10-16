var NZ = NZ || {};

// Triangle class for use in 3d
// MODULE REQUIRED: NZ.Vec3
NZ.Tri = function(points, baseColor=C.white) {
	this.p = points; // NZ.Vec3
	this.depth = 0;
	this.baseColor = baseColor;
	this.bakedColor = this.baseColor;
	this.lightDotProduct = 0;
}

NZ.Tri.prototype.clone = function() {
	const t = new NZ.Tri([
		this.p[0].clone(), // NZ.Vec3.clone
		this.p[1].clone(),
		this.p[2].clone()
	]);
	t.depth = this.depth;
	t.baseColor = this.baseColor;
	t.bakedColor = this.bakedColor;
	t.lightDotProduct = this.lightDotProduct;
	return t;
};

NZ.Tri.prototype.onAllPoints = function(fn) {
	for (let i = 0; i < 3; i++) {
		fn(this.p[i]);
	}
};

NZ.Tri.prototype.calculateDepth = function() {
	// z mid method
	this.depth = (this.p[0].z + this.p[1].z + this.p[2].z) / 3;
};