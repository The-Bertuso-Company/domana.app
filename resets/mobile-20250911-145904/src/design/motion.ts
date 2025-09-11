/* src/design/motion.ts */
import { Easing } from "react-native";

export const motion = {
  duration: {
    xxs: 90,
    xs: 150,
    sm: 200,
    md: 250,
    lg: 350,
    xl: 500,
  },
  easing: {
    standard: Easing.bezier(0.2, 0, 0, 1),
    decel:    Easing.bezier(0, 0, 0.2, 1),
    accel:    Easing.bezier(0.4, 0, 1, 1),
    spring:   Easing.out(Easing.poly(4)),
  },
};
