// https://stackoverflow.com/a/2947012
export type DOMParam = string | Record<string, any> | [string, ...DOMParam[]];

export function makeDOM(...desc: [string, ...DOMParam[]]): HTMLElement {
  const name = desc[0];
  const attributes = desc[1];

  const el = document.createElement(name);

  let start = 1;
  if (
    typeof attributes === 'object' &&
    attributes !== null &&
    !Array.isArray(attributes)
  ) {
    Object.keys(attributes).forEach((attr) => {
      if (attr.startsWith('@')) {
        el.addEventListener(attr.substr(1), attributes[attr]);
      } else {
        if (attr.startsWith('data-')) {
          el.dataset[attr.substring(5)] = attributes[attr];
        }
        el[attr] = attributes[attr];
      }
    });
    start = 2;
  }

  for (let i = start; i < desc.length; i += 1) {
    if (Array.isArray(desc[i])) {
      el.appendChild(makeDOM.apply(this, desc[i]));
    } else if (desc[i] instanceof Node) {
      el.appendChild(desc[i] as Node);
    } else {
      el.appendChild(document.createTextNode(desc[i] as string));
    }
  }

  return el;
}

export const $el = makeDOM;
