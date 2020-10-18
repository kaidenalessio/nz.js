var NZ = NZ || {};

NZ.Mathz = {};

NZ.Mathz.PI2 = 2 * Math.PI;

NZ.Mathz.DEG_TO_RAD = Math.PI / 180;

NZ.Mathz.RAD_TO_DEG = 180 / Math.PI;

NZ.Mathz.EPSILON = 1e-6;

NZ.Mathz.ONE_THIRD = 1/3;

NZ.Mathz.ONE_SIXTH = 1/6;

NZ.Mathz.TWO_THIRDS = 2/3;

NZ.Mathz.degtorad = (deg) => deg * NZ.Mathz.DEG_TO_RAD;

NZ.Mathz.radtodeg = (rad) => rad * NZ.Mathz.RAD_TO_DEG;

NZ.Mathz.map = (value, min1, max1, min2, max2, boundMin, boundMax) => {
	value = min2 + (value - min1) / (max1 - min1) * (max2 - min2);
	if (typeof boundMin === 'number') value = Math.max(value, boundMin);
	if (typeof boundMax === 'number') value = Math.min(value, boundMax);
	return value;
};

NZ.Mathz.hypot = (a, b) => Math.sqrt(a*a + b*b);
NZ.Mathz.hypotsq = (a, b) => a*a + b*b;

NZ.Mathz.clamp = (value, min, max) => Math.min(max, Math.max(min, value));

NZ.Mathz.range = (min, max=0, t=Math.random()) => min + t * (max - min);

NZ.Mathz.irange = (min, max=0) => Math.floor(min + Math.random() * (max - min));

NZ.Mathz.choose = (...args) => args[Math.floor(Math.random() * args.length)];

NZ.Mathz.randneg = (t=0.5) => Math.random() < t? -1 : 1;

NZ.Mathz.randbool = (t=0.5) => Math.random() < t;

NZ.Mathz.normalizeAngle = (angleDeg) => {
	angleDeg = angleDeg % 360;
	if (angleDeg > 180) angleDeg -= 360;
	if (angleDeg < -180) angleDeg += 360;
	return angleDeg;
};

NZ.Mathz.fuzzyEqual = (a, b, epsilon=NZ.Mathz.EPSILON) => Math.abs(b-a) <= epsilon;

NZ.Mathz.smoothRotate = (angleDegA, angleDegB, speed=5) => angleDegA + Math.sin(NZ.Mathz.degtorad(angleDegB - angleDegA)) * speed;