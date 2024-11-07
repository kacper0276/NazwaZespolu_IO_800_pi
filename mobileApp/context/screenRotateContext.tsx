import React, { useContext, useEffect, useState } from "react";
import { ScreenPosition } from "../types/screenPosition.enum";
import { Dimensions } from "react-native";

export interface IScreenRotateContextType {
  orientation: ScreenPosition | null;
  width: number;
  height: number;
}

type Props = {
  children?: React.ReactNode;
};

const ScreenRotateContext = React.createContext<IScreenRotateContextType>({
  orientation: null,
  height: 0,
  width: 0,
});

const ScreenRotateProvider: React.FC<Props> = ({ children }) => {
  const [orientation, setOrientation] = useState<ScreenPosition>(
    ScreenPosition.Horizontal
  );
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  Dimensions.addEventListener("change", ({ window: { height, width } }) => {
    setWidth(width);
    setHeight(height);

    if (width < height) {
      setOrientation(ScreenPosition.Vertical);
    } else {
      setOrientation(ScreenPosition.Vertical);
    }
  });

  useEffect(() => {
    const windowHeight = Dimensions.get("window").height;
    const windowWidth = Dimensions.get("window").width;

    setWidth(windowWidth);
    setHeight(windowHeight);

    if (windowWidth < windowHeight) {
      setOrientation(ScreenPosition.Vertical);
    } else {
      setOrientation(ScreenPosition.Vertical);
    }
  }, []);

  return (
    <>
      <ScreenRotateContext.Provider value={{ orientation, height, width }}>
        {children}
      </ScreenRotateContext.Provider>
    </>
  );
};

const useScreenRotateContext = () =>
  useContext<IScreenRotateContextType>(ScreenRotateContext);

export { ScreenRotateProvider, ScreenRotateContext, useScreenRotateContext };
