var NZ = NZ || {};

// MODULES REQUIRED: NZ.Vec3, NZ.Vec2 (optional, this class focus on NZ.Vec3 but NZ.Vec2 can use some of the essentials)
NZ.Transform = function(position=Vec3.zero, rotation=Vec3.zero) {
	this.position = position;
	this.rotation = rotation;
}

NZ.Transform.prototype.clone = function() {
	return new NZ.Transform(this.position.clone(), this.rotation.clone()); // NZ.Vec3 clone
};