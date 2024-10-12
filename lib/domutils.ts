// Inspired by `make` by Matthew Crumley (silentmatt.com) https://stackoverflow.com/a/2947012
// Licensed under AGPL-3.0, check `LICENSE` for the full text.

type ElementProperties<T extends keyof HTMLElementTagNameMap> = {
	[key in keyof HTMLElementTagNameMap[T]]:
		| HTMLElementTagNameMap[T][key]
		| string;
} & {
	[key in keyof HTMLElementEventMap as `@${key}`]: (
		this: HTMLElement,
		ev: HTMLElementEventMap[key],
	) => void;
};

type DOMElem = Node | string;

type WithClassOrId<T extends keyof HTMLElementTagNameMap> =
	| `${T}#${string}`
	| `${T}.${string}`;

export function $el<T extends keyof HTMLElementTagNameMap>(
	name: T | WithClassOrId<T>,
	...desc: [Partial<ElementProperties<T>>, ...DOMElem[]] | DOMElem[]
): HTMLElementTagNameMap[T] {
	// Take off ID or class from the name
	let elementName = name as string;
	let className = "";
	let id = "";

	if (name.includes("#")) {
		[elementName, id] = name.split("#");
	}

	if (name.includes(".")) {
		[elementName, className] = name.split(".");
	}

	// Create the element and add the attributes (if found)
	const el = document.createElement(elementName as T);
	if (className) {
		el.className = className;
	}
	if (id) {
		el.id = id;
	}

	const attributes = desc[0];
	if (typeof attributes === "object" && !(attributes instanceof Node)) {
		for (const attr in attributes) {
			const value = (attributes as Record<string, unknown>)[attr];
			if (attr.startsWith("@")) {
				el.addEventListener(
					attr.substring(1),
					value as EventListenerOrEventListenerObject,
				);
			} else if (attr === "dataset") {
				for (const key in value as Record<string, unknown>) {
					el.dataset[key] = value[key];
				}
			} else {
				el[attr as keyof HTMLElementTagNameMap[T]] =
					value as HTMLElementTagNameMap[T][keyof HTMLElementTagNameMap[T]];
			}
		}
		desc.shift();
	}

	for (const item of desc as DOMElem[]) {
		el.appendChild(item instanceof Node ? item : document.createTextNode(item));
	}

	return el;
}

export default $el;
