import Konva from "konva";

export function drawGrid({ stage, layer, gridSize = 25 }) {
	// remove previous grid group se existir
	const prev = layer.findOne(".gridGroup");
	if (prev) prev.destroy();

	const gridGroup = new Konva.Group({
		name: "gridGroup",
		listening: false
	});
	const w = stage.width();
	const h = stage.height();

	// lines horizontais
	for (let y = 0; y <= h; y += gridSize) {
		const line = new Konva.Line({
			points: [0, y, w, y],
			stroke: "#e6e6e6",
			strokeWidth: 1
		});
		gridGroup.add(line);
	}
	// linhas verticais
	for (let x = 0; x <= w; x += gridSize) {
		const line = new Konva.Line({
			points: [x, 0, x, h],
			stroke: "#e6e6e6",
			strokeWidth: 1
		});
		gridGroup.add(line);
	}

	// adiciona atrás de tudo (colocar no início do layer)
	layer.add(gridGroup);
	// mover grid para trás (lowest z)
	gridGroup.moveToBottom();
	layer.batchDraw();
}
