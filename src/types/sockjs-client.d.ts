/**
 * Type declarations for sockjs-client
 */

declare module 'sockjs-client' {
  interface SockJSOptions {
    server?: string
    sessionId?: number | (() => string)
    transports?: string | string[]
    timeout?: number
    forceJSONP?: boolean
  }

  interface SockJSClass {
    new (url: string, _reserved?: any, options?: SockJSOptions): SockJS
    CONNECTING: number
    OPEN: number
    CLOSING: number
    CLOSED: number
  }

  interface SockJS extends EventTarget {
    readyState: number
    protocol: string
    url: string
    onopen: ((event: Event) => void) | null
    onclose: ((event: CloseEvent) => void) | null
    onmessage: ((event: MessageEvent) => void) | null
    onerror: ((event: Event) => void) | null
    
    send(data: string): void
    close(code?: number, reason?: string): void
    
    addEventListener<K extends keyof WebSocketEventMap>(
      type: K,
      listener: (this: SockJS, ev: WebSocketEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void
    
    removeEventListener<K extends keyof WebSocketEventMap>(
      type: K,
      listener: (this: SockJS, ev: WebSocketEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void
  }

  const SockJS: SockJSClass
  export = SockJS
}
