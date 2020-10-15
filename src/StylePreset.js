var NZ = NZ || {};

NZ.StylePreset = {
	none: '',
	noGap: `* { margin: 0; padding: 0; }`
};

NZ.StylePreset.middle = (canvasID) => `#${canvasID} { position: absolute; top: 50%; transform: translateY(-50%); }`;
NZ.StylePreset.center = (canvasID) => `#${canvasID} { position: absolute; left: 50%; transform: translateX(-50%); }`;
NZ.StylePreset.middleCenter = (canvasID) => `#${canvasID} { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }`;

NZ.StylePreset.noGapMiddle = (canvasID) => NZ.StylePreset.noGap + NZ.StylePreset.middle(canvasID);
NZ.StylePreset.noGapCenter = (canvasID) => NZ.StylePreset.noGap + NZ.StylePreset.center(canvasID);
NZ.StylePreset.noGapMiddleCenter = (canvasID) => NZ.StylePreset.noGap + NZ.StylePreset.middleCenter(canvasID);

NZ.StylePreset.centerMiddle = NZ.StylePreset.middleCenter;
NZ.StylePreset.noGapCenterMiddle = NZ.StylePreset.noGapMiddleCenter;

NZ.StylePreset.fullViewport = (canvasID, parentSelector) => `
	* {
		margin: 0;
		padding: 0;
	}
	${parentSelector} {
		width: 100vw;
		height: 100vh;
		position: absolute;
		overflow: hidden;
	}
	#${canvasID} {
		width: 100%;
		height: 100%;
	}
`;