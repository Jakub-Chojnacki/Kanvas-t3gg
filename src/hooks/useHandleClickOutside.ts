import React, { useEffect, useRef } from "react";

const useHandleClickOutside = (
  ref: React.MutableRefObject<HTMLElement | undefined | null>,
  callback: () => void
) => {

  useEffect(() => {
    const handleClick = ({ target }: MouseEvent) => {
      if (ref.current && !ref.current.contains(target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref]);

  return ref;
};

export default useHandleClickOutside;
