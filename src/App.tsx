import { Stage, Layer, Rect, Circle, Text, Path } from "react-konva";
import Konva from "konva";
import { useEffect, useRef } from "react";
import resistor from "./assets/resistor(1).svg";
import { drawGrid } from "./functions/drawGrid";
import { snap } from "./functions/snap";

function App() {
	const stageRef = useRef<any>(null);

	useEffect(() => {
		// const layer = stageRef.current?.getLayers()[0]; // Assuming one layer

		// // --- resistor with fixed body + stretchable legs ---
		// const resistorGroup = new Konva.Group({
		// 	x: 120,
		// 	y: 200,
		// 	draggable: true
		// });

		// // fixed visual body size (px)
		// const bodyW = 50;
		// const bodyH = 50;

		// // create placeholder lines & anchors; image will be configured after load
		// const leftLeg = new Konva.Line({
		// 	points: [-bodyW / 2, 0, -bodyW / 2 - 60, 0],
		// 	stroke: "black",
		// 	strokeWidth: 4,
		// 	lineCap: "round"
		// });
		// const rightLeg = new Konva.Line({
		// 	points: [bodyW / 2, 0, bodyW / 2 + 60, 0],
		// 	stroke: "black",
		// 	strokeWidth: 4,
		// 	lineCap: "round"
		// });

		// const leftAnchor = new Konva.Circle({
		// 	x: -bodyW / 2 - 60,
		// 	y: 0,
		// 	radius: 6,
		// 	fill: "orange",
		// 	draggable: true
		// });
		// const rightAnchor = new Konva.Circle({
		// 	x: bodyW / 2 + 60,
		// 	y: 0,
		// 	radius: 6,
		// 	fill: "orange",
		// 	draggable: true
		// });

		// // constrain anchors to horizontal line through body center (y = 0 in group coords)
		// const updateLeftLeg = () => {
		// 	leftAnchor.y(0);
		// 	leftLeg.points([-bodyW / 2, 0, leftAnchor.x(), leftAnchor.y()]);
		// 	layer.draw();
		// };
		// const updateRightLeg = () => {
		// 	rightAnchor.y(0);
		// 	rightLeg.points([bodyW / 2, 0, rightAnchor.x(), rightAnchor.y()]);
		// 	layer.draw();
		// };

		// leftAnchor.on("dragmove", updateLeftLeg);
		// rightAnchor.on("dragmove", updateRightLeg);

		// // load body image but keep fixed size (no scaling of whole group)
		// Konva.Image.fromURL(resistor, (image) => {
		// 	image.width(bodyW);
		// 	image.height(bodyH);
		// 	// center body at group origin
		// 	image.x(-bodyW / 2);
		// 	image.y(-bodyH / 2);
		// 	// optional: disable dragging directly on image so user moves group instead
		// 	image.draggable(false);

		// 	resistorGroup.add(image);
		// 	// add legs and anchors after image so they appear on top
		// 	resistorGroup.add(leftLeg, rightLeg, leftAnchor, rightAnchor);

		// 	// ensure legs reflect anchors initial pos
		// 	updateLeftLeg();
		// 	updateRightLeg();

		// 	layer.add(resistorGroup);
		// 	layer.draw();
		// });
		// // --- end resistor setup ---

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

		// // --- resistor with fixed body + stretchable legs ---
		// const resistorGroup = new Konva.Group({
		// 	x: 120,
		// 	y: 200,
		// 	draggable: true
		// });

		// // snap do grupo enquanto arrasta (snap absoluto)
		// resistorGroup.on("dragmove", () => {
		// 	const px = snap({ value: resistorGroup.x(), gridSize });
		// 	const py = snap({ value: resistorGroup.y(), gridSize });
		// 	resistorGroup.position({ x: px, y: py });
		// 	layer.batchDraw();
		// });

		// // fixed visual body size (px)
		// const bodyW = 50;
		// const bodyH = 50;

		// // create placeholder lines & anchors; image will be configured after load

		// const leftLegAnchorPoint = snap({ value: -bodyW / 2 - 60, gridSize });
		// const rightLegAnchorPoint = snap({ value: -bodyW / 2 + 60, gridSize });

		// const leftLeg = new Konva.Line({
		// 	points: [-bodyW / 2, 0, leftLegAnchorPoint, 0],
		// 	stroke: "black",
		// 	strokeWidth: 4,
		// 	lineCap: "round"
		// });
		// const rightLeg = new Konva.Line({
		// 	points: [bodyW / 2, 0, rightLegAnchorPoint, 0],
		// 	stroke: "black",
		// 	strokeWidth: 4,
		// 	lineCap: "round"
		// });

		// const leftAnchor = new Konva.Circle({
		// 	x: leftLegAnchorPoint,
		// 	y: 0,
		// 	radius: 6,
		// 	fill: "orange",
		// 	draggable: true
		// });
		// const rightAnchor = new Konva.Circle({
		// 	x: rightLegAnchorPoint,
		// 	y: 0,
		// 	radius: 6,
		// 	fill: "orange",
		// 	draggable: true
		// });

		// // constrain anchors to horizontal line through body center (y = 0 in group coords)
		// const updateLeftLeg = () => {
		// 	leftLeg.points([-bodyW / 2, 0, leftAnchor.x(), leftAnchor.y()]);
		// 	layer.batchDraw();
		// };
		// const updateRightLeg = () => {
		// 	rightLeg.points([bodyW / 2, 0, rightAnchor.x(), rightAnchor.y()]);
		// 	layer.batchDraw();
		// };

		// // snap apenas no eixo X (manter y = 0 do grupo)
		// leftAnchor.on("dragmove", () => {
		// 	const abs = leftAnchor.getAbsolutePosition();
		// 	const snappedX = snap({ value: abs.x, gridSize });
		// 	const snappedY = snap({ value: abs.y, gridSize });
		// 	// converter para coords do grupo (grupo não rotacionado/scale)
		// 	leftAnchor.x(snappedX - resistorGroup.x());
		// 	leftAnchor.y(snappedY - resistorGroup.y());
		// 	updateLeftLeg();
		// });
		// rightAnchor.on("dragmove", () => {
		// 	const abs = rightAnchor.getAbsolutePosition();
		// 	const snappedX = snap({ value: abs.x, gridSize });
		// 	const snappedY = snap({ value: abs.y, gridSize });
		// 	console.log({
		// 		absX: abs.x,
		// 		snappedX: snappedX,
		// 		relatedPosition: snappedX - resistorGroup.x()
		// 	});
		// 	rightAnchor.x(snappedX - resistorGroup.x());
		// 	rightAnchor.y(snappedY - resistorGroup.y());
		// 	updateRightLeg();
		// });

		// // load body image but keep fixed size (no scaling of whole group)
		// Konva.Image.fromURL(resistor, (image) => {
		// 	image.width(bodyW);
		// 	image.height(bodyH);
		// 	// center body at group origin
		// 	image.x(-bodyW / 2);
		// 	image.y(-bodyH / 2);
		// 	// optional: disable dragging directly on image so user moves group instead
		// 	image.draggable(false);

		// 	resistorGroup.add(image);
		// 	// add legs and anchors after image so they appear on top
		// 	resistorGroup.add(leftLeg, rightLeg, leftAnchor, rightAnchor);

		// 	// ensure legs reflect anchors initial pos
		// 	updateLeftLeg();
		// 	updateRightLeg();

		// 	layer.add(resistorGroup);
		// 	layer.draw();
		// });
		// // --- end resistor setup ---

		// // cleanup
		// return () => {
		// 	window.removeEventListener("resize", onResize);
		// };
		const resistorGroup = new Konva.Group({
			x: 200,
			y: 200,
			draggable: true // mover o grupo livremente (sem snap)
		});

		// fixed visual body size (px)
		const bodyW = 50;
		const bodyH = 50;

		// initial local anchor positions (simétricos em relação ao centro do corpo)
		const initialHalfDist = 60;
		const leftLocalX = -bodyW / 2 - initialHalfDist;
		const rightLocalX = bodyW / 2 + initialHalfDist;

		const leftLeg = new Konva.Line({
			points: [-bodyW / 2, 0, leftLocalX, 0],
			stroke: "black",
			strokeWidth: 4,
			lineCap: "round"
		});
		const rightLeg = new Konva.Line({
			points: [bodyW / 2, 0, rightLocalX, 0],
			stroke: "black",
			strokeWidth: 4,
			lineCap: "round"
		});

		const leftAnchor = new Konva.Circle({
			x: leftLocalX,
			y: 0,
			radius: 6,
			fill: "orange",
			draggable: true
		});
		const rightAnchor = new Konva.Circle({
			x: rightLocalX,
			y: 0,
			radius: 6,
			fill: "orange",
			draggable: true
		});

		const updateLegs = () => {
			// desenha pernas usando posições locais das âncoras; os pontos de saída do corpo são ±bodyW/2,0
			leftLeg.points([-bodyW / 2, 0, leftAnchor.x(), leftAnchor.y()]);
			rightLeg.points([bodyW / 2, 0, rightAnchor.x(), rightAnchor.y()]);
			layer.batchDraw();
		};

		// helper: rotaciona vetor p pelo ângulo (rad)
		const rotate = (p: { x: number; y: number }, angle: number) => {
			const c = Math.cos(angle);
			const s = Math.sin(angle);
			return { x: p.x * c - p.y * s, y: p.x * s + p.y * c };
		};

		// recomputa: snap da âncora movida -> recalcula midpoint, rotação do grupo e posições locais das âncoras
		const handleAnchorMove = (
			movedAbs: { x: number; y: number },
			otherAbs: { x: number; y: number }
		) => {
			// snap absoluto da âncora movida ao grid
			const snapped = {
				x: snap({ value: movedAbs.x, gridSize }),
				y: snap({ value: movedAbs.y, gridSize })
			};

			// midpoint absoluto entre as duas âncoras (usa snapped para a movida)
			const mid = {
				x: (snapped.x + otherAbs.x) / 2,
				y: (snapped.y + otherAbs.y) / 2
			};

			// ângulo da linha (de left -> right). usar atan2(dy, dx)
			const angle = Math.atan2(
				otherAbs.y - snapped.y,
				otherAbs.x - snapped.x
			);
			const angleDeg = (angle * 180) / Math.PI;

			// posiciona+rotaciona grupo (rotaciona a imagem inteira)
			resistorGroup.position(mid);
			resistorGroup.rotation(angleDeg);

			// converte coordenadas absolutas das âncoras para coords locais do grupo:
			// local = rotate( abs - mid, -angle )
			const leftLocal = rotate(
				{ x: snapped.x - mid.x, y: snapped.y - mid.y },
				-angle
			);
			const rightLocal = rotate(
				{ x: otherAbs.x - mid.x, y: otherAbs.y - mid.y },
				-angle
			);

			// atribui local positions nas âncoras
			leftAnchor.x(leftLocal.x);
			leftAnchor.y(leftLocal.y);
			rightAnchor.x(rightLocal.x);
			rightAnchor.y(rightLocal.y);

			updateLegs();
		};

		// dragmove handlers (snap durante drag)
		leftAnchor.on("dragmove", () => {
			// obter posição absoluta atual da âncora movida
			const leftAbs = leftAnchor.getAbsolutePosition();
			const rightAbs = rightAnchor.getAbsolutePosition();
			handleAnchorMove(leftAbs, rightAbs);
		});

		rightAnchor.on("dragmove", () => {
			const rightAbs = rightAnchor.getAbsolutePosition();
			const leftAbs = leftAnchor.getAbsolutePosition();
			handleAnchorMove(rightAbs, leftAbs);
		});

		// dragend: já foi sendo snapado durante dragmove; garantir recálculo final (pode também usar snap diferente aqui)
		leftAnchor.on("dragend", () => {
			const leftAbs = leftAnchor.getAbsolutePosition();
			const rightAbs = rightAnchor.getAbsolutePosition();
			handleAnchorMove(leftAbs, rightAbs);
		});
		rightAnchor.on("dragend", () => {
			const rightAbs = rightAnchor.getAbsolutePosition();
			const leftAbs = leftAnchor.getAbsolutePosition();
			handleAnchorMove(rightAbs, leftAbs);
		});

		// load body image but keep fixed size (no scaling of whole group)
		Konva.Image.fromURL(resistor, (image) => {
			image.width(bodyW);
			image.height(bodyH);
			// center body at group origin
			image.x(-bodyW / 2);
			image.y(-bodyH / 2);
			image.draggable(false);

			resistorGroup.add(image);
			resistorGroup.add(leftLeg, rightLeg, leftAnchor, rightAnchor);

			// ensure legs reflect anchors initial pos
			updateLegs();

			layer.add(resistorGroup);
			layer.draw();
		});

		// cleanup
		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	return (
		<Stage
			ref={stageRef}
			width={window.innerWidth}
			height={window.innerHeight}
			style={{ border: "1px solid black" }}
		>
			<Layer>
				{/* <Text text="Try to drag shapes" fontSize={15} />
				<Rect
					x={20}
					y={50}
					width={100}
					height={100}
					fill="red"
					shadowBlur={10}
					draggable
				/>
				<Circle x={200} y={100} radius={50} fill="green" draggable /> */}
			</Layer>
		</Stage>
	);
}

export default App;
