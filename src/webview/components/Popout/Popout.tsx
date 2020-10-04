import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import useOutsideCheck from '@hooks/useOutsideCheck';
import { IPopoutProps } from '../../types';

import './Popout.scss';

export default function Popout({ gap = 8, children, style = {}, content }: IPopoutProps) {
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
