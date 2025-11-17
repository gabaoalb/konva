export function snap({ value, gridSize }: { value: number; gridSize: number }) {
	return Math.round(value / gridSize) * gridSize;
}
