export function calculateGap(
	p1: { x: number; y: number },
	p2: { x: number; y: number },
	gapSize: number
) {
	// midpoint e ângulo
	const mid = {
		x: (p1.x + p2.x) / 2,
		y: (p1.y + p2.y) / 2
	};

	const dx = p2.x - p1.x;
	const dy = p2.y - p1.y;
	const dist = Math.hypot(dx, dy);
	const angle = Math.atan2(dy, dx);
	const angleDeg = (angle * 180) / Math.PI;

	console.debug("dx:", dx);
	console.debug("dy:", dy);
	console.debug("dist:", dist);
	console.debug("angle (rad):", angle);
	console.debug("angle (deg):", angleDeg);

	const halfGap = gapSize / 2;

	console.debug("halfGap:", halfGap);

	// vetor unitário
	let ux = dx / dist;
	let uy = dy / dist;

	if (isNaN(ux)) {
		ux = 0;
	}

	if (isNaN(uy)) {
		uy = 0;
	}

	console.debug("ux:", ux);
	console.debug("uy:", uy);

	// pontos que definem início e fim do gap
	const gapStart = {
		x: mid.x - ux * halfGap,
		y: mid.y - uy * halfGap
	};

	const gapEnd = {
		x: mid.x + ux * halfGap,
		y: mid.y + uy * halfGap
	};

	return {
		mid,
		dist,
		angleDeg,
		halfGap,
		gapStart,
		gapEnd,
		lineAPoints: [p1.x, p1.y, gapStart.x, gapStart.y],
		lineBPoints: [gapEnd.x, gapEnd.y, p2.x, p2.y]
	};
}
