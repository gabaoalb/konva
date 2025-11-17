export function calculateGap(p1: { x: number, y: number }, p2: { x: number, y: number }, gapSize: number) {

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

    const halfGap = gapSize / 2;

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