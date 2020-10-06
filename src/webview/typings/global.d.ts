declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare type ReactSVG = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

declare module '*.svg' {
  const content: any;
  export var ReactComponent: ReactSVG;
  export default content;
}

declare interface IVsCodeApiObject {
  postMessage: (msg: any) => void;
  setState: (newState: any) => void;
  getState: () => any;
}

declare interface Window {
  process: {
    env: {
      NODE_ENV: String;
    };
  };
  __theme: string;
}

// under global but not window space
declare function acquireVsCodeApi(): IVsCodeApiObject;
