import {makeProject} from '@motion-canvas/core';

import imageBending from './scenes/image_bending?scene';
import intro from './scenes/intro?scene';
import textureLoading from './scenes/texture_loading?scene';
import posAndRot from './scenes/pos_and_rot?scene';
import three from './scenes/three?scene';
import pos from './scenes/pos_3d?scene';
import hover from './scenes/hover?scene';
import responsive from './scenes/responsive?scene';
import gallery from './scenes/gallery?scene';

import './global.css';

import audio from "../audio/audio.wav";

export default makeProject({
  scenes: [textureLoading, posAndRot, three, pos, hover, gallery, responsive],
  audio: audio,
});
