import { useEffect, useState } from "react";

type CountdownTimerProps = {
  targetDate: Date;
};

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  console.log(targetDate);
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  const [days, hours, minutes, seconds] = getReturnValues(countDown);

  if (days + hours + minutes + seconds <= 0) {
    return <span>expired</span>;
  } else {
    return (
      <span>
        {days}:{hours}:{minutes}:{seconds}
      </span>
    );
  }
}

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};
