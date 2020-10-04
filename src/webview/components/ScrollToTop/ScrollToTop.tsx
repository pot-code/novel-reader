import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import cx from 'classnames';

import { ReactComponent as ArrowUpIcon } from '@assets/arrow-up-s-line.svg';
import { scroll_to_top } from '../../util';

import './ScrollToTop.scss';

export default function ScrollToTop({ threshold, fill }: { threshold: number; fill: string }) {
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

  useEffect(() => {
    window.addEventListener('scroll', on_window_scroll);
    return () => {
      window.removeEventListener('scroll', on_window_scroll);
    };
  }, []);

  return (
    <button
      className={cx(
        'rounded-full border-2 border-gray-300 hover:border-gray-500 transition duration-300 fixed',
        visible ? 'opacity-100' : 'opacity-0'
      )}
      styleName="scroll-to-top"
      onClick={visible ? scroll_to_top : undefined}
    >
      <ArrowUpIcon fill={fill} height="24" width="24" />
    </button>
  );
}
