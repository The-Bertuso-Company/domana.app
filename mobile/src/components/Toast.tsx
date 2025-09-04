/* src/components/Toast.tsx */
import * as React from "react";
import { Animated, View, Text, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@/src/components/Icon";
import { c } from "@/src/design/theme";
import { useScheme } from "@/src/hooks/useScheme";
import { motion } from "@/src/design/motion";

export type Variant = "info" | "success" | "warning" | "error";
export type ToastOptions = {
  message: string;
  title?: string;
  variant?: Variant;
  duration?: number;
  icon?: string;
};

type Ctx = { show(o: ToastOptions): void; hide(): void };
const ToastCtx = React.createContext<Ctx | null>(null);
export const useToast = () => {
  const v = React.useContext(ToastCtx);
  if (!v) throw new Error("useToast must be inside <ToastProvider/>");
  return v;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const scheme = useScheme();
  const colors = c(scheme);
  const insets = useSafeAreaInsets();

  const [visible, setVisible] = React.useState(false);
  const [state, setState] = React.useState<ToastOptions>({ message: "" });

  const y = React.useRef(new Animated.Value(-80)).current;
  const op = React.useRef(new Animated.Value(0)).current;

  const palette = {
    info:    { bg: colors.brand.hex,    fg: (colors as any).onBrand?.hex ?? "#fff" },
    success: { bg: colors.success?.hex ?? "#10B981", fg: "#fff" },
    warning: { bg: colors.warning?.hex ?? "#F59E0B", fg: "#111" },
    error:   { bg: colors.error?.hex   ?? "#EF4444", fg: "#fff" },
  } as const;

  const slideIn = () =>
    Animated.parallel([
      Animated.timing(y, { toValue: 0, duration: motion.duration.sm, easing: motion.easing.decel, useNativeDriver: true }),
      Animated.timing(op, { toValue: 1, duration: motion.duration.sm, easing: Easing.linear,      useNativeDriver: true }),
    ]).start();

  const slideOut = (cb?: () => void) =>
    Animated.parallel([
      Animated.timing(y, { toValue: -80, duration: motion.duration.xs, easing: motion.easing.accel, useNativeDriver: true }),
      Animated.timing(op, { toValue: 0,  duration: motion.duration.xs, easing: Easing.linear,       useNativeDriver: true }),
    ]).start(() => cb?.());

  const show: Ctx["show"] = (o) => {
    const merged = { variant: "info" as Variant, duration: 2000, ...o };
    setState(merged);
    setVisible(true);
    y.setValue(-80); op.setValue(0);
    slideIn();
    if (merged.duration) setTimeout(() => hide(), merged.duration);
  };

  const hide: Ctx["hide"] = () => slideOut(() => setVisible(false));

  const tint = palette[(state.variant ?? "info") as Variant];

  return (
    <ToastCtx.Provider value={{ show, hide }}>
      {children}
      <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
        <Animated.View style={{ transform: [{ translateY: y }], opacity: op, paddingTop: insets.top + 8 }}>
          {visible && (
            <View
              style={{
                marginHorizontal: 16,
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 14,
                backgroundColor: tint.bg,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              {state.icon ? <Icon name={state.icon as any} size={18} color={tint.fg} /> : null}
              <View style={{ flex: 1 }}>
                {state.title ? <Text style={{ color: tint.fg, fontWeight: "700", marginBottom: 2 }}>{state.title}</Text> : null}
                <Text style={{ color: tint.fg }}>{state.message}</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </ToastCtx.Provider>
  );
}

export function toastFromError(toast: { show: (o: ToastOptions)=>void }, err: unknown, fallback = "Something went wrong") {
  try {
    if (typeof err === "string") {
      toast.show({ title: "Error", message: err, variant: "error", icon: "alert-circle" });
      return;
    }
    if (err && typeof err === "object") {
      // @ts-ignore Response-like
      if ("ok" in err && err.ok === false && "status" in err) {
        const r: any = err;
        const msg = r.statusText || fallback;
        toast.show({ title: `Error ${r.status}`, message: msg, variant: "error", icon: "alert-circle" });
        return;
      }
      if ("message" in err && typeof (err as any).message === "string") {
        toast.show({ title: "Error", message: (err as any).message, variant: "error", icon: "alert-circle" });
        return;
      }
    }
  } catch {}
  toast.show({ title: "Error", message: fallback, variant: "error", icon: "alert-circle" });
}
