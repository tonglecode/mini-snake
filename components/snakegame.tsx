"use client";
import { useEffect, useRef, useState } from "react";

export default function SnakeGame() {
  const [score, setScore] = useState(0);
  const CanvasSize = 400;
  const CellSize = 10;
  const gameSpeed = 150;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef([{ x: 200, y: 200 }]);
  const directionRef = useRef({ dx: 0, dy: -10 });
  const foodRef = useRef({ x: 0, y: 0 });
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // 먹이생성
        generateFood(ctx);

        gameIntervalRef.current = setInterval(() => {
          gameLoop(ctx); // 게임 시작
        }, gameSpeed);

        //키보드제어
        const handleKeyDown = (e: KeyboardEvent) => changeDirection(e);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
          clearInterval(gameIntervalRef.current as NodeJS.Timeout);
          window.removeEventListener("keydown", handleKeyDown);
        };
      }
    }
  }, []);

  const gameLoop = (ctx: CanvasRenderingContext2D) => {
    setTimeout(() => {
      clearCanvas(ctx);
      drawSnake(ctx);
      drawFood(ctx);
      moveSnake(ctx);
    }, 0);

    if (checkCollision()) {
      clearInterval(gameIntervalRef.current as NodeJS.Timeout);
      alert("게임 오버");
    }
    // 다음 프레임 요청
  };

  const changeDirection = (e: KeyboardEvent) => {
    const { dx, dy } = directionRef.current;
    switch (e.key) {
      case "ArrowUp":
      case "w":
        if (dy == 0) directionRef.current = { dx: 0, dy: -CellSize };
        break;
      case "ArrowDown":
      case "s":
        if (dy == 0) directionRef.current = { dx: 0, dy: CellSize };
        break;
      case "ArrowLeft":
      case "a":
        if (dx == 0) directionRef.current = { dx: -CellSize, dy: 0 };
        break;
      case "ArrowRight":
      case "d":
        if (dx == 0) directionRef.current = { dx: CellSize, dy: 0 };
        break;
      default:
        break;
    }
  };

  const checkCollision = () => {
    const snake = snakeRef.current;
    const head = snake[0];

    if (
      head.x < 0 ||
      head.x >= CanvasSize ||
      head.y < 0 ||
      head.y >= CanvasSize
    ) {
      return true;
    }

    // 머리와 몸 충돌검사
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
  };

  const moveSnake = (ctx: CanvasRenderingContext2D) => {
    const snake = snakeRef.current;
    const head = { ...snake[0] };
    const { dx, dy } = directionRef.current;
    head.x += dx;
    head.y += dy;
    snake.unshift(head);
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore((prev) => prev + 10);
      generateFood(ctx);
    } else {
      snake.pop();
    }
  };

  const drawSnake = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "lightblue";
    ctx.strokeStyle = "darkblue";
    snakeRef.current.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, CellSize, CellSize);
      ctx.strokeRect(segment.x, segment.y, CellSize, CellSize);
    });
  };

  const generateFood = (ctx: CanvasRenderingContext2D) => {
    const maxCells = CanvasSize / CellSize;
    const foodX = Math.floor(Math.random() * maxCells) * CellSize;
    const foodY = Math.floor(Math.random() * maxCells) * CellSize;
    foodRef.current = { x: foodX, y: foodY };

    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "darkgreen";
    ctx.fillRect(foodRef.current.x, foodRef.current.y, CellSize, CellSize);
    ctx.strokeRect(foodRef.current.x, foodRef.current.y, CellSize, CellSize);
  };

  const drawFood = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "darkgreen";
    ctx.fillRect(foodRef.current.x, foodRef.current.y, CellSize, CellSize);
    ctx.strokeRect(foodRef.current.x, foodRef.current.y, CellSize, CellSize);
  };

  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CanvasSize, CanvasSize);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, CanvasSize, CanvasSize);
  };

  return (
    <div className="w-full h-screen flex flex-col gap-8 justify-center items-center ">
      <h1 className="text-4xl font-extrabold">Nextjs 스네이크 게임</h1>
      <h2 className='"text-4xl font-extrabold'>{score}</h2>
      <canvas
        ref={canvasRef}
        className="bg-white"
        width={CanvasSize}
        height={CanvasSize}
      />
    </div>
  );
}
