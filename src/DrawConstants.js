var NZ = NZ || {};

// List of constants to use in NZ.Draw
NZ.Align = {
	l: 'left',
	r: 'right',
	c: 'center',
	t: 'top',
	b: 'bottom',
	m: 'middle'
};

NZ.LineCap = {
	Butt: 'butt',
	Round: 'round'
};

NZ.LineJoin = {
	Miter: 'miter',
	Round: 'round',
	Bevel: 'bevel'
};

NZ.LineDash = {
	solid: [],
	dot: [3, 10],
	short: [10, 10],
	long: [30, 20]
};

NZ.Primitive = {
	Fill: { name: 'Fill', quantity: 0, closePath: true, isStroke: false },
	Line: { name: 'Line', quantity: 0, closePath: false, isStroke: true },
	Stroke: { name: 'Stroke', quantity: 0, closePath: true, isStroke: true },
	LineList: { name: 'Line List', quantity: 2, closePath: false, isStroke: true },
	PointList: { name: 'Point List', quantity: 1, closePath: false, isStroke: true },
	TriangleList: { name: 'Triangle List', quantity: 3, closePath: true, isStroke: true },
	TriangleListFill: { name: 'Triangle List Fill', quantity: 3, closePath: false, isStroke: false }
};