import { Phone, Mail, MapPin } from 'lucide-react'
import logoImage from '../assets/images/logo.png'
import { locationLinks } from '../data/locationPages'

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'About', href: '/#about' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: '/#contact' },
    { label: 'Blog', href: '/blog' },
]

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-stone-950 text-stone-300 safe-bottom relative overflow-hidden">
            {/* Local texture - subtle horizon silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-64 opacity-[0.03] pointer-events-none">
                <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full">
                    <path fill="currentColor" d="M0,200 L0,120 Q100,100 200,110 T400,100 T600,120 T800,90 T1000,110 T1200,100 L1200,200 Z" />
                </svg>
            </div>

            <div className="container-main section-padding relative z-10">
                <div className="grid gap-12 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="col-span-full lg:col-span-2">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-white rounded-xl p-1.5 shadow-sm">
                                <img
                                    src={logoImage}
                                    alt="Concrete Works LLC"
                                    className="h-12 w-auto"
                                />
                            </div>
                            <div>
                                <div className="font-display font-black text-white text-2xl leading-none">CONCRETE WORKS</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 mt-1">Central Texas Elite</div>
                            </div>
                        </div>
                        <p className="text-pretty text-stone-400 text-lg leading-relaxed mb-8 max-w-md font-light">
                            Mastering McLennan County's black clay soil for over 20 years. 
                            We specialize in decorative and structural concrete that handles 
                            the brutal Texas heat.
                        </p>
                        <div className="flex gap-4">
                            <a href="/#contact" className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-white hover:bg-white/10 transition-colors">
                                Get a Quote
                            </a>
                            <a href="tel:254-230-3102" className="px-6 py-2 bg-accent-500 rounded-lg text-sm font-bold text-white hover:bg-accent-600 transition-colors">
                                Call Steve
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:pl-12">
                        <h3 className="font-display font-bold text-white uppercase tracking-widest text-xs mb-6">Explore</h3>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-stone-500 hover:text-accent-400 transition-colors duration-300 text-sm font-medium"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-display font-bold text-white uppercase tracking-widest text-xs mb-6">Specialties</h3>
                        <ul className="space-y-3 text-stone-500 text-sm font-medium">
                            <li><a href="/services/concrete-driveways" className="hover:text-white transition-colors">Stamped Driveways</a></li>
                            <li><a href="/services/concrete-patios" className="hover:text-white transition-colors">Decorative Patios</a></li>
                            <li><a href="/services/stamped-concrete" className="hover:text-white transition-colors">Stone Patterns</a></li>
                            <li><a href="/services/commercial-concrete" className="hover:text-white transition-colors">Commercial Slabs</a></li>
                            <li><a href="/services/concrete-repair" className="hover:text-white transition-colors">Repair & Resurface</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-display font-bold text-white uppercase tracking-widest text-xs mb-6">Reach Out</h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="tel:254-230-3102"
                                    className="flex items-center gap-4 text-stone-400 hover:text-white transition-colors group"
                                >
                                    <div className="size-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-500/20 group-hover:text-accent-400 transition-all">
                                        <Phone className="size-4" />
                                    </div>
                                    <span className="text-sm font-bold">(254) 230-3102</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:slaconcrete@gmail.com"
                                    className="flex items-center gap-4 text-stone-400 hover:text-white transition-colors group"
                                >
                                    <div className="size-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-500/20 group-hover:text-accent-400 transition-all">
                                        <Mail className="size-4" />
                                    </div>
                                    <span className="text-sm font-bold">Email Steve</span>
                                </a>
                            </li>
                            <li className="flex items-center gap-4 text-stone-400 group">
                                <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <MapPin className="size-4" />
                                </div>
                                <span className="text-sm font-medium">Waco, Texas & Surrounds</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
                        © {currentYear} Concrete Works LLC. Built for the Texas Heat.
                    </p>
                    <div className="flex gap-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700">Licensed</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700">Insured</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700">Local</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}