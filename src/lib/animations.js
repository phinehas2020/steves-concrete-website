/**
 * Framer Motion Animation Utilities
 * Staggered reveals, scroll-triggered animations, and micro-interactions
 */

// ========================================
// FADE & SLIDE VARIANTS
// ========================================

// Fade up animation for sections
export const fadeInUp = {
    hidden: {
        opacity: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

// Fade in from left
export const fadeInLeft = {
    hidden: {
        opacity: 0,
        x: -40
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

// Fade in from right
export const fadeInRight = {
    hidden: {
        opacity: 0,
        x: 40
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

// Simple fade
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    }
}

// Scale up with fade
export const scaleIn = {
    hidden: {
        opacity: 0,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}


// ========================================
// STAGGER CONTAINER VARIANTS
// ========================================

// Parent container for staggered children - Fast
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
}

// Slower stagger for more dramatic reveals
export const staggerContainerSlow = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
}

// Hero-specific stagger (faster for impact)
export const heroStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
}


// ========================================
// CHILD ITEM VARIANTS
// ========================================

// Default stagger child
export const staggerItem = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

// Card hover animation
export const cardHover = {
    rest: {
        scale: 1,
        y: 0,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    },
    hover: {
        scale: 1.02,
        y: -4,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    }
}

// Gallery card with lift and shadow
export const galleryCardHover = {
    rest: {
        scale: 1,
        y: 0,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
    },
    hover: {
        scale: 1.03,
        y: -8,
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        transition: {
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

// Icon scale on hover
export const iconPop = {
    rest: { scale: 1, rotate: 0 },
    hover: {
        scale: 1.15,
        transition: {
            duration: 0.2,
            ease: 'easeOut'
        }
    }
}


// ========================================
// SCROLL-TRIGGERED VIEWPORT CONFIG
// ========================================

// Default viewport settings for scroll animations
export const viewportConfig = {
    once: true,
    amount: 0.2,
    margin: '-50px'
}

// More eager trigger (for above-the-fold content)
export const viewportEager = {
    once: true,
    amount: 0.1,
    margin: '0px'
}

// Lazy trigger (for content deep in viewport)
export const viewportLazy = {
    once: true,
    amount: 0.3,
    margin: '-100px'
}


// ========================================
// SPECIAL EFFECTS
// ========================================

// Number count-up utility (returns animation values)
export const countUpConfig = {
    duration: 2,
    ease: [0.25, 0.46, 0.45, 0.94]
}

// Pulse animation for attention-grabbing elements
export const pulse = {
    scale: [1, 1.02, 1],
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
    }
}

// Shimmer/Loading state
export const shimmer = {
    x: ['-100%', '100%'],
    transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
    }
}


// ========================================
// PAGE TRANSITION
// ========================================

export const pageTransition = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
}
