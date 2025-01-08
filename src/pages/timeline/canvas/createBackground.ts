import { CanvasTexture } from 'three';

export const createBackground = () => {
  const canvas = document.createElement('canvas');

  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  const centerX = width / 2;
  const centerY = height;

  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height));
  gradient.addColorStop(0, '#010912');
  gradient.addColorStop(0.4, '#000204');
  gradient.addColorStop(1, '#000000');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return new CanvasTexture(canvas);
};
