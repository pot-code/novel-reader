import React, { useEffect, useState, useRef } from 'react';
import throttle from 'lodash/throttle';
import { motion } from 'framer-motion';
import cx from 'classnames';

import { ReactComponent as ArrowLeftIcon } from '@assets/arrow-left-s-line.svg';
import { ReactComponent as ArrowRightIcon } from '@assets/arrow-right-s-line.svg';
import { ReactComponent as PaletteIcon } from '@assets/palette.svg';
import { ReactComponent as FontSizeIcon } from '@assets/font-size.svg';

import { UIThemeContext, builtins } from '../../theme';
import { INavBarProps, IThemeCombo } from '../../types';
import { Themes } from '../../constants';
import IconButton from '../IconButton/IconButton';
import Popout from '../Popout/Popout';
import ProgressBar from '../ProgressBar/ProgressBar';
import ColorPalette from './ColorPalette';
import FontsizeIndicator from './FontsizeIndicator';

import './NavBar.scss';

export default function NavBar({
  title,
  progress,
  change_theme,
  fontsize,
  change_fontsize,
  change_page
}: INavBarProps) {
  const [bg_visible, set_bg_visible] = useState(false);
  const fade_trigger_distance = useRef(0);
  const nav_ref = useRef<HTMLDivElement>(null);
  const container_ref = useRef<HTMLDivElement>(null);
  const toggle_visibility = throttle(
    () => {
      const scroll_top = document.documentElement.scrollTop;
      if (scroll_top >= fade_trigger_distance.current) {
        set_bg_visible(true);
      } else {
        set_bg_visible(false);
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

  function get_fade_distance(): number {
    if (nav_ref.current && container_ref.current) {
      const $nav = nav_ref.current;
      const $container = container_ref.current;
      const nav_style = window.getComputedStyle($nav);
      const container_style = window.getComputedStyle($container);
      return parseInt(container_style.paddingBottom, 10) + parseInt(nav_style.marginBottom, 10);
    }
    return 0;
  }

  useEffect(() => {
    fade_trigger_distance.current = get_fade_distance();
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
    <nav styleName="nav" ref={nav_ref}>
      <motion.div
        styleName="nav-bg"
        animate={{
          y: bg_visible ? 0 : -24
        }}
        className={cx('transition-opacity duration-300', bg_visible ? 'opacity-100' : 'opacity-0')}
      />
      <UIThemeContext.Consumer>
        {(theme) => (
          <div className="grid grid-cols-3 items-center px-8 py-4 relative" ref={container_ref}>
            <h1
              styleName="title"
              className="transition-colors duration-300"
              style={{
                color: bg_visible ? theme.accents : '#898c78'
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
    </nav>
  );
}
