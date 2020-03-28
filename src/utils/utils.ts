import copy from "copy-text-to-clipboard";
export const convDateFormat = (timeStamp: any) => {
  let dt = new Date();
  if (timeStamp) {
    dt = timeStamp.toDate();
  }
  const y = dt.getFullYear();
  const m = ("00" + (dt.getMonth() + 1)).slice(-2);
  const d = ("00" + dt.getDate()).slice(-2);
  const hour = ("00" + dt.getHours()).slice(-2);
  const minute = ("00" + dt.getMinutes()).slice(-2);
  const second = ("00" + dt.getSeconds()).slice(-2);
  // const msecond = ("00" + dt.getMilliseconds()).slice(-2);
  const result =
    y + "/" + m + "/" + d + " " + hour + ":" + minute + ":" + second;
  // "." +
  // msecond;
  return result;
};

export const copyCommand = (text: any) => {
  copy(text);
};

export const navigatorShare = async (title: string): Promise<boolean> => {
  return new Promise(async resolve => {
    let navigator: any = window.navigator;
    if (navigator && navigator.share) {
      await navigator
        .share({
          url: window.location.href,
          title: title + " | みんなでポモドーロ",
          text: ""
        })
        .then(() => {
          resolve(true);
        })
        .catch((error: any) => {
          console.log("Error sharing", error);
          copyCommand(window.location.href);
          resolve(false);
        });
    } else {
      copyCommand(window.location.href);
      resolve(false);
    }
  });
};

export const pushNotiaction = (title: string, options: any = {}) => {
  if (window.Notification && Notification.permission === "granted") {
    new Notification(title, options);
  }
};

export const playAudio = (src: string) => {
  try {
    var music = new Audio();
    music.preload = "auto";
    music.src = src;
    music.load();

    music.addEventListener("ended", () => {
      music.currentTime = 0;
      music.play();
    });
  } catch (e) {
    console.log(e);
  }
};
