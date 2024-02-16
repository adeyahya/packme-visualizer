import { useEffect, useRef } from "react";

export const useMount = (cb: () => void) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      cb();
      mounted.current = true;
    }
  });
};
