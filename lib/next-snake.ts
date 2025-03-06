export class Snake {
  private segments: { x: number; y: number }[];
  private direction: { dx: number; dy: number };
  private cellSize: number;
  private canvasSize: number;

  constructor(
    initialPosition: { x: number; y: number },
    initialDirection: { dx: number; dy: number },
    cellSize: number,
    canvasSize: number
  ) {
    this.segments = [initialPosition];
    this.direction = initialDirection;
    this.cellSize = cellSize;
    this.canvasSize = canvasSize;
  }

  getSegments() {
    return this.segments;
  }

  setDirection(newDirection: { dx: number; dy: number }) {
    // 현재 방향과 반대 방향으로는 이동할 수 없도록 제한
    if (
      (this.direction.dx === 0 && newDirection.dx !== 0) ||
      (this.direction.dy === 0 && newDirection.dy !== 0)
    ) {
      this.direction = newDirection;
    }
  }

  move() {
    const head = { ...this.segments[0] };
    head.x += this.direction.dx;
    head.y += this.direction.dy;

    // 벽을 통과하여 반대편으로 나오도록 처리
    head.x = (head.x + this.canvasSize) % this.canvasSize;
    head.y = (head.y + this.canvasSize) % this.canvasSize;

    this.segments.unshift(head);
    this.segments.pop();
  }

  grow() {
    const tail = this.segments[this.segments.length - 1];
    this.segments.push({ ...tail });
  }

  checkCollision() {
    const head = this.segments[0];
    // 머리가 몸통과 충돌했는지 확인
    for (let i = 1; i < this.segments.length; i++) {
      if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
        return true;
      }
    }
    return false;
  }
}
