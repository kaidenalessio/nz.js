var NZ = NZ || {};

NZ.Mat4 = function() {
	this.m = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
}

NZ.Mat4.degtorad = function(deg) {
	return deg * 0.017453292519943295;
};

NZ.Mat4.mulVec3 = function(m, i) {
	let v = Vec3.zero;
	v.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + i.w * m.m[3][0];
	v.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + i.w * m.m[3][1];
	v.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + i.w * m.m[3][2];
	v.w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + i.w * m.m[3][3];
	return v;
};

NZ.Mat4.mulMat4 = function(m1, m2) {
	const m = new Mat4();
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			m.m[j][i] = m1.m[j][0] * m2.m[0][i] + m1.m[j][1] * m2.m[1][i] + m1.m[j][2] * m2.m[2][i] + m1.m[j][3] * m2.m[3][i];
		}
	}
	return m;
};

NZ.Mat4.makeIdentity = function() {
	const m = new Mat4();
	m.m[0][0] = 1;
	m.m[1][1] = 1;
	m.m[2][2] = 1;
	m.m[3][3] = 1;
	return m;
};

NZ.Mat4.makeProjection = function(aspectRatio=0.5625, fovDeg=90, near=0.1, far=1000) {
	const fovRad = 1 / Math.tan(NZ.Mat4.degtorad(fovDeg * 0.5));
	const m = new Mat4();
	m.m[0][0] = aspectRatio * fovRad;
	m.m[1][1] = fovRad;
	m.m[2][2] = far / (far - near);
	m.m[3][2] = (-far * near) / (far - near);
	m.m[2][3] = 1;
	return m;
};

NZ.Mat4.makeRotationX = function(angleDeg, m=new Mat4()) {
	angleDeg = NZ.Mat4.degtorad(angleDeg);
	m.m[0][0] = 1;
	m.m[1][1] = Math.cos(angleDeg);
	m.m[1][2] = Math.sin(angleDeg);
	m.m[2][1] = -Math.sin(angleDeg);
	m.m[2][2] = Math.cos(angleDeg);
	m.m[3][3] = 1;
	return m;
};

NZ.Mat4.makeRotationY = function(angleDeg, m=new Mat4()) {
	angleDeg = NZ.Mat4.degtorad(angleDeg);
	m.m[0][0] = Math.cos(angleDeg);
	m.m[0][2] = -Math.sin(angleDeg);
	m.m[1][1] = 1;
	m.m[2][0] = Math.sin(angleDeg);
	m.m[2][2] = Math.cos(angleDeg);
	m.m[3][3] = 1;
	return m;
};

NZ.Mat4.makeRotationZ = function(angleDeg, m=new Mat4()) {
	angleDeg = NZ.Mat4.degtorad(angleDeg);
	m.m[0][0] = Math.cos(angleDeg);
	m.m[0][1] = Math.sin(angleDeg);
	m.m[1][0] = -Math.sin(angleDeg);
	m.m[1][1] = Math.cos(angleDeg);
	m.m[2][2] = 1;
	m.m[3][3] = 1;
	return m;
};

NZ.Mat4.makeTranslation = function(x, y, z) {
	if (x instanceof Vec3 || typeof x === 'object') {
		z = x.z;
		y = x.y;
		x = x.x;
	}
	const m = new Mat4();
	m.m[0][0] = 1;
	m.m[1][1] = 1;
	m.m[2][2] = 1;
	m.m[3][3] = 1;
	m.m[3][0] = x;
	m.m[3][1] = y;
	m.m[3][2] = z;
	return m;
};

NZ.Mat4.makeWorld = function(transform) {
	const matRotZ = Mat4.makeRotationZ(transform.rotation.z);
	const matRotX = Mat4.makeRotationX(transform.rotation.x);
	const matRotY = Mat4.makeRotationY(transform.rotation.y);
	const matTrans = Mat4.makeTranslation(transform.position);
	const matWorld = Mat4.mulMat4(Mat4.mulMat4(Mat4.mulMat4(matRotZ, matRotX), matRotY), matTrans);
	return matWorld;
};