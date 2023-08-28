import { PropsWithoutRef, useEffect, useState } from "react";
import snowImg from "./snow.png";
import "./style.scss";

const AnimationSnowFlake = (props: PropsWithoutRef<{ hidden?: boolean; }>) => {
  useEffect(() => {
    if (!props.hidden) {
      const snowPanel = document.getElementById("snowflakes");
      if (snowPanel) {
        for (let i = 1; i <= 30; i++) {
          const div = document.createElement('div');
          div.className = 'snowflake';
          div.style.backgroundImage = `url(${(snowImg as any).src})`;
          let size = Math.floor(Math.random() * 10) + 15;
          div.style.width = size + 'px';
          div.style.height = size + 'px';
          snowPanel.appendChild(div);
        }
      }
    }
  }, [props.hidden]);
  return <div id="snowflakes" area-hidden="true" />
}

export default AnimationSnowFlake;