Font.mb = Font.generate(Font.m.size, Font.bold);

const UNI = {
	angle: '\u2220',
	degree: '\u00b0'
};

let v1, v2, vDrag;

const getNearestV = (pos) => {
	let n = v2;
	const d1 = v1.distance(pos);
	const d2 = v2.distance(pos);
	if (d1 < d2) {
		n = v1;
	}
	return n;
};

Room.current.start = () => {
	v1 = Room.size.mid;
	v2 = Room.size.mid.sub(0, Room.h * 0.25);
};

Room.current.update = () => {
	if (Input.mouseUp(0)) {
		vDrag = null;
	}
	if (Input.mouseDown(0)) {
		vDrag = getNearestV(Input.mousePosition);
	}
	if (Input.mouseHold(0)) {
		if (vDrag) {
			vDrag.set(vDrag.lerp(Input.mousePosition, 0.5));
		}
	}
};

Room.current.render = () => {
	const angle = Vec2.sub(v1, v2).angle();
	const normalizedAngle = Math.normalizeAngle(angle);
	const distance = v1.distance(v2);
	const polar0 = Vec2.polar(0, distance).add(v1); // .add to offset it
	const polar1 = Vec2.polar(angle * 0.5, distance).add(v1);
	const polar2 = Vec2.polar(angle, Math.max(0, distance * 0.5)).add(v1);
	const polar3 = Vec2.polar(0, distance * 0.75).add(v1);
	const polar4 = Vec2.polar(normalizedAngle * 0.5, distance * 0.75).add(v1);

	Draw.setLineWidth(2);

	Draw.setColor(C.gold);
	Draw.circle(polar3.x, polar3.y, 5);
	Draw.arc(v1.x, v1.y, distance * 0.75, 0, normalizedAngle, true);
	Draw.setFont(Font.mb);
	Draw.textBackground(polar4.x, polar4.y, `${normalizedAngle.toFixed(2)}${UNI.degree}`, { origin: Vec2.center, bgColor: C.gold });

	Draw.setColor(C.sienna);
	Draw.pointLine(v1, v2);
	Draw.circle(polar2.x, polar2.y, 5);
	if (distance >= 90) {
		Draw.pointLine(v2, Vec2.polar(angle + 135, 10).add(v2));
		Draw.pointLine(v2, Vec2.polar(angle - 135, 10).add(v2));
	}

	Draw.setColor(C.royalBlue);
	Draw.circle(polar0.x, polar0.y, 5);
	Draw.arc(v1.x, v1.y, distance, 0, angle, true);
	Draw.setFont(Font.mb);
	Draw.textBackground(polar1.x, polar1.y, `${angle.toFixed(2)}${UNI.degree}`, { origin: Vec2.center, bgColor: C.royalBlue });

	Draw.onTransform(polar2.x, polar2.y, 1, 1, angle, () => {
		Draw.setFont(Font.s);
		Draw.textBackground(0, 0, `<-${distance < 90? ~~distance : distance.toFixed(2)}->`, { origin: new Vec2(0.5, 1), bgColor: C.sienna });
	});


	Draw.setColor(C.green);
	Draw.circle(v2.x, v2.y, 5);
	Draw.setColor(C.red);
	Draw.circle(v1.x, v1.y, 5);

	Draw.setColor(C.white);
	Draw.setLineDash(LineDash.short, -Time.time * 0.1);
	Draw.pointLine(Input.mousePosition, getNearestV(Input.mousePosition));
	Draw.resetLineDash();

	Draw.resetLineWidth();

	// Debug text
	let y = 0;
	Draw.setFont(Font.m);
	const drawText = (text, c=C.black) => {
		Draw.textBackground(0, y, text, { bgColor: c });
		y += Font.size + 10;
	};
	drawText(`vector 1: (${v1.x}, ${v1.y})`, C.red);
	drawText(`vector 2: (${v2.x}, ${v2.y})`, C.green);
	drawText(`distance: ${distance}`, C.sienna);
	drawText(`angle: ${angle}`, C.royalBlue);
	drawText(`normalized angle: ${normalizedAngle}`, C.gold);
	drawText(`sin(angle): ${Math.sin(Math.degtorad(angle))}`);
	drawText(`cos(angle): ${Math.cos(Math.degtorad(angle))}`);
	drawText(`tan(angle): ${Math.tan(Math.degtorad(angle))}`);
	drawText('Click near the red or green point to drag it around.');
	drawText(`FPS: ${Time.FPS}`);
};

NZ.start();