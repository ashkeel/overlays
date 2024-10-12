const table = document.getElementById("statuses");
const rows: Record<
	string,
	{
		tr: HTMLTableRowElement;
		nameEl: HTMLTableCellElement;
		statusEl: HTMLTableCellElement;
	}
> = {};

export const ok = "#2f6b48";
export const bad = "#77302e";
export const reallybad = "#ec3c45";
export const meh = "#72673c";

export function setRow(
	name: string,
	status: string,
	style: Partial<CSSStyleDeclaration>,
) {
	if (!(name in rows)) {
		// Create elements
		const tr = document.createElement("tr");
		const nameEl = document.createElement("th");
		const statusEl = document.createElement("td");
		// Set hierarchy
		tr.appendChild(nameEl);
		tr.appendChild(statusEl);
		table.appendChild(tr);
		// Add text to name element
		nameEl.appendChild(document.createTextNode(name));
		// Add to row dictionary
		rows[name] = { tr, nameEl, statusEl };
	}
	// Set status
	rows[name].statusEl.innerHTML = status;
	// Set styling
	for (const key in style) {
		rows[name].tr.style[key] = style[key];
		rows[name].nameEl.style[key] = style[key];
		rows[name].statusEl.style[key] = style[key];
	}
}

const buttons = document.getElementById("buttons");
export function addButton(text: string): HTMLButtonElement {
	const el = document.createElement("button");
	el.appendChild(document.createTextNode(text));
	buttons.appendChild(el);
	return el;
}
