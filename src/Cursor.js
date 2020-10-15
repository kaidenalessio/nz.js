var NZ = NZ || {};

NZ.Cursor = {
	alias: 'alias',
	all: 'all',
	allScroll: 'all-scroll',
	auto: 'auto',
	cell: 'cell',
	colResize: 'col-resize',
	contextMenu: 'context-menu',
	copy: 'copy',
	crosshair: 'crosshair',
	default: 'default',
	eResize: 'e-resize',
	ewResize: 'ew-resize',
	help: 'help',
	inherit: 'inherit',
	initial: 'initial',
	move: 'move',
	nResize: 'n-resize',
	neResize: 'ne-resize',
	neswResize: 'nesw-resize',
	noDrop: 'no-drop',
	none: 'none',
	none: 'none',
	notAllowed: 'not-allowed',
	nsResize: 'ns-resize',
	nwResize: 'nw-resize',
	nwseResize: 'nwse-resize',
	pointer: 'pointer',
	progress: 'progress',
	rowResize: 'row-resize',
	sResize: 's-resize',
	seResize: 'se-resize',
	swResize: 'sw-resize',
	text: 'text',
	unset: 'unset',
	verticalText: 'vertical-text',
	wResize: 'w-resize',
	wait: 'wait',
	zoomIn: 'zoom-in',
	zoomOut: 'zoom-out',
	list: [],
	image(src, x=0, y=0) {
		if (src instanceof Image) {
			src = src.src;
		}
		return `url(${src}) ${x} ${y}, auto`;
	},
	random() {
		return this.list[Math.floor(Math.random() * this.list.length)];
	}
};

NZ.Cursor.list = Object.values(NZ.Cursor);
NZ.Cursor.list.splice(NZ.Cursor.list.length - 3);