export enum ReaderRequestType {
  DATA = 'data',
  PAGE = 'page',
  INIT = 'init'
}

export enum VsCodeResponseType {
  DATA = 'data',
  THEME = 'theme'
}

export interface IVsCodeMessage {
  source: string;
  type: string;
  payload: any;
}

export const VSCODE_MESSAGE_SOURCE = 'novel-reader';
