// Function to update image size based on anchor movement
export function update(activeAnchor: any) {
	const group = activeAnchor.getParent();

	if (!group) throw Error("Grupo não encontrado");

	const topLeft = group.findOne(".topLeft");
	const topRight = group.findOne(".topRight");
	const bottomRight = group.findOne(".bottomRight");
	const bottomLeft = group.findOne(".bottomLeft");
	const image = group.findOne("Image");

	const anchorX = activeAnchor.x();
	const anchorY = activeAnchor.y();

	// Update anchor positions based on which anchor was moved
	switch (activeAnchor.getName()) {
		case "topLeft":
			topRight.y(anchorY);
			bottomLeft.x(anchorX);
			break;
		case "topRight":
			topLeft.y(anchorY);
			bottomRight.x(anchorX);
			break;
		case "bottomRight":
			bottomLeft.y(anchorY);
			topRight.x(anchorX);
			break;
		case "bottomLeft":
			bottomRight.y(anchorY);
			topLeft.x(anchorX);
			break;
	}

	// Position image at top-left corner
	image.position(topLeft.position());

	// Update image dimensions
	const width = topRight.x() - topLeft.x();
	const height = bottomLeft.y() - topLeft.y();
	if (width && height) {
		image.width(width);
		image.height(height);
	}
}
