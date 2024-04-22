import type {View2D} from '@motion-canvas/2d/lib/components';

export function applyViewStyles(view: View2D) {
  view.lineHeight(64);
}

export const Colors = {
  whiteLabel: 'rgba(255, 255, 255, 0.54)',
  blackLabel: 'rgba(0, 0, 0, 0.87)',
  background: '#0f0e17',

//   TEXT: '#ACB3BF',
//   FUNCTION: '#ffc66d',
//   STRING: '#99C47A',
//   NUMBER: '#68ABDF',
//   PROPERTY: '#AC7BB5',
//   COMMENT: '#808586',

  MAIN: '#fffffe',
  PARAGRAPH: '#a7a9be',
  HIGHLIGHT: '#ff8906',
  SECONDARY: '#f25f4c',
  TERTIARY: '#e53170',

  red: '#ef5350',
  green: '#8bc34a',
  blue: '#2196f3',
};

export const BaseFont = {
  fontFamily: 'Red Hat Text',
  fontWeight: 700,
  fontSize: 28,
};

export const WhiteLabel = {
  ...BaseFont,
  fill: Colors.MAIN,
};

export const BlackLabel = {
  ...BaseFont,
  fill: Colors.background,
};
