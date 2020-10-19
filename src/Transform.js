var NZ = NZ || {};

// MODULES REQUIRED: NZ.Vec3, NZ.Vec2 (optional, this class focus on NZ.Vec3 but NZ.Vec2 can use some of the essentials)
NZ.Transform = function(position=Vec3.zero, rotation=Vec3.zero, scale=Vec3.one) {
	this.position = position;
	this.rotation = rotation;
	this.rotationMode = NZ.Transform.YXZ;
	this.scale = scale;
}

NZ.Transform.XYZ = 'XYZ';
NZ.Transform.XZY = 'XZY';
NZ.Transform.YXZ = 'YXZ'; // default (yaw, pitch, roll)
NZ.Transform.YZX = 'YZX';
NZ.Transform.ZXY = 'ZXY';
NZ.Transform.ZYX = 'ZYX';

NZ.Transform.prototype.clone = function() {
	return new NZ.Transform(this.position.clone(), this.rotation.clone(), this.scale.clone()); // NZ.Vec3 clone
};