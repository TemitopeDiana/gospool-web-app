'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactElement, useState } from 'react';

import SvgIcon from './svg-icon';
import ShowView from './show-view';

interface DropdownProps {
  trigger: string | ReactElement;
  children: ReactElement;
}

const variants = {
  hidden: {
    height: 0,
    marginTop: '0rem',
    opacity: 0,
  },
  visible: {
    height: 'auto',
    marginTop: '1rem',
    opacity: 1,
  },
};

const ExpandableMenu = ({ trigger, children }: DropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-5" onClick={() => setOpen((prev) => !prev)}>
      <button className="flex justify-between items-center gap-3 w-full px-6">
        {trigger}
        <SvgIcon name="arrow-down" className={`${open && 'rotate-180'}`} />
      </button>

      <AnimatePresence>
        <ShowView when={open}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ ease: 'easeInOut', duration: 0.2 }}
            className="px-6 ml-5 "
          >
            {children}
          </motion.div>
        </ShowView>
      </AnimatePresence>
    </div>
  );
};

export default ExpandableMenu;
