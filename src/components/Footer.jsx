import { Phone, Mail, MapPin } from 'lucide-react'
import logoImage from '../assets/images/logo.png'
import { locationLinks } from '../data/locationPages'

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
    { label: 'Blog', href: '/blog' },
]

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-stone-900 text-stone-300 safe-bottom relative overflow-hidden">
            {/* Local texture - subtle horizon silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.02] pointer-events-none">
                <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full">
                    <path fill="currentColor" d="M0,200 L0,120 Q100,100 200,110 T400,100 T600,120 T800,90 T1000,110 T1200,100 L1200,200 Z" />
                </svg>
            </div>

            <div className="container-main section-padding relative z-10">
                <div className="grid gap-8 sm:gap-12 grid-cols-2 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-1">
                        <div className="mb-4">
                            <img
                                src={logoImage}
                                alt="Concrete Works LLC"
                                className="h-20 w-auto rounded-lg"
                            />
                        </div>
                        <p className="text-pretty text-stone-400 text-sm leading-relaxed mb-4">
                            Professional concrete contractor serving McLennan County and surrounding 
                            areas since 2005. Built on black clay soil, engineered for Texas heat.
                        </p>
                        <p className="text-xs text-stone-500">
                            Locally owned & operated in Waco, TX
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">Navigate</h3>
                        <ul className="space-y-2">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-stone-400 hover:text-white transition-colors duration-150 text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">Services</h3>
                        <ul className="space-y-2 text-stone-400 text-sm">
                            <li>
                                <a href="/services/concrete-driveways" className="hover:text-white transition-colors">
                                    Driveways
                                </a>
                            </li>
                            <li>
                                <a href="/services/concrete-patios" className="hover:text-white transition-colors">
                                    Patios
                                </a>
                            </li>
                            <li>
                                <a href="/services/stamped-concrete" className="hover:text-white transition-colors">
                                    Stamped Concrete
                                </a>
                            </li>
                            <li>
                                <a href="/services/commercial-concrete" className="hover:text-white transition-colors">
                                    Commercial
                                </a>
                            </li>
                            <li>
                                <a href="/services/concrete-repair" className="hover:text-white transition-colors">
                                    Repair & Resurfacing
                                </a>
                            </li>
                            <li>
                                <a href="/services/concrete-foundations" className="hover:text-white transition-colors">
                                    Foundations
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Service Areas */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">Service Area</h3>
                        <p className="text-xs text-stone-500 mb-3">Within 50 miles of Waco, TX:</p>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-stone-400 text-sm">
                            {locationLinks.map((location) => (
                                <li key={location.slug}>
                                    <a href={`/${location.slug}`} className="hover:text-white transition-colors">
                                        {location.city}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="tel:254-230-3102"
                                    className="flex items-center gap-3 text-stone-400 hover:text-accent-400 transition-colors"
                                >
                                    <Phone className="size-4 flex-shrink-0" aria-hidden="true" />
                                    <span>(254) 230-3102</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:slaconcrete@gmail.com"
                                    className="flex items-center gap-3 text-stone-400 hover:text-accent-400 transition-colors"
                                >
                                    <Mail className="size-4 flex-shrink-0" aria-hidden="true" />
                                    <span>slaconcrete@gmail.com</span>
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-stone-400">
                                <MapPin className="size-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                <span>Waco, Texas<br />McLennan County</span>
                            </li>
                        </ul>

                        <div className="mt-6 pt-6 border-t border-stone-800">
                            <p className="text-xs text-stone-500">
                                <strong className="text-stone-400">Hours:</strong><br />
                                Mon-Fri: 7am - 6pm<br />
                                Sat: 8am - 4pm
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-stone-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
                        <p>© {currentYear} Concrete Works, LLC. All rights reserved.</p>
                        <p className="text-stone-600">
                            Licensed concrete contractor serving Central Texas since 2005
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
