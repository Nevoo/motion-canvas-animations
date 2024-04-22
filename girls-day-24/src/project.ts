import {makeProject} from '@motion-canvas/core';

import css from './scenes/css?scene';
import html from './scenes/html?scene';
import js from './scenes/js?scene';

export default makeProject({
  scenes: [html, css, js],
});
