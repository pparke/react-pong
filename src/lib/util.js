

export function onHidden(hidden, visible) {
  if (typeof visible !== 'function') {
    hidden = visible;
  }
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      hidden();
    }
    else {
      visible();
    }
  });
}

/**
 * Create a new canvas element with the given width and height
 */
export function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
