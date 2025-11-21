import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { drawGrid } from "./functions/drawGrid";
import { snap } from "./functions/snap";
import resistor from "./assets/resistor(1).svg";
import voltageSource from "./assets/dc_v_source(1).svg";
import { useImage } from "react-konva-utils";
import { calculateGap } from "./functions/calculateGap";

type Mode = "move" | "resistor" | "voltage";
type Component = {
	lineA: Konva.Line;
	lineB: Konva.Line;
	anchor1: Konva.Circle;
	anchor2: Konva.Circle;
	middlePoint: Konva.Image;
	gapSize: number;
};

function App() {
	const stageRef = useRef<any>(null);
	const [mode, setMode] = useState<Mode>("move");
	const [isDrawing, setIsDrawing] = useState(false);
	const componentsRef = useRef<Component[]>([]);
	const currentComponentRef = useRef<Component | null>(null);

	const [resistorImage] = useImage(resistor);
	const [voltageImage] = useImage(voltageSource); // adicione a fonte de tensão

	function updateComponentLine(
		component: Component,
		newPos: { x: number; y: number } | null,
		gridSize: number,
		layer: Konva.Layer
	) {
		const p1 = {
			x: snap({ value: component.anchor1.x(), gridSize }),
			y: snap({ value: component.anchor1.y(), gridSize })
		};
		const p2 = newPos || {
			x: snap({ value: component.anchor2.x(), gridSize }),
			y: snap({ value: component.anchor2.y(), gridSize })
		};

		const { mid, dist, angleDeg, gapStart, gapEnd } = calculateGap(
			p1,
			p2,
			component.gapSize
		);

		component.middlePoint.x(mid.x);
		component.middlePoint.y(mid.y);
		component.middlePoint.rotation(angleDeg);

		if (dist <= component.gapSize + 1e-6) {
			component.lineA.visible(false);
			component.lineB.visible(false);
		} else {
			component.lineA.visible(true);
			component.lineB.visible(true);
			component.lineA.points([p1.x, p1.y, gapStart.x, gapStart.y]);
			component.lineB.points([gapEnd.x, gapEnd.y, p2.x, p2.y]);
		}

		component.anchor1.x(p1.x);
		component.anchor1.y(p1.y);
		component.anchor2.x(p2.x);
		component.anchor2.y(p2.y);

		layer.batchDraw();
	}

	useEffect(() => {
		if (!resistorImage) return;

		const stage = stageRef.current;
		const layer = stage?.getLayers()[0];

		if (!stage || !layer) return;

		const gridSize = 25;

		layer.add(
			new Konva.Circle({
				x: 0,
				y: 0,
				radius: 5,
				fill: "red"
			})
		);
		layer.add(
			new Konva.Circle({
				x: 0,
				y: 100,
				radius: 5,
				fill: "green"
			})
		);

		drawGrid({ stage, layer, gridSize });

		const onResize = () => {
			stage.size({
				width: window.innerWidth,
				height: window.innerHeight
			});
			drawGrid({ stage, layer, gridSize });
		};
		window.addEventListener("resize", onResize);

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isDrawing) {
				setIsDrawing(false);
				setMode("move");
			}

			if (e.key === "v") {
				setMode("voltage");
				setIsDrawing(true);
			}
			if (e.key === "r") {
				setMode("resistor");
				setIsDrawing(true);
			}
		};
		window.addEventListener("keydown", handleKeyDown);

		// Handler para começar a desenhar componente
		const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
			if (mode === "move") return;

			const pos = stage.getPointerPosition();
			if (!pos) return;

			const snappedPos = {
				x: snap({ value: pos.x, gridSize }),
				y: snap({ value: pos.y, gridSize })
			};

			console.log("pos: ", pos);
			console.log("snappedPos: ", snappedPos);

			setIsDrawing(true);

			const gapSize = mode === "resistor" ? 48 : 16;
			const image = mode === "resistor" ? resistorImage : voltageImage; // trocar por voltageImage quando disponível

			const { mid, lineAPoints, lineBPoints } = calculateGap(
				snappedPos,
				snappedPos,
				gapSize
			);

			console.log("lineAPoints: ", lineAPoints);
			console.log("lineBPoints: ", lineBPoints);

			const group = new Konva.Group({
				x: mid.x,
				y: mid.y,
				draggable: true
			});

			const rect = new Konva.Rect({
				x: mid.x,
				y: mid.y,
				width: 100,
				height: 100,
				stroke: "black"
			});

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

			const anchor1 = new Konva.Circle({
				x: snappedPos.x,
				y: snappedPos.y,
				radius: 6,
				fill: "orange",
				draggable: true
			});

			const anchor2 = new Konva.Circle({
				x: snappedPos.x,
				y: snappedPos.y,
				radius: 6,
				fill: "orange",
				draggable: true
			});

			const compW = image?.width ?? 50;
			const compH = image?.height ?? 50;

			const middlePoint = new Konva.Image({
				image,
				x: mid.x,
				y: mid.y,
				offsetX: compW / 2,
				offsetY: compH / 2,
				draggable: false
			});

			group.add(rect);
			group.add(lineA);
			group.add(lineB);
			group.add(anchor1);
			group.add(anchor2);
			group.add(middlePoint);
			layer.add(group);

			const component: Component = {
				lineA,
				lineB,
				anchor1,
				anchor2,
				middlePoint,
				gapSize
			};

			currentComponentRef.current = component;
			layer.batchDraw();
		};

		// Handler para arrastar enquanto desenha
		const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
			if (!isDrawing || !currentComponentRef.current) return;

			const pos = stage.getPointerPosition();
			if (!pos) return;

			const snappedPos = {
				x: snap({ value: pos.x, gridSize }),
				y: snap({ value: pos.y, gridSize })
			};

			console.log("move: ", snappedPos);

			updateComponentLine(
				currentComponentRef.current,
				snappedPos,
				gridSize,
				layer
			);
		};

		// Handler para finalizar desenho
		const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
			if (!isDrawing || !currentComponentRef.current) return;

			setIsDrawing(false);

			const component = currentComponentRef.current;
			componentsRef.current.push(component);

			// Adicionar listeners de drag aos anchors
			const updateLine = () =>
				updateComponentLine(component, null, gridSize, layer);

			component.anchor1.on("dragmove", updateLine);
			component.anchor2.on("dragmove", updateLine);
			component.anchor1.on("dragend", updateLine);
			component.anchor2.on("dragend", updateLine);

			currentComponentRef.current = null;
			layer.batchDraw();
		};

		stage.on("mousedown", handleMouseDown);
		stage.on("mousemove", handleMouseMove);
		stage.on("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("resize", onResize);
			stage.off("mousedown", handleMouseDown);
			stage.off("mousemove", handleMouseMove);
			stage.off("mouseup", handleMouseUp);
		};
	}, [resistorImage, mode, isDrawing, voltageImage]);

	return (
		<div>
			<div
				style={{
					padding: "10px",
					background: "#f0f0f0",
					borderBottom: "1px solid #ccc"
				}}
			>
				<button
					onClick={() => setMode("move")}
					style={{
						marginRight: "10px",
						padding: "8px 16px",
						background: mode === "move" ? "#007bff" : "#fff",
						color: mode === "move" ? "#fff" : "#000",
						border: "1px solid #ccc",
						cursor: "pointer"
					}}
				>
					Mover
				</button>
				<button
					onClick={() => setMode("resistor")}
					style={{
						marginRight: "10px",
						padding: "8px 16px",
						background: mode === "resistor" ? "#007bff" : "#fff",
						color: mode === "resistor" ? "#fff" : "#000",
						border: "1px solid #ccc",
						cursor: "pointer"
					}}
				>
					Resistor
				</button>
				<button
					onClick={() => setMode("voltage")}
					style={{
						padding: "8px 16px",
						background: mode === "voltage" ? "#007bff" : "#fff",
						color: mode === "voltage" ? "#fff" : "#000",
						border: "1px solid #ccc",
						cursor: "pointer"
					}}
				>
					Fonte de Tensão
				</button>
			</div>
			<Stage
				ref={stageRef}
				width={window.innerWidth}
				height={window.innerHeight - 50}
				draggable={mode === "move"}
				dragBoundFunc={function (pos) {
					console.debug("posDragStage:", pos);
					console.debug("this:", this);
					if (mode !== "move") return pos;

					let newX = pos.x;
					let newY = pos.y;

					// Define your boundaries (e.g., within a 300x300 box starting at 0,0)
					const minX = -1900;
					const maxX = 3800;
					const minY = -900;
					const maxY = 1100;

					// Apply restrictions
					if (newX < minX) newX = minX;
					if (newX > maxX) newX = maxX;
					if (newY < minY) newY = minY;
					if (newY > maxY) newY = maxY;

					return {
						x: newX,
						y: newY
					};
				}}
				style={{
					border: "1px solid black",
					cursor: mode === "move" ? "default" : "crosshair"
				}}
			>
				<Layer></Layer>
			</Stage>
		</div>
	);
}

export default App;
