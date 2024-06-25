import { useState } from "react";

interface IProp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  executeAction: (...args: any) => any;
  duration?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}

function useTimeout({ executeAction, duration }: IProp) {
  const [timeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId: NodeJS.Timeout) => clearTimeout(timeoutId));
    setTimeoutIds([]);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callHandler = (...args: any): any => {
    clearAllTimeouts();
    const newTimeoutId = setTimeout(
      () => {
        executeAction(...args);
      },
      duration ? duration : 3000
    );
    setTimeoutIds([newTimeoutId]);
  };

  const callRefuteExe = () => {
    clearAllTimeouts();
  }

  return {
    timeoutIds,
    setTimeoutIds,
    clearAllTimeouts,
    callHandler,
    callRefuteExe
  };
}

export default useTimeout;
