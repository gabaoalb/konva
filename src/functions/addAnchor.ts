import Konva from "konva";
import { update } from "./update";

// Function to add resize anchors to a group
export function addAnchor(
	group: Konva.Group,
	x: number,
	y: number,
	name: string
) {
	const anchor = new Konva.Circle({
		x: x,
		y: y,
		stroke: "#666",
		fill: "#ddd",
		strokeWidth: 2,
		radius: 8,
		name: name,
		draggable: true,
		dragOnTop: false
	});

	// Add event listeners for resize behavior
	anchor.on("dragmove", function () {
		update(this);
	});

	anchor.on("mousedown touchstart", function () {
		group.draggable(false);
		this.moveToTop();
	});

	anchor.on("dragend", function () {
		group.draggable(true);
	});

	// Add hover styling
	anchor.on("mouseover", function () {
		document.body.style.cursor = "pointer";
		this.strokeWidth(4);
	});

	anchor.on("mouseout", function () {
		document.body.style.cursor = "default";
		this.strokeWidth(2);
	});

	group.add(anchor);
}
