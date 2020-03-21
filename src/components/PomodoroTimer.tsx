import React from "react";
import "./PomodoroTimer.css";

interface ContainerProps {
  time: string;
  breakTime: boolean;
}

const PomodoroTimer: React.FC<ContainerProps> = ({ time, breakTime }) => {
  return (
    <div className="pomodoro-timer-wrapper">
      <div className="timer">
        <i className={breakTime ? "status break-time" : "status"} />
        {time}
      </div>
    </div>
  );
};

export default PomodoroTimer;
