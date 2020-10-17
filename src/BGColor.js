var NZ = NZ || {};

NZ.BGColor = {
	cream: ['white', 'mintcream'],
	almond: ['cornsilk', 'blanchedalmond'],
	lemon: ['lemonchiffon', 'khaki'],
	spring: ['mediumspringgreen', 'springgreen'],
	sky: ['powderblue', 'skyblue'],
	salmon: ['lightsalmon', 'orangered'],
	goldy: ['yellow', 'gold'],
	grass: ['mediumseagreen', 'seagreen'],
	sea: ['deepskyblue', 'cornflowerblue'],
	orchid: ['orchid', 'mediumorchid'],
	darkOrchid: ['darkorchid', 'darkslateblue'],
	dark: ['#1a1a1a', 'black'],
	keys: [],
	list: []
};

NZ.BGColor.keys = Object.keys(NZ.BGColor);
NZ.BGColor.keys.splice(NZ.BGColor.keys.length - 2);
NZ.BGColor.list = Object.values(NZ.BGColor);
NZ.BGColor.list.splice(NZ.BGColor.list.length - 2);