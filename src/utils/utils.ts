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

export const autoLinker = (str: string): string => {
  var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g; // ']))/;
  var regexp_makeLink = (_: any, url: string, __: any, href: string) => {
    return '<a target="_blank" href="h' + href + '">' + url + "</a>";
  };

  return str.replace(regexp_url, regexp_makeLink);
};

export const replaceAnchor = (value: string): string => {
  value = value.replace(/</g, "&lt;");
  var regexp_url = />>([0-9]*)/g; // ']))/;
  var regexp_makeLink = (_: any, url: string, ___: any, ____: string) => {
    return '<a href="#no' + url + '">>>' + url + "</a>";
  };
  return value.replace(regexp_url, regexp_makeLink);
};

export const replaceImage = (str: string): string => {
  const splits = str.match(
    /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+).(png|jpg|jpeg|gif))/g
  );
  if (!splits) {
    return "";
  }
  let anchors = "";
  for (let idx = 0; idx < splits.length; idx++) {
    const href = splits[idx];
    const image =
      '<a class="autolink-image-wrapper" target="_blank" href="h' +
      href +
      '"><img class="autolink-image" style="height:150px" src="h' +
      href +
      '"/></a>';
    anchors = anchors + image;
  }
  return anchors;
};
