import React, { useEffect } from "react";
import { useState } from "react";
import Image from "react-bootstrap/Image";
import AOS from "aos";
import "aos/dist/aos.css";
import picture1 from "../Images/tictacttoe.png";
import hvcIcon from "../Images/hvc-icon.png";
import startButton from "../Images/startButton.png"

import {
  Link,
} from "react-router-dom";

export const Home = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  // const [board, setBoard] = useState("3x3");

  // const onBoardChange = (e) => {
  //   setBoard(e.target.value);
  // };

  const [mode, setMode] = useState("hvh");

  const onModeChange = (e) => {
    setMode(e.target.value);
  };
  let text = "/tictactoe";
  return (
    <div className="center">
      <p className="title" data-aos="zoom-in">
        TIC TAC TOE
      </p>
      {/* <div class="radio-toolbar mt-5">
        <input
          type="radio"
          id="3x3"
          name="radioBoard"
          value="3x3"
          checked={board === "3x3"}
          onChange={onBoardChange}
        />
        <label for="3x3">3x3</label>

        <input
          type="radio"
          id="5x5"
          name="radioBoard"
          value="5x5"
          checked={board === "5x5"}
          onChange={onBoardChange}
        />
        <label for="5x5">5x5</label>
      </div> */}

      <div className="radio-toolbar mt-3">
        <input
          type="radio"
          id="hvh"
          name="radioStyle"
          value="hvh"
          checked={mode === "hvh"}
          onChange={onModeChange}
        />
        <label for="hvh">
          <Image src={picture1} fluid style={{ maxWidth: "8vh" }} />
        </label>

        <input
          type="radio"
          id="hvc"
          name="radioStyle"
          value="hvc"
          checked={mode === "hvc"}
          onChange={onModeChange}
        />
        <label for="hvc">
          <Image src={hvcIcon} fluid style={{ maxWidth: "8vh" }} />
        </label>
      </div>
        
        <Link to = "/tictactoe">
          <button className="mt-5"><Image src = {startButton} fluid/></button>
        </Link>
    </div>
  );
};
