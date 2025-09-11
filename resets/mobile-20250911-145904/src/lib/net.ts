import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
export function useOnline() {
  const [isOnline, setOnline] = useState(true);
  useEffect(() => {
    const sub = NetInfo.addEventListener((s) => {
      setOnline(!(s.isInternetReachable === false || s.type === "none" || s.type === "unknown"));
    });
    NetInfo.fetch().then((s)=>{
      const online = !(s.isInternetReachable === false || s.type === "none" || s.type === "unknown");
      setOnline(online);
    });
    return () => { if (typeof sub === "function") sub(); };
  }, []);
  return isOnline;
}
