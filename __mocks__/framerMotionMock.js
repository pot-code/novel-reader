const AnimatePresence = jest.fn(({ children }) => children);
const motion = {
  div: jest.fn(({ children }) => children || null)
};

export { AnimatePresence, motion };
