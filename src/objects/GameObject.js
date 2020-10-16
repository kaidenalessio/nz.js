class NZGameObject extends NZObject {
	constructor() {
		super();
		this.alarm = [-1, -1, -1, -1, -1, -1];
	}
	alarm0() {}
	alarm1() {}
	alarm2() {}
	alarm3() {}
	alarm4() {}
	alarm5() {}
	alarmUpdate() {
		for (let i = this.alarm.length - 1; i >= 0; --i) {
			if (this.alarm[i] !== -1) {
				this.alarm[i] -= 1;
				if (this.alarm[i] < 0) {
					switch (i) {
						case 0: this.alarm0(); break;
						case 1: this.alarm1(); break;
						case 2: this.alarm2(); break;
						case 3: this.alarm3(); break;
						case 4: this.alarm4(); break;
						case 5: this.alarm5(); break;
					}
					if (this.alarm[i] < 0) {
						this.alarm[i] = -1;
					}
				}
			}
		}
	}
	postUpdate() {
		this.alarmUpdate();
	}
}