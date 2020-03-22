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

export const navigatorShare = (title: string) => {
  let navigator: any = window.navigator;
  if (navigator && navigator.share) {
    navigator
      .share({
        url: window.location.href,
        title: title + " | みんなでポモドーロ",
        text: ""
      })
      .then(() => console.log("Successful share"))
      .catch((error: any) => {
        console.log("Error sharing", error);
        copyCommand(window.location.href);
      });
  } else {
    copyCommand(window.location.href);
  }
};
