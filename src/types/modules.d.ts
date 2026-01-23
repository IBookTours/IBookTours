// ============================================
// MODULE TYPE DECLARATIONS
// ============================================
// Type declarations for modules that don't have their own types

// Fix for 'shallow-equals' module type definition error
declare module 'shallow-equals' {
  function shallowEquals<T>(a: T, b: T): boolean;
  export default shallowEquals;
}

// SCSS Modules - Allow importing .module.scss files
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// SVG imports as React components
declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

// Image imports
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}
