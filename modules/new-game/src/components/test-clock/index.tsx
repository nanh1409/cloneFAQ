import { forwardRef, memo, PropsWithoutRef, useEffect, useImperativeHandle, useState } from "react";
import useGameContext from "../../hooks/useGameContext";
import Countdown, { CountdownProps } from "../Countdown";
import ClockIcon from "../icons/ClockIcon";

export type TestClockProps = PropsWithoutRef<CountdownProps & {
  updatePlayedTime?: boolean;
  classes?: {
    root?: string;
    icon?: string;
  }
  gameSettingDuration?: number;
}>;

export type TestClockRef = {
  playedTime: number;
}

const TestClock = memo((props: TestClockProps) => {
  const {
    updatePlayedTime,
    classes = {
      root: "",
      icon: ""
    },
    onChange = () => { },
    gameSettingDuration = 0,
    ...countdownProps
  } = props;
  const { testClockRef } = useGameContext();

  return <div className={classes.root}>
    <ClockIcon className={classes.icon} />
    <Countdown
      {...countdownProps}
      onChange={(timeLeft) => {
        onChange(timeLeft);
        const playedTime = gameSettingDuration - timeLeft;
        testClockRef.current = { playedTime };
      }}
    />
  </div>
}, (prevProps, nextProps) => { 
  const renderProps: Array<keyof TestClockProps> = ["updatePlayedTime", "classes", "color", "defaultTotal", "gameSettingDuration", "id", "stop", "style", "total"]
  // Compare functions 'onChange' and 'onEnd' by reference.
  // const isOnChangeEqual = prevProps.onChange.toString() === nextProps.onChange.toString();
  // const isOnEndEqual = prevProps.onEnd.toString() === nextProps.onEnd.toString();
  return !(renderProps.some(prop => nextProps[prop] !== prevProps[prop]))
});

export default TestClock;