import Konva from "konva";

export function drawGrid({ stage, layer, gridSize = 25 }) {
	// remove previous grid group se existir
	const prev = layer.findOne(".gridGroup");
	if (prev) prev.destroy();

	const gridGroup = new Konva.Group({
		name: "gridGroup",
		listening: false
	});
	const width = stage.width() * 2;
	const height = stage.height() * 2;

	// lines horizontais
	for (let y = -height; y <= height; y += gridSize) {
		const line = new Konva.Line({
			points: [-width, y, width, y],
			stroke: "#e6e6e6",
			strokeWidth: 0.7
		});
		gridGroup.add(line);
	}
	// linhas verticais
	for (let x = -width; x <= width; x += gridSize) {
		const line = new Konva.Line({
			points: [x, -height, x, height],
			stroke: "#e6e6e6",
			strokeWidth: 0.7
		});
		gridGroup.add(line);
	}

	// adiciona atrás de tudo (colocar no início do layer)
	layer.add(gridGroup);
	// mover grid para trás (lowest z)
	gridGroup.moveToBottom();
	layer.batchDraw();
}
