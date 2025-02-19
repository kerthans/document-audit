// src/components/common/AnimateOnScroll.jsx
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function AnimateOnScroll({ 
  children, 
  className = '', 
  delay = 0,
  animation = 'fadeIn' // Added animation variants support
}) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const animations = {
    fadeIn: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          delay,
          ease: "easeOut"
        }
      }
    },
    slideIn: {
      hidden: { x: -50, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.6,
          delay,
          ease: "easeOut"
        }
      }
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.6,
          delay,
          ease: "easeOut"
        }
      }
    }
  };

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animations[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
}