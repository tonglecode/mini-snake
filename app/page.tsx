"use client";
import Snake from "@/lib/snake.class";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [score, setScore] = useState(0);
  const CanvasSize = 400;
  const CellSize = 10;

  const gameSpeed = 400;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clicked = useRef(false);

  //   const snakeRef = useRef([{ x: 200, y: 200 }]);
  // snakeInstance.current
  const { current: snake } = useRef(
    new Snake({ x: 200, y: 200 }, { dx: 0, dy: -10 }, CellSize, CanvasSize)
  );
  //   const directionRef = useRef({ dx: 0, dy: -10 });
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
          setInterval(() => {
            clearCanvas(ctx);
            snake.rateMove();
            drawSnake(ctx);
            drawFood(ctx);
          }, gameSpeed / CellSize);
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
      clicked.current = false;
      clearCanvas(ctx);
      snake.move();

      drawSnake(ctx);

      const head = snake.getSegments()[0];
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        snake.grow();
        setScore((prev) => prev + 10);
        generateFood(ctx);
      }

      drawFood(ctx);
    }, 0);

    if (snake.checkCollision()) {
      clearInterval(gameIntervalRef.current as NodeJS.Timeout);
      alert("게임 오버");
    }
    // 다음 프레임 요청
  };
  const changeDirection = (e: KeyboardEvent) => {
    if (clicked.current) return;
    const { dx, dy } = snake.getDirection();
    switch (e.key) {
      case "ArrowUp":
      case "w":
        clicked.current = true;
        if (dy == 0) {
          snake.setDirection({ dx: 0, dy: -CellSize });
        }
        break;
      case "ArrowDown":
      case "s":
        clicked.current = true;
        if (dy == 0) {
          snake.setDirection({ dx: 0, dy: CellSize });
        }
        break;
      case "ArrowLeft":
      case "a":
        clicked.current = true;
        if (dx == 0) {
          snake.setDirection({ dx: -CellSize, dy: 0 });
        }
        break;
      case "ArrowRight":
      case "d":
        clicked.current = true;
        if (dx == 0) {
          snake.setDirection({ dx: CellSize, dy: 0 });
        }
        break;
      default:
        break;
    }
  };

  const drawSnake = (ctx: CanvasRenderingContext2D) => {
    snake.getSegments().forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = "#ff6000";
        ctx.strokeStyle = "#ff6000";
      } else {
        ctx.fillStyle = "lightblue";
        ctx.strokeStyle = "lightblue";
      }
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
