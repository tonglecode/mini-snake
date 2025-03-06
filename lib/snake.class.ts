export default class Snake {
  private segments: { x: number; y: number }[];
  private direction: { dx: number; dy: number };
  private cellSize: number;
  private canvasSize: number;

  constructor(
    initialPosition: { x: number; y: number },
    initialDirection: { dx: number; dy: number },
    initialCellSize: number,
    initialCanvasSize: number
  ) {
    this.segments = [initialPosition];
    this.direction = initialDirection;
    this.cellSize = initialCellSize;
    this.canvasSize = initialCanvasSize;
  }

  getSegments() {
    return this.segments;
  }

  getDirection() {
    return this.direction;
  }

  setDirection(newDirection: { dx: number; dy: number }) {
    this.direction = newDirection;
  }

  rateMove() {
    const head = { ...this.segments[0] };
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
    // }

    head.x += this.direction.dx / 10;
    head.y += this.direction.dy / 10;

    // 벽 차원이동
    head.x = (head.x + this.canvasSize) % this.canvasSize;
    head.y = (head.y + this.canvasSize) % this.canvasSize;
    this.segments.unshift(head);
    this.segments.pop();
  }

  move() {
    const head = { ...this.segments[0] };
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
    // }

    head.x += this.direction.dx;
    head.y += this.direction.dy;

    // 벽 차원이동
    head.x = (head.x + this.canvasSize) % this.canvasSize;
    head.y = (head.y + this.canvasSize) % this.canvasSize;

    this.segments.unshift(head);
    this.segments.pop();
  }

  grow() {
    const tail = this.segments[this.segments.length];
    this.segments.push({ ...tail });
  }

  checkCollision() {
    const head = this.getSegments()[0];

    // 머리와 몸 충돌검사
    for (let i = 1; i < this.getSegments().length; i++) {
      if (
        head.x === this.getSegments()[i].x &&
        head.y === this.getSegments()[i].y
      )
        return true;
    }
    return false;
  }
}
