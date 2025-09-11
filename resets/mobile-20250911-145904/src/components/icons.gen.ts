// AUTO-GENERATED - do not edit
import React from 'react';
import type { SvgProps } from 'react-native-svg';
import I_bell from '../icons/bell.svg';
import I_check from '../icons/check.svg';
import I_chevron_left from '../icons/chevron-left.svg';
import I_chevron_right from '../icons/chevron-right.svg';
import I_close from '../icons/close.svg';
import I_home from '../icons/home.svg';
import I_menu from '../icons/menu.svg';
import I_minus from '../icons/minus.svg';
import I_plus from '../icons/plus.svg';
import I_search from '../icons/search.svg';
import I_user from '../icons/user.svg';

export const ICONS = {
  'bell': I_bell,
  'check': I_check,
  'chevron-left': I_chevron_left,
  'chevron-right': I_chevron_right,
  'close': I_close,
  'home': I_home,
  'menu': I_menu,
  'minus': I_minus,
  'plus': I_plus,
  'search': I_search,
  'user': I_user
} as const;

export type IconName = keyof typeof ICONS;
export type IconComponent = React.FC<SvgProps>;
