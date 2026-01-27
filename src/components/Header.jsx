import { useState } from 'react'
import { cn } from '../lib/utils'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
]

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
            <div className="container-main">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <a href="#home" className="flex items-center gap-3 flex-shrink-0">
                        <div className="size-10 bg-stone-900 rounded-lg flex items-center justify-center">
                            <div className="size-6 bg-accent-500 rounded-sm" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-display font-bold text-lg text-stone-900 leading-tight block">
                                Concrete Works
                            </span>
                            <span className="text-xs text-stone-500 leading-tight">
                                Waco, Texas
                            </span>
                        </div>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-stone-600 hover:text-stone-900 font-medium transition-colors duration-150"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center gap-4">
                        <a
                            href="tel:254-230-3102"
                            className="flex items-center gap-2 text-stone-700 hover:text-accent-600 font-medium transition-colors"
                        >
                            <Phone className="size-4" aria-hidden="true" />
                            <span>(254) 230-3102</span>
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center px-5 py-2.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[44px]"
                        >
                            Free Estimate
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 -mr-2 text-stone-700 hover:text-stone-900"
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <X className="size-6" aria-hidden="true" />
                        ) : (
                            <Menu className="size-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    'lg:hidden overflow-hidden transition-[max-height] duration-200 ease-out',
                    isMenuOpen ? 'max-h-[400px]' : 'max-h-0'
                )}
                aria-hidden={!isMenuOpen}
            >
                <nav className="container-main py-4 border-t border-stone-100" aria-label="Mobile navigation">
                    <ul className="space-y-1">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-3 px-4 text-stone-700 hover:bg-stone-50 hover:text-stone-900 rounded-lg font-medium transition-colors"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                        <a
                            href="tel:254-230-3102"
                            className="flex items-center gap-3 py-3 px-4 text-stone-700 hover:bg-stone-50 rounded-lg font-medium"
                        >
                            <Phone className="size-5" aria-hidden="true" />
                            <span>(254) 230-3102</span>
                        </a>
                        <a
                            href="#contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full text-center py-3 px-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
                        >
                            Get Free Estimate
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    )
}
