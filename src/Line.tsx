import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { drawGrid } from "./functions/drawGrid";
import { snap } from "./functions/snap";
import resistor from "./assets/resistor(1).svg";
import { useImage } from "react-konva-utils";

function App() {
	const stageRef = useRef<any>(null);

	const [image] = useImage(resistor);

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

		const line = new Konva.Line({
			points: [50, 50, 250, 50],
			stroke: "black",
			strokeWidth: 2
		});

		layer.add(line);

		const anchor1 = new Konva.Circle({
			x: line.points()[0],
			y: line.points()[1],
			radius: 6,
			fill: "orange",
			draggable: true
		});
		layer.add(anchor1);

		const anchor2 = new Konva.Circle({
			x: line.points()[2],
			y: line.points()[3],
			radius: 6,
			fill: "orange",
			draggable: true
		});
		layer.add(anchor2);

		const middlePoint = new Konva.Image({
			image,
			x: (line.points()[0] + line.points()[2]) / 2,
			y: (line.points()[1] + line.points()[3]) / 2,
			offsetX: 25, // Half the width
			offsetY: 25, // Half the height
			draggable: true
		});
		layer.add(middlePoint);

		function updateLine() {
			const newPoints = [
				snap({ value: anchor1.x(), gridSize }),
				snap({ value: anchor1.y(), gridSize }),
				snap({ value: anchor2.x(), gridSize }),
				snap({ value: anchor2.y(), gridSize })
			];

			const newMiddlePoint = {
				x: (newPoints[0] + newPoints[2]) / 2,
				y: (newPoints[1] + newPoints[3]) / 2
			};

			const angle = Math.atan2(
				newPoints[3] - newPoints[1],
				newPoints[2] - newPoints[0]
			);
			const angleDeg = (angle * 180) / Math.PI;

			console.log(angleDeg);

			middlePoint.x(newMiddlePoint.x);
			middlePoint.y(newMiddlePoint.y);
			middlePoint.rotation(angleDeg);

			anchor1.x(newPoints[0]);
			anchor1.y(newPoints[1]);
			anchor2.x(newPoints[2]);
			anchor2.y(newPoints[3]);
			line.points(newPoints);
			layer.batchDraw(); // Redraw the layer to reflect changes
		}

		anchor1.on("dragmove", updateLine);
		anchor2.on("dragmove", updateLine);

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
