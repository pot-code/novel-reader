import React, { useEffect, useState, useReducer } from 'react';
import { Redirect } from 'react-router-dom';

import { UIThemeContext } from '../../theme';
import useRootTheme from '@hooks/useRootTheme';
import NavBar from '../NavBar/NavBar';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import { Themes, Accents, MAX_FONTSIZE, MIN_FONTSIZE, TO_TOP_SCROLL_THRESHOLD } from '../../constants';
import { VsCodeResponseType, ReaderRequestType, IVsCodeMessage, VSCODE_MESSAGE_SOURCE } from '../../shared';
import { scroll_to_top } from '../../util';
import Content from './Content';
import { IReaderData } from '../../types';

enum ReaderActions {
  DATA = 'data'
}

function reader_data_reducer(state: IReaderData, action: { type: string; payload: any }): IReaderData {
  switch (action.type) {
    case ReaderActions.DATA:
      return action.payload;
    default:
      throw new Error(`unsupported action type '${action.type}'`);
  }
}

export default function Reader({ vscode_api }: { vscode_api: IVsCodeApiObject }) {
  const [data, dispatch] = useReducer(reader_data_reducer, {
    title: '',
    lines: [],
    index: -1,
    total: -1
  });
  const [fontsize, set_fontsize] = useState(24);
  const [combo, set_combo] = useRootTheme({
    accents: Accents.PURPLE,
    theme: window.__theme as Themes
  });
  const [redirect, set_redirect] = useState(false);

  function on_window_message(msg: MessageEvent) {
    const msg_data = msg.data;

    if (msg_data.source !== undefined && msg_data.source === VSCODE_MESSAGE_SOURCE) {
      const { type } = msg_data as IVsCodeMessage;
      switch (type) {
        case VsCodeResponseType.DATA:
          const { lines } = msg_data.payload;
          if (lines.length === 0) {
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

  useEffect(() => {
    scroll_to_top();
  }, [data]);

  if (redirect) {
    return <Redirect to="/404" />;
  }

  return (
    <UIThemeContext.Provider value={combo}>
      <Content lines={data.lines} fontsize={fontsize} />
      {data.lines.length > 0 && <ScrollToTop threshold={TO_TOP_SCROLL_THRESHOLD} fill={combo.accents} />}
      <NavBar
        title={data.title}
        fontsize={fontsize}
        progress={{ max: data.total, value: data.index + 1 }}
        change_theme={set_combo}
        change_fontsize={change_fontsize}
        change_page={change_page}
      />
    </UIThemeContext.Provider>
  );
}
