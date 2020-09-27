import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState, useRef, useReducer } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { motion, AnimatePresence } from 'framer-motion';
import cx from 'classnames';

import { ReactComponent as ArrowUpIcon } from './assets/arrow-up-s-line.svg';
import { ReactComponent as ArrowLeftIcon } from './assets/arrow-left-s-line.svg';
import { ReactComponent as ArrowRightIcon } from './assets/arrow-right-s-line.svg';
import { ReactComponent as PaletteIcon } from './assets/palette.svg';
import { ReactComponent as FontSizeIcon } from './assets/font-size.svg';
import { ReactComponent as AddIcon } from './assets/add-line.svg';
import { ReactComponent as MinusIcon } from './assets/subtract-line.svg';

import { NotFound } from './404';
import { UIThemeContext, builtins } from './theme';
import { useOutsideCheck, useRootTheme } from './hooks';
import {
  IColorPaletteProps,
  IContentProps,
  IFontSizeButtonProps,
  IIconButtonProps,
  INavBarProps,
  IPaletteItemProps,
  IPopoutProps,
  IProgressBarProps,
  IReaderData,
  IThemeCombo,
  IVsCodeMessage
} from './types';
import {
  Themes,
  Accents,
  MAX_FONTSIZE,
  MIN_FONTSIZE,
  TO_TOP_SCROLL_THRESHOLD,
  VSCODE_MESSAGE_SOURCE
} from './constants';
import { VsCodeResponseType, ReaderRequestType } from '@shared/constants';

import './app.scss';

enum ReaderActions {
  DATA = 'data'
}

function ColorPalette({ size = 24, palettes, on_select }: IColorPaletteProps) {
  const origin = size >> 1;
  const radius = size >> 1;

  const PaletteItem = ({ foreground, background, theme }: IPaletteItemProps) => {
    function on_palette_click() {
      if (on_select) {
        on_select(theme);
      }
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="cursor-pointer"
        onClick={on_palette_click || undefined}
      >
        <g transform={`rotate(-45 ${radius} ${radius})`}>
          <circle cx={origin} cy={origin} r={radius} fill={background} />
          <path d={`M 0,${radius} A ${radius} ${radius} 90 0 1 ${size},${radius} L 0,${radius}`} fill={foreground} />
        </g>
      </svg>
    );
  };

  return (
    <div className="grid grid-flow-col gap-2">
      {palettes.map((palette, index) => (
        <PaletteItem
          key={index}
          foreground={palette.foreground}
          background={palette.background}
          theme={palette.theme}
        />
      ))}
    </div>
  );
}

function FontsizeIndicator({
  value,
  on_add,
  fill,
  on_minus
}: {
  value: number;
  fill: string;
  on_add?: () => void;
  on_minus?: () => void;
}) {
  const Btn = ({ children, onClick }: IFontSizeButtonProps) => (
    <button className="p-1 rounded-full focus:outline-none" styleName="btn" onClick={onClick}>
      {children}
    </button>
  );

  return (
    <div className="grid grid-flow-col gap-2 items-center" styleName="fontsize-indicator">
      <Btn onClick={on_add}>
        <AddIcon fill={fill} />
      </Btn>
      <p
        className="text-center select-none"
        style={{
          color: fill,
          width: '2rem'
        }}
      >
        {value}
      </p>
      <Btn onClick={on_minus}>
        <MinusIcon fill={fill} />
      </Btn>
    </div>
  );
}

function IconButton({ Icon, fill, active = false, disabled = false, onClick, ...rest }: IIconButtonProps) {
  return (
    <button
      className="rounded-full p-2"
      styleName={cx('icon-button', {
        'icon-button--disabled': disabled,
        'icon-button--active': active
      })}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      <Icon height="24" width="24" fill={fill} />
    </button>
  );
}

function Popout({ gap = 8, children, style = {}, content }: IPopoutProps) {
  const default_style: React.CSSProperties = {
    position: 'relative'
  };
  const container_ref = useOutsideCheck<HTMLDivElement>(outside_check);
  const [visible, set_visible] = useState(false);
  const triangle_height_ref = useRef('0px');
  const combined_styles = Object.assign(default_style, style);

  function toggle_visible() {
    set_visible(!visible);
  }

  function outside_check(outside: boolean) {
    if (outside) {
      set_visible(false);
    }
  }

  function init_triangle_height() {
    triangle_height_ref.current = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--popout-triangle-height');
  }

  useEffect(() => {
    init_triangle_height();
  }, []);

  return (
    <div ref={container_ref} style={combined_styles}>
      {children(toggle_visible, visible)}
      <AnimatePresence>
        {visible && (
          <motion.div
            styleName="popout"
            style={{
              y: 8,
              opacity: 0,
              x: '-50%',
              top: `calc(100% + ${triangle_height_ref.current} + ${gap}px)`
            }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressBar({ max, value, fill }: IProgressBarProps) {
  return (
    <div styleName="progress">
      <div styleName="track" className="rounded-full" />
      <div
        styleName="bar"
        className="rounded-full"
        style={{
          backgroundColor: fill,
          width: `${(value / max) * 100}%`
        }}
      />
    </div>
  );
}

function NavBar({ title, progress, change_theme, fontsize, change_fontsize, change_page }: INavBarProps) {
  const [bg_visibility, set_bg_visibility] = useState(false);
  const fade_trigger_distance = useRef(0);
  const nav_ref = useRef<HTMLDivElement>(null);
  const toggle_visibility = throttle(
    () => {
      const scroll_top = document.documentElement.scrollTop;
      if (scroll_top >= fade_trigger_distance.current) {
        set_bg_visibility(true);
      } else {
        set_bg_visibility(false);
      }
    },
    100,
    {
      trailing: true
    }
  );
  const palettes = builtins.map((combo) => ({
    foreground: combo.accents,
    background: combo.theme === Themes.LIGHT ? '#FFFFFF' : '#000000',
    theme: combo
  }));
  const can_go_next = progress.value < progress.max;
  const can_go_prev = progress.value > 1;

  useEffect(() => {
    if (nav_ref.current) {
      const $nav = nav_ref.current;
      fade_trigger_distance.current = $nav.offsetTop + $nav.offsetHeight;
    }
    window.addEventListener('scroll', toggle_visibility);
    return () => {
      window.removeEventListener('scroll', toggle_visibility);
    };
  }, []);

  function on_palette_select(theme: IThemeCombo) {
    change_theme(theme);
  }

  function increase_fontsize() {
    change_fontsize(fontsize + 1);
  }

  function decrease_fontsize() {
    change_fontsize(fontsize - 1);
  }

  function next_page() {
    change_page(progress.value);
  }

  function prev_page() {
    change_page(progress.value - 2);
  }

  return (
    <div styleName="nav" ref={nav_ref}>
      <div
        styleName="nav-bg"
        className={cx('transition-opacity duration-300', bg_visibility ? 'opacity-100' : 'opacity-0')}
      />
      <UIThemeContext.Consumer>
        {(theme) => (
          <div className="grid grid-cols-3 items-center px-8 py-4 relative">
            <h1
              styleName="title"
              className="transition-colors duration-300"
              style={{
                color: bg_visibility ? theme.accents : '#898c78'
              }}
            >
              {title}
            </h1>
            <div className="w-10/12 m-auto">
              <ProgressBar {...progress} fill={theme.accents} />
            </div>
            <div className="text-right grid grid-flow-col gap-6 justify-end">
              <Popout content={<ColorPalette palettes={palettes} on_select={on_palette_select} />}>
                {(toggle, visible) => (
                  <IconButton Icon={PaletteIcon} fill={theme.accents} onClick={toggle} active={visible} />
                )}
              </Popout>
              <Popout
                content={
                  <FontsizeIndicator
                    value={fontsize}
                    fill={theme.accents}
                    on_add={increase_fontsize}
                    on_minus={decrease_fontsize}
                  />
                }
              >
                {(toggle, visible) => (
                  <IconButton Icon={FontSizeIcon} fill={theme.accents} onClick={toggle} active={visible} />
                )}
              </Popout>
              <IconButton Icon={ArrowLeftIcon} fill={theme.accents} disabled={!can_go_prev} onClick={prev_page} />
              <IconButton Icon={ArrowRightIcon} fill={theme.accents} disabled={!can_go_next} onClick={next_page} />
            </div>
          </div>
        )}
      </UIThemeContext.Consumer>
    </div>
  );
}

function Content({ lines, fontsize }: IContentProps) {
  return (
    <div styleName="content-container">
      <div
        styleName="content"
        style={{
          fontSize: `${fontsize}px`
        }}
      >
        {lines.map((line, idx) => (
          <p key={idx} className="whitespace-pre-wrap break-all my-3">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function ScrollToTop({ threshold, fill }: { threshold: number; fill: string }) {
  const [visible, set_visible] = useState<boolean>(false);

  const on_window_scroll = debounce(
    () => {
      const view_height = window.innerHeight;
      const scroll_height = document.body.scrollHeight;

      if (view_height >= scroll_height) {
        set_visible(false);
        return;
      }

      const scroll_top = document.documentElement.scrollTop;
      if (scroll_top + view_height + threshold >= scroll_height) {
        set_visible(true);
      } else {
        set_visible(false);
      }
    },
    300,
    {
      trailing: true
    }
  );

  function to_top() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    window.addEventListener('scroll', on_window_scroll);
    return () => {
      window.removeEventListener('scroll', on_window_scroll);
    };
  }, []);

  return (
    <button
      className={cx(
        'rounded-full border-2 border-gray-400 hover:border-gray-600 transition duration-300 fixed',
        visible ? 'opacity-100' : 'opacity-0'
      )}
      styleName="to-top-button"
      onClick={visible ? to_top : undefined}
    >
      <ArrowUpIcon fill={fill} height="24" width="24" />
    </button>
  );
}

function reader_data_reducer(state: IReaderData, action: { type: string; payload: any }): IReaderData {
  switch (action.type) {
    case ReaderActions.DATA:
      const { content: lines, index, total, title } = action.payload;
      return { lines, index, total, title };
    default:
      throw new Error(`unsupported action type '${action.type}'`);
  }
}

function Reader({ vscode_api }: { vscode_api: IVsCodeApiObject }) {
  const [data, dispatch] = useReducer(reader_data_reducer, {
    title: '',
    lines: [],
    index: -1,
    total: -1
  });
  const [fontsize, set_fontsize] = useState(24);
  const [theme, set_theme] = useRootTheme({
    accents: Accents.PURPLE,
    theme: Themes.LIGHT
  });
  const [redirect, set_redirect] = useState(false);

  function on_window_message(msg: MessageEvent) {
    const msg_data = msg.data;

    if (msg_data.source !== undefined && msg_data.source === VSCODE_MESSAGE_SOURCE) {
      const { type } = msg_data as IVsCodeMessage;
      switch (type) {
        case VsCodeResponseType.DATA:
          const { content } = msg_data.payload;
          if (content.length === 0) {
            set_redirect(true);
          } else {
            dispatch({
              type: ReaderActions.DATA,
              payload: msg_data.payload
            });
          }
          break;
        default:
          throw Error(`unsupported message type '${type}'`);
      }
    }
  }

  function change_fontsize(new_size: number) {
    new_size = Math.min(MAX_FONTSIZE, Math.max(MIN_FONTSIZE, new_size));
    set_fontsize(new_size);
  }

  function change_page(new_page: number) {
    vscode_api.postMessage({
      source: VSCODE_MESSAGE_SOURCE,
      type: ReaderRequestType.PAGE,
      payload: new_page
    });
  }

  useEffect(() => {
    window.addEventListener('message', on_window_message);
    // get initial data
    vscode_api.postMessage({
      source: VSCODE_MESSAGE_SOURCE,
      type: ReaderRequestType.INIT,
      payload: null
    });
    return () => {
      window.removeEventListener('message', on_window_message);
    };
  }, []);

  if (redirect) {
    return <Redirect to="/404" />;
  }

  return (
    <UIThemeContext.Provider value={theme}>
      <Content lines={data.lines} fontsize={fontsize} />
      {data.lines.length > 0 && <ScrollToTop threshold={TO_TOP_SCROLL_THRESHOLD} fill={theme.accents} />}
      <NavBar
        title={data.title}
        fontsize={fontsize}
        progress={{ max: data.total, value: data.index + 1 }}
        change_theme={set_theme}
        change_fontsize={change_fontsize}
        change_page={change_page}
      />
    </UIThemeContext.Provider>
  );
}

function App() {
  const vscode_api_ref = useRef(acquireVsCodeApi());

  return (
    <div styleName="app">
      <Router>
        <Switch>
          <Route path="/404">
            <NotFound />
          </Route>
          <Route path="/">
            <Reader vscode_api={vscode_api_ref.current} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default hot(App);
