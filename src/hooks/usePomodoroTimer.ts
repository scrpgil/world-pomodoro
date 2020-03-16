import { useState, useEffect } from "react";

export interface PomodoroTimer {
  time: string;
  breakTime: boolean;
}
export function usePomodoroTimer() {
  const calcPomodoroTimer = () => {
    const now = new Date();
    let breakTime = true;
    // 分を25分に直す
    let minute = Math.abs(59 - now.getMinutes());
    if (minute >= 30) {
      minute = minute - 30;
    }
    // 休憩5分対応
    if (minute >= 5) {
      minute = minute - 5;
      breakTime = false;
    }
    let second = Math.abs(59 - now.getSeconds());
    return {
      time: ("0" + minute).slice(-2) + ":" + ("0" + second).slice(-2),
      breakTime: breakTime
    };
  };
  const [pomodoroTimer, setPomodoroTimer] = useState<PomodoroTimer>(
    calcPomodoroTimer()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPomodoroTimer(() => {
        const pTimer = calcPomodoroTimer();
        let breakTimeText = "作業中";
        if (pTimer.breakTime) {
          breakTimeText = "休憩";
        }
        document.title =
          pTimer.time + " " + breakTimeText + " みんなでポモドーロ";
        return pTimer;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return {
    pomodoroTimer,
    setPomodoroTimer
  };
}
