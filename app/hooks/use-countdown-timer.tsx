import React from "react";

import useInterval from "./use-interval";

function getNowTime() {
  return new Date().getTime();
}

export default function useCountdownTimer(
  endDate: Date | string,
  callback?: Function
) {
  const countDownDate =
    typeof endDate === "string"
      ? new Date(endDate).getTime()
      : endDate.getTime();
  const [remainingMS, setRemainingMS] = React.useState(
    countDownDate - getNowTime()
  );
  const [hasEnded, setHasEnded] = React.useState(false);
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useInterval(
    () => {
      const remaining = countDownDate - getNowTime();
      setHasEnded(remaining <= 1);
      setRemainingMS(remaining);
    },
    hasEnded ? null : 1000
  );

  React.useEffect(() => {
    if (savedCallback.current) {
      savedCallback.current();
    }
  }, [hasEnded]);

  return { remainingMS, ...getRemainingSplit(remainingMS) };
}

const getRemainingSplit = (countDown: number) => {
  // calculate time left
  if (countDown <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};
