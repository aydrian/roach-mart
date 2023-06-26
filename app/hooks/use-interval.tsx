// https://www.joshwcomeau.com/snippets/react-hooks/use-interval/
import React from "react";

export default function useInterval(callback: Function, delay: null | number) {
  const intervalRef = React.useRef<null | number>(null);
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === "number") {
      intervalRef.current = window.setInterval(tick, delay);
      return () => window.clearInterval(intervalRef.current ?? undefined);
    }
  }, [delay]);
  return intervalRef;
}
