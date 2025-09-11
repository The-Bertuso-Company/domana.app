import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

export function useIsOnline() {
  const info = useNetInfo();
  // Treat "unknown" as online to avoid false negatives
  const isConnected = info.isConnected ?? true;
  const isInternetReachable = info.isInternetReachable ?? true;
  return Boolean(isConnected && isInternetReachable);
}

export async function checkIsOnlineOnce(): Promise<boolean> {
  try {
    const s = await NetInfo.fetch();
    return Boolean((s.isConnected ?? true) && (s.isInternetReachable ?? true));
  } catch {
    return true;
  }
}
