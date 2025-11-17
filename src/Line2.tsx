import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { drawGrid } from "./functions/drawGrid";
import { snap } from "./functions/snap";
import resistor from "./assets/resistor(1).svg";
import { useImage } from "react-konva-utils";
import { calculateGap } from "./functions/calculateGap";

function App() {
	const stageRef = useRef<any>(null);

	const [image] = useImage(resistor);

	console.log("image: ", image);
	console.log("image: ", image?.width);

	useEffect(() => {
		if (!image) return;

		const stage = stageRef.current;
		const layer = stage?.getLayers()[0]; // layer criado pelo JSX

		if (!stage || !layer) return;

		const gridSize = 25;

		// draw grid (behind other shapes)
		drawGrid({ stage, layer, gridSize });
		// redesenhar grid ao redimensionar janela
		const onResize = () => {
			stage.size({
				width: window.innerWidth,
				height: window.innerHeight
			});
			drawGrid({ stage, layer, gridSize });
		};
		window.addEventListener("resize", onResize);

		// ...existing code...
		const compW = image.width ?? 50; // largura do componente SVG (px) — ajuste se necessário
		const compH = image.height ?? 50;
		//const gapSize = compW * 0.9; // largura da área "invisível" no centro (configurável)

		// const gapSize = 16; // dc voltage source symbol
		const gapSize = 48; // resistor symbol

		// substitui a single line por dois segmentos com um gap central
		const points = [50, 50, 250, 50];
		const { mid, lineAPoints, lineBPoints } = calculateGap(
			{ x: points[0], y: points[1] },
			{ x: points[2], y: points[3] },
			gapSize
		);

		const lineA = new Konva.Line({
			points: lineAPoints,
			stroke: "black",
			strokeWidth: 4
		});

		const lineB = new Konva.Line({
			points: lineBPoints,
			stroke: "black",
			strokeWidth: 4
		});

		layer.add(lineA);
		layer.add(lineB);

		const anchor1 = new Konva.Circle({
			x: lineA.points()[0],
			y: lineA.points()[1],
			radius: 6,
			fill: "orange",
			draggable: true
		});
		layer.add(anchor1);

		const anchor2 = new Konva.Circle({
			x: lineB.points()[2],
			y: lineB.points()[3],
			radius: 6,
			fill: "orange",
			draggable: true
		});
		layer.add(anchor2);


		const middlePoint = new Konva.Image({
			image,
			x: mid.x,
			y: mid.y,
			offsetX: compW / 2, // Half the width
			offsetY: compH / 2, // Half the height
			draggable: false
		});
		layer.add(middlePoint);

		function updateLine() {
			const p1 = {
				x: snap({ value: anchor1.x(), gridSize }),
				y: snap({ value: anchor1.y(), gridSize })
			};
			const p2 = {
				x: snap({ value: anchor2.x(), gridSize }),
				y: snap({ value: anchor2.y(), gridSize })
			};

			const { mid, dist, angleDeg, gapStart, gapEnd } = calculateGap(p1, p2, gapSize);

			// atualizar imagem central
			middlePoint.x(mid.x);
			middlePoint.y(mid.y);
			middlePoint.rotation(angleDeg);

			// se distancia menor que gap, esconder linhas (ou desenhar apenas pequenos segmentos)
			if (dist <= gapSize + 1e-6) {
				lineA.visible(false);
				lineB.visible(false);
			} else {
				lineA.visible(true);
				lineB.visible(true);

				// segmento A: p1 -> gapStart
				lineA.points([p1.x, p1.y, gapStart.x, gapStart.y]);
				// segmento B: gapEnd -> p2
				lineB.points([gapEnd.x, gapEnd.y, p2.x, p2.y]);
			}

			// garantir âncoras nos pontos snapped
			anchor1.x(p1.x);
			anchor1.y(p1.y);
			anchor2.x(p2.x);
			anchor2.y(p2.y);

			layer.batchDraw(); // Redraw the layer to reflect changes
		}

		anchor1.on("dragmove", updateLine);
		anchor2.on("dragmove", updateLine);
		anchor1.on("dragend", updateLine);
		anchor2.on("dragend", updateLine);
		// ...existing code...

		// cleanup
		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, [image]);

	return (
		<Stage
			ref={stageRef}
			width={window.innerWidth}
			height={window.innerHeight}
			style={{ border: "1px solid black" }}
		>
			<Layer></Layer>
		</Stage>
	);
}

export default App;
