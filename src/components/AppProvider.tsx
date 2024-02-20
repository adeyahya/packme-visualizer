import { ReactNode, createContext, useCallback, useState } from "react";
import uniqolor from "uniqolor";

type ColorMap = Map<string, string>;

const stub = () => {};

export const AppContext = createContext<{
  colorMap: ColorMap;
  setColorMap: (id: string, c: string) => void;
  deleteColorMap: (id: string) => void;
}>({
  colorMap: new Map(),
  setColorMap: stub,
  deleteColorMap: stub,
});

function AppProvider(props: { children: ReactNode }) {
  const [cMapState, setCMap] = useState<Map<string, string>>(
    new Map([["item 1", uniqolor("item 1").color]])
  );

  const setColorMap = useCallback((id: string, c: string) => {
    setCMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, c);
      return newMap;
    });
  }, []);

  const deleteColorMap = useCallback((id: string) => {
    setCMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{ colorMap: cMapState, setColorMap, deleteColorMap }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export default AppProvider;
