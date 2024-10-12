import { EventEmitter } from "./eventemitter";

interface XLRMessage<T> {
	id: number;
	data: T;
}

export interface Status {
	Status: {
		mixers: Record<
			string,
			{
				fader_status: {
					A: FaderStatus;
					B: FaderStatus;
					C: FaderStatus;
					D: FaderStatus;
				};
			}
		>;
	};
}

export interface FaderStatus {
	channel: string;
	mute_state: "Unmuted" | "MutedToX";
	mute_type: "All";
}

export interface Patch {
	Patch: { op: string; path: string; value: unknown }[];
}

export default class XLRWebSocket extends EventEmitter {
	ws: WebSocket;
	pending: Record<number, (data: unknown) => void> = {};

	constructor(
		private readonly address = "ws://localhost:14564/api/websocket",
		private readonly options?: {
			reconnect?: boolean;
		},
	) {
		super();
		this.options = options || {
			reconnect: true,
		};
	}

	async connect() {
		this.ws = new WebSocket(this.address);
		this.ws.addEventListener("open", this.open.bind(this));
		this.ws.addEventListener("message", this.received.bind(this));
		this.ws.addEventListener("close", this.closed.bind(this));
		this.ws.addEventListener("error", this.errored.bind(this));
		await this.wait();
	}

	private wait(): Promise<void> {
		return new Promise((resolve) => {
			if (this.ws.readyState === this.ws.OPEN) {
				resolve();
				return;
			}
			this.once("open", () => resolve());
		});
	}

	private async open() {
		this.fire("open");
		this.fire("stateChange", this.ws.readyState);
	}

	reconnect(): void {
		this.connect();
	}

	close(): void {
		this.options.reconnect = false;
		this.ws.close();
	}

	send<T, R>(data: XLRMessage<T>): Promise<R> {
		return new Promise((resolve) => {
			this.pending[data.id] = resolve;
			this.ws.send(JSON.stringify(data));
		});
	}

	async status() {
		return this.send<"GetStatus", Status>(
			XLRWebSocket.makeMessage("GetStatus"),
		);
	}

	static makeMessage<T>(msg: T): XLRMessage<T> {
		return {
			id: Date.now() * 1e3 + Math.floor(Math.random() * 1e3),
			data: msg,
		};
	}

	private closed(ev: CloseEvent) {
		console.warn(`lost connection to server: ${ev.reason}`);
		this.fire("close", ev);
		this.fire("stateChange", this.ws.readyState);
		// Try reconnecting after a few seconds
		if (this.options.reconnect) {
			setTimeout(() => this.reconnect(), 5000);
		}
	}

	private errored(ev: Event) {
		this.fire("error", ev);
	}

	private received(event: MessageEvent<string>) {
		const message = JSON.parse(event.data) as XLRMessage<unknown>;
		if (message.id in this.pending) {
			this.pending[message.id](message.data);
			delete this.pending[message.id];
		} else {
			this.fire("patch", message.data);
		}
	}
}
