import { useState, useEffect } from "react";

export interface PomodoroTimer {
  time: string;
  breakTime: boolean;
  isSound: boolean;
}
export function usePomodoroTimer() {
  // functions
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
      breakTime: breakTime,
      isSound: false
    };
  };
  const pushNotiaction = (breakTime: boolean) => {
    if (window.Notification && Notification.permission === "granted") {
      var title = "";
      var body = "";
      if (breakTime) {
        body = "25 minutes of work done.";
        title = "Time for break";
      } else {
        body = "Your break of 5 minutes is over.";
        title = "Break over";
      }
      var options = {
        body: body
      };
      new Notification(title, options);
    }
  };
  const getBreakTimeText = (breakTime: boolean): string => {
    let breakTimeText = "";
    if (breakTime) {
      breakTimeText = "休憩中";
    } else {
      breakTimeText = "作業中";
    }
    return breakTimeText;
  };

  // useState
  const [pomodoroTimer, setPomodoroTimer] = useState<PomodoroTimer>(
    calcPomodoroTimer()
  );
  const [beforeBreakTimeStatus, setBeforeBreakTimeStatus] = useState<boolean>(
    false
  );

  // useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setPomodoroTimer(() => {
        const pTimer = calcPomodoroTimer();
        let breakTimeText: string = getBreakTimeText(pTimer.breakTime);
        if (pTimer.breakTime !== beforeBreakTimeStatus) {
          setBeforeBreakTimeStatus(pTimer.breakTime);
          pushNotiaction(beforeBreakTimeStatus);
          pTimer.isSound = true;
        }
        document.title =
          pTimer.time + " " + breakTimeText + " みんなでポモドーロ";
        return pTimer;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [beforeBreakTimeStatus]);
  return {
    pomodoroTimer,
    setPomodoroTimer,
    getBreakTimeText
  };
}
