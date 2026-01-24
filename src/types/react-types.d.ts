// Ambient type declarations to suppress TypeScript errors for React internal packages
// These are internal to React 18 and don't have separate @types packages

declare module 'react-is' {
  export function isElement(object: any): boolean;
  export function isValidElementType(object: any): boolean;
  export function typeOf(object: any): any;
}

declare module 'use-sync-external-store' {
  export function useSyncExternalStore<T>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => T,
    getServerSnapshot?: () => T
  ): T;
}
