"use client";

import NextSnake from "@/lib/next-snake";
import { Score } from "@/lib/next-snake/score";
import { useEffect, useRef, useState } from "react";

// React 컴포넌트
export default function SnakeNewPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<NextSnake | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  //   const globalScore = Score.getInstanc();
  // 게임 초기화 및 시작
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 캔버스 크기 설정
    canvas.width = 600;
    canvas.height = 400;

    gameRef.current = new NextSnake(canvas);

    // 게임 자동 시작 (첫 렌더링 시)
    // if (gameRef.current) {
    //   gameRef.current.start();
    //   setGameStarted(true);
    // }

    // 키보드 이벤트 처리
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRef.current) return;

      // 키 입력 막기 (방향키가 스크롤을 유발하는 것 방지)
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
          " ",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          gameRef.current.changeDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          gameRef.current.changeDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          gameRef.current.changeDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          gameRef.current.changeDirection("RIGHT");
          break;
        case " ":
          // 스페이스바로 시작/재시작
          if (gameRef.current.isOver()) {
            gameRef.current.start();
          }
          break;
      }
    };

    // 키보드 리스너 등록
    window.addEventListener("keydown", handleKeyDown);

    // 점수 업데이트를 위한 인터벌
    const scoreInterval = setInterval(() => {
      if (gameRef.current) {
        if (gameRef.current.isOver()) {
          setGameStarted(false);
        }
        setScore(Score.getInstanc().getScore());
      }
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(scoreInterval);
    };
  }, []);

  // 게임 시작 버튼 클릭 핸들러
  const handleStartClick = () => {
    if (gameRef.current) {
      gameRef.current.start();
      setGameStarted(true);
      if (isFirst) setIsFirst(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 text-indigo-700">Snake Game</h1>

      <div className="mb-4 flex items-center">
        <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md">
          Score: {score}
        </div>

        {!gameStarted && (
          <button
            onClick={handleStartClick}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            {isFirst ? "Start Game" : "Restart Game"}
          </button>
        )}
      </div>

      <div className="border-4 border-indigo-600 rounded-lg shadow-xl overflow-hidden">
        <canvas ref={canvasRef} className="bg-white" />
      </div>

      <div className="mt-4 text-gray-700">
        <h2 className="text-xl font-semibold mb-2">Controls:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Use <span className="font-medium">Arrow Keys</span> or{" "}
            <span className="font-medium">W A S D</span> to move
          </li>
          <li>
            Press <span className="font-medium">Space</span> to restart when
            game is over
          </li>
          <li>Or use the on-screen controls above</li>
        </ul>
      </div>
    </div>
  );
}
