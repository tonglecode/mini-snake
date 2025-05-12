import { Score } from "./next-snake/score";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export default class NextSnake {
  //캔버스 속성
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;
  private cellSize: number;

  // 게임 상태
  private segments: { x: number; y: number }[] = [];
  private direction: Direction = "RIGHT";
  private nextDirection: Direction = "RIGHT";
  private food: { x: number; y: number } = { x: 0, y: 0 };
  private foods: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  //   private score: number = 0;
  private isGameOver: boolean = false;
  private animationId: number | null = null;

  // 애니메이션
  private lastRenderTime: number = 0;
  private gameSpeed: number = 150;
  private animationProgress: number = 0; //보간진행도 0.0 ~ 1.0
  private previousPosition: { x: number; y: number }[] = [];

  score = Score.getInstanc();

  constructor(canvas: HTMLCanvasElement, cellSize: number = 20) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("2D context를 가져올 수 없습니다!");
    }

    this.ctx = ctx;

    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.cellSize = cellSize;

    // 뱀 생성
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;

    this.segments = [
      { x: centerX, y: centerY },
      { x: centerX - this.cellSize, y: centerY },
      { x: centerX - this.cellSize * 2, y: centerY },
    ];

    this.generateFood();
  }

  start() {
    if (this.isGameOver) {
      this.reset();
    }
    //이전 애니메이션 프레임 정리
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    // 애니메이션 시작
    this.lastRenderTime = performance.now();
    this.animate(this.lastRenderTime);
  }

  //게임리셋
  reset() {
    // 뱀 시작 위치 설정
    const centerX =
      Math.floor(this.canvasWidth / 2 / this.cellSize) * this.cellSize;
    const centerY =
      Math.floor(this.canvasHeight / 2 / this.cellSize) * this.cellSize;

    // 뱀 마디
    this.segments = [
      { x: centerX, y: centerY },
      { x: centerX - this.cellSize, y: centerY },
      { x: centerX - this.cellSize * 2, y: centerY },
    ];
    this.gameSpeed = 150;

    this.isGameOver = false;
    this.score.setScore(0);
    this.generateFood();
  }

  animate(currentTime: number) {
    if (this.isGameOver) {
      this.draw();
      return;
    }
    // 다음 프레임 요청
    requestAnimationFrame(this.animate.bind(this));

    // 프레임(네모칸) 사이 시간 계산
    const timeSinceLastRender = currentTime - this.lastRenderTime;

    // 한칸 여러개로 썰기 (0.0~1.0)
    this.animationProgress = timeSinceLastRender / this.gameSpeed;

    // 시간사이 뱀 그림 그리기
    this.draw();

    // 목표 간격에 도달하면 게임 업데이트
    if (timeSinceLastRender >= this.gameSpeed) {
      this.lastRenderTime = currentTime;
      this.update();
    }
  }

  generateFood() {
    // const maxCells = CanvasSize / CellSize;

    const maxX = Math.floor(this.canvasWidth / this.cellSize);
    const maxY = Math.floor(this.canvasHeight / this.cellSize);

    // 랜덤 위치 생성

    let foodX, foodY;
    let foundValidPosition = false;

    while (!foundValidPosition) {
      foodX = Math.floor(Math.random() * maxX) * this.cellSize;
      foodY = Math.floor(Math.random() * maxY) * this.cellSize;

      foundValidPosition = true;

      // 뱀 겹침 검증
      for (const segment of this.segments) {
        if (segment.x === foodX && segment.y === foodY) {
          foundValidPosition = false;
          break;
        }
      }
    }

    this.food = { x: Number(foodX), y: Number(foodY) };
  }

  changeDirection(newDirection: Direction) {
    // 반대 방향으로 이동 방지
    // console.log("newDirection", newDirection);

    const invalidMoves = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };
    if (
      newDirection !== invalidMoves[this.direction as keyof typeof invalidMoves]
    ) {
      this.nextDirection = newDirection;
    }
  }

  isOver() {
    return this.isGameOver;
  }

  getScore() {
    return this.score;
  }

  draw() {
    //켄버스 리셋
    this.ctx.fillStyle = "#F8F8F8";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.ctx.strokeStyle = "#E0E0E0";
    this.ctx.lineWidth = 0.5;

    // 네모칸 그리기
    for (let x = 0; x < this.canvasWidth; x += this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvasHeight);
      this.ctx.stroke();
    }

    for (let y = 0; y < this.canvasHeight; y += this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvasWidth, y);
      this.ctx.stroke();
    }

    //뱀 그리기 (상자 한칸이동 중간 채우기)

    const segments = this.segments.map((segment, index) => {
      // 이전 위치 있고 현재 프레임 사이를 이동중이라면
      if (
        this.previousPosition.length > 0 &&
        index < this.previousPosition.length
      ) {
        const t = this.animationProgress;
        // console.log("t", t);

        const prevPos = this.previousPosition[index];

        // 사이 채우는 시간
        const currentPos = segment;

        let dx = currentPos.x - prevPos.x;
        let dy = currentPos.y - prevPos.y;

        if (Math.abs(dx) > this.canvasWidth / 2) {
          dx = dx > 0 ? dx - this.canvasWidth : dx + this.canvasWidth;
        }

        if (Math.abs(dy) > this.canvasHeight / 2) {
          dy = dy > 0 ? dy - this.canvasHeight : dy + this.canvasHeight;
        }

        // 이전 위치와 현재 채우는 위치
        // 현재 끼인 위치
        return {
          x: prevPos.x + dx * t,
          y: prevPos.y + dy * t,
        };
      }
      return segment;
    });

    // 낀 사이 뱀 몸통 그리기
    segments.forEach((segment, index) => {
      if (index === 0) {
        this.ctx.fillStyle = "#FF7522";
        // this.ctx.strokeStyle = "#E64A19";
      } else {
        const greenValue = Math.max(100, 200 - index * 5);
        this.ctx.fillStyle = `rgb(76,${greenValue},175)`;
        // this.ctx.strokeStyle = "#1976D2";
      }

      // 뱀 라운드 사각
      const radius = this.cellSize / 5;
      this.drawRoundedRect(
        segment.x,
        segment.y,
        this.cellSize,
        this.cellSize,
        radius
      );
    });

    // 먹이 그리기
    this.ctx.fillStyle = "#4CAF50";
    this.ctx.strokeStyle = "#388E3C";

    this.drawCircle(
      this.food.x + this.cellSize / 2,
      this.food.y + this.cellSize / 2,
      this.cellSize / 2 - 2
    );
  }

  private drawCircle(x: number, y: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
  }

  // 둥근 사각형 그리기 헬퍼 함수
  private drawRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.arcTo(
      x + width,
      y + height,
      x + width - radius,
      y + height,
      radius
    );
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  private update() {
    // 이전 프레임 위치저장
    this.previousPosition = [...this.segments];

    // console.log("previousPosition", this.previousPosition);

    // 방향 업데이트
    this.direction = this.nextDirection;
    // console.log("direction", this.direction);

    // 머리 위치
    const head = { ...this.segments[0] };

    switch (this.direction) {
      case "UP":
        head.y -= this.cellSize;
        break;
      case "DOWN":
        head.y += this.cellSize;
        break;
      case "LEFT":
        head.x -= this.cellSize;
        break;
      case "RIGHT":
        head.x += this.cellSize;
        break;
    }

    // 벽 뚫고 워프
    if (head.x < 0) head.x = this.canvasWidth - this.cellSize;
    if (head.x >= this.canvasWidth) head.x = 0;
    if (head.y < 0) head.y = this.canvasHeight - this.cellSize;
    if (head.y >= this.canvasHeight) head.y = 0;
    // 먹이 체크
    const ateFood = head.x === this.food.x && head.y === this.food.y;

    // 새로운 머리 추가
    this.segments.unshift(head);
    //꼬리 처리
    if (ateFood) {
      this.score.addScore(10);
      this.generateFood();

      this.gameSpeed -= 3;
    } else {
      this.segments.pop();
    }
    this.checkCollision();

    this.animationProgress = 0;
  }

  private checkCollision() {
    const head = this.segments[0];

    for (let i = 1; i < this.segments.length; i++) {
      if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
        this.isGameOver = true;
        return;
      }
    }
  }
}
