import { cn } from '../lib/utils'

const variants = {
    primary: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700',
    secondary: 'bg-stone-800 text-white hover:bg-stone-700 active:bg-stone-900',
    outline: 'border-2 border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white',
    ghost: 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
}

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
}

/**
 * Button component with accessible styling
 * @param {Object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'} props.variant
 * @param {'sm'|'md'|'lg'} props.size
 * @param {string} props.className
 * @param {React.ReactNode} props.children
 */
export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2',
                'font-semibold rounded-lg',
                'transition-colors duration-150 ease-out',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                // Minimum touch target for accessibility
                'min-h-[44px] min-w-[44px]',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
