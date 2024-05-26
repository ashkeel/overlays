function toLetters(el: HTMLElement) {
  // Wrap all letters in a span
  // biome-ignore lint/complexity/noForEach: NodeList
  el.childNodes.forEach((child) => {
    child.textContent
      .trim()
      .split('')
      .forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.dataset.index = index.toString();
        el.appendChild(span);
      });
    el.removeChild(child);
  });
}

const transformations = {
  'to-letters': toLetters,
};

function transform(el: HTMLElement) {
  const transformOp = el.dataset.transform;
  if (transformOp && transformOp in transformations) {
    transformations[transformOp](el);
  } else {
    console.warn(`Unknown transform function found: ${el.dataset.transform}`);
  }
}
document.querySelectorAll('*[data-transform]').forEach(transform);
