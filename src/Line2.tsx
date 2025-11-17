import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { drawGrid } from "./functions/drawGrid";
import { snap } from "./functions/snap";
import resistor from "./assets/dc_v_source(1).svg";
import { useImage } from "react-konva-utils";

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

		const gapSize = 16;

		// substitui a single line por dois segmentos com um gap central
		const lineA = new Konva.Line({
			points: [50, 50, 250, 50],
			stroke: "black",
			strokeWidth: 4
		});
		const lineB = new Konva.Line({
			points: [50, 50, 250, 50],
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
			x: lineA.points()[2],
			y: lineA.points()[3],
			radius: 6,
			fill: "orange",
			draggable: true
		});
		layer.add(anchor2);

		const middlePoint = new Konva.Image({
			image,
			x: (lineA.points()[0] + lineA.points()[2]) / 2,
			y: (lineA.points()[1] + lineA.points()[3]) / 2,
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

			// midpoint e ângulo
			const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
			const dx = p2.x - p1.x;
			const dy = p2.y - p1.y;
			const dist = Math.hypot(dx, dy);
			const angle = Math.atan2(dy, dx);
			const angleDeg = (angle * 180) / Math.PI;

			// atualizar imagem central
			middlePoint.x(mid.x);
			middlePoint.y(mid.y);
			middlePoint.rotation(angleDeg);

			// calcular gap (metade)
			const halfGap = gapSize / 2;

			// se distancia menor que gap, esconder linhas (ou desenhar apenas pequenos segmentos)
			if (dist <= gapSize + 1e-6) {
				lineA.visible(false);
				lineB.visible(false);
			} else {
				lineA.visible(true);
				lineB.visible(true);

				// vetor unitário
				const ux = dx / dist;
				const uy = dy / dist;

				// pontos que definem início e fim do gap
				const gapStart = {
					x: mid.x - ux * halfGap,
					y: mid.y - uy * halfGap
				};
				const gapEnd = {
					x: mid.x + ux * halfGap,
					y: mid.y + uy * halfGap
				};

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
