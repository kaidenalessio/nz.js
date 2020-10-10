class My3DObject extends NZObject {
	constructor(mesh, position=Vec3.zero, rotation=Vec3.zero) {
		super();
		this.mesh = mesh;
		this.transform = {
			position: position,
			rotation: rotation
		};
	}
	start() {
		this.transform.rotation.add(this.id * 10, 0, this.id * 10);
	}
	update() {
		this.transform.rotation.x += 1;
		this.transform.rotation.z += 2;
	}
	// Render will be handled in app.js
	// render() {}
}

OBJ.addLink('3dobject', My3DObject);