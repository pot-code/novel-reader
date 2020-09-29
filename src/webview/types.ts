import { Accents, Themes } from './constants';

export interface IFontSizeButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export interface INavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  fontsize: number;
  change_theme: (theme: IThemeCombo) => void;
  change_fontsize: (size: number) => void;
  change_page: (page: number) => void;
  progress: {
    max: number;
    value: number;
  };
}

export interface IContentProps extends React.HTMLAttributes<HTMLDivElement> {
  lines: string[];
  fontsize: number;
}

export interface IReaderData {
  index: number;
  total: number;
  title: string;
  lines: string[];
}

export interface IProgressBarProps {
  max: number;
  value: number;
  fill: string;
}

export interface IIconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  Icon: ReactSVG;
  fill: string;
  active?: boolean;
  disabled?: boolean;
}

export interface IPopoutProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number;
  content: (() => React.ReactNode) | React.ReactNode;
  children: (toggle: () => void, visible: boolean) => React.ReactNode;
}

export interface IPaletteItemProps {
  foreground: string;
  background: string;
  theme: IThemeCombo;
}

export interface IColorPaletteProps {
  size?: number;
  palettes: IPaletteItemProps[];
  on_select?: (palette: IThemeCombo) => void;
}

export interface IThemeCombo {
  accents: Accents;
  theme: Themes;
}
