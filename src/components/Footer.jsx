import { Phone, Mail, MapPin } from 'lucide-react'
import logoImage from '../assets/images/logo.png'

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
        <footer className="bg-stone-900 text-stone-300 safe-bottom texture-grain-dark relative">
            <div className="container-main section-padding">
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
                        <p className="text-pretty text-stone-400 text-sm leading-relaxed">
                            Serving Central Texas with quality concrete work since 2005.
                            We take pride in craftsmanship that stands the test of time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-stone-400 hover:text-white transition-colors duration-150"
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
                        <ul className="space-y-2 text-stone-400">
                            <li>
                                <a href="/services/concrete-driveways" className="hover:text-white transition-colors">
                                    Concrete Driveways
                                </a>
                            </li>
                            <li>
                                <a href="/services/concrete-patios" className="hover:text-white transition-colors">
                                    Concrete Patios
                                </a>
                            </li>
                            <li>
                                <a href="/services/stamped-concrete" className="hover:text-white transition-colors">
                                    Stamped Concrete
                                </a>
                            </li>
                            <li>
                                <a href="/services/commercial-concrete" className="hover:text-white transition-colors">
                                    Commercial Concrete
                                </a>
                            </li>
                            <li>
                                <a href="/services/concrete-repair" className="hover:text-white transition-colors">
                                    Concrete Repair
                                </a>
                            </li>
                            <li>
                                <a href="/services/concrete-foundations" className="hover:text-white transition-colors">
                                    Concrete Foundations
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Service Areas */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">Service Areas</h3>
                        <ul className="space-y-2 text-stone-400">
                            <li>
                                <a href="/waco-tx-concrete-contractor" className="hover:text-white transition-colors">
                                    Waco
                                </a>
                            </li>
                            <li>
                                <a href="/temple-tx-concrete-contractor" className="hover:text-white transition-colors">
                                    Temple
                                </a>
                            </li>
                            <li>
                                <a href="/killeen-tx-concrete-contractor" className="hover:text-white transition-colors">
                                    Killeen
                                </a>
                            </li>
                            <li>
                                <a href="/hewitt-tx-concrete-contractor" className="hover:text-white transition-colors">
                                    Hewitt
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">Contact Us</h3>
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
                                <span>Waco, Texas<br />& Central Texas Area</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-stone-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
                        <p>© {currentYear} Concrete Works, LLC. All rights reserved.</p>
                        <p className="text-stone-600">
                            Serving Waco, Temple, Killeen, and surrounding Central Texas communities
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
