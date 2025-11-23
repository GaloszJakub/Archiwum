import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BentoBoxProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const BentoBox = ({ children, className, delay = 0 }: BentoBoxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay, 
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      className={cn(
        'rounded-lg bg-background-secondary border border-border p-6 hover:border-primary/50 transition-colors duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
