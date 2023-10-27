export class EventEmitter extends EventTarget {
  on(eventName: string, listener: EventListenerOrEventListenerObject) {
    return this.addEventListener(eventName, listener);
  }
  once(eventName: string, listener: EventListenerOrEventListenerObject) {
    return this.addEventListener(eventName, listener, { once: true });
  }
  off(eventName: string, listener: EventListenerOrEventListenerObject) {
    return this.removeEventListener(eventName, listener);
  }
  protected fire<T>(eventName: string, detail?: T) {
    return this.dispatchEvent(
      new CustomEvent(eventName, { detail, cancelable: true })
    );
  }
}
