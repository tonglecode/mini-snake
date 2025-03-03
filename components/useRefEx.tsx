"use client";
import React, { useRef, useState } from "react";

const UseRefEx: React.FC = ({}) => {
  const [count, setCount] = useState(0);
  let letvar = 0;

  const numRef = useRef(0);

  const addHandle = () => {
    setCount((pre) => pre + 1);
    logout();
  };
  const addLetvarHandle = () => {
    letvar += 1;
    logout();
  };
  const addRefHandle = () => {
    numRef.current += 1;
    logout();
  };
  const logout = () => {
    console.log(
      "rendering",
      " useState:",
      count,
      " letvar:",
      letvar,
      " numRef:",
      numRef
    );
  };

  return (
    <div className="flex gap-8">
      <div>
        <div className="text-2xl">count-useState:{count}</div>
        <button className="border-2 rounded-lg p-3" onClick={addHandle}>
          add useState
        </button>
      </div>
      <div>
        <div className="text-2xl">count-let:{letvar}</div>
        <button className="border-2 rounded-lg p-3" onClick={addLetvarHandle}>
          add useState
        </button>
      </div>
      <div>
        <div className="text-2xl">count-useRef:{numRef.current}</div>
        <button className="border-2 rounded-lg p-3" onClick={addRefHandle}>
          add useState
        </button>
      </div>
    </div>
  );
};

export default UseRefEx;
