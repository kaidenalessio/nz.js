Play.update = () => {
	if (Time.time > Manager.oxygenSpawnTimer) {
		OBJ.create('oxygen', Mathz.range(50, Stage.w - 100), Mathz.range(50, Stage.h - 100));
		Manager.oxygenSpawnTimer = Time.time + Mathz.range(1, 2) * 1000; // 1 to 2 seconds
	}
};

Play.renderUI = () => {
	Draw.textBackground(0, 0, `O2 amount: ${Manager.oxygen}`);
};