import { useState, useEffect } from "react";

export interface PomodoroTimer {
  time: string;
  break: boolean;
}
export function usePomodoroTimer() {
  const calcPomodoroTimer = () => {
    const now = new Date();
    // 分を25分に直す
    let minute = Math.abs(59 - now.getMinutes());
    if (minute >= 30) {
      minute = minute - 30;
    }
    // 休憩5分対応
    if (minute >= 5) {
      minute = minute - 5;
    }
    let second = Math.abs(59 - now.getSeconds());
    return {
      time: ("0" + minute).slice(-2) + ":" + ("0" + second).slice(-2),
      break: false
    };
  };
  const [pomodoroTimer, setPomodoroTimer] = useState<PomodoroTimer>(
    calcPomodoroTimer()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPomodoroTimer(() => {
        const pTimer = calcPomodoroTimer();
        document.title = pTimer.time + " みんなでポモドーロ";
        return pTimer;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return {
    pomodoroTimer,
    setPomodoroTimer
  };
}
