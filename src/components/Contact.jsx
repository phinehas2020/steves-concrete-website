import { motion } from 'motion/react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { fadeInUp, fadeInLeft, fadeInRight, viewportConfig } from '../lib/animations'
import { ContactForm } from './ContactForm'

export function Contact() {
    return (
        <section id="contact" className="section-padding bg-white">
            <div className="container-main">
                <div className="grid gap-8 lg:gap-16 lg:grid-cols-2">
                    {/* Left Column - Info */}
                    <motion.div
                        variants={fadeInLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                    >
                        <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                            Contact Us
                        </span>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                            Ready to Start Your Project?
                        </h2>
                        <p className="text-lg text-stone-600 text-pretty mb-8">
                            Get in touch for a free estimate. We'll discuss your project
                            needs and provide an honest, competitive quote.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-4 mb-8">
                            <a
                                href="tel:254-230-3102"
                                className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors group"
                            >
                                <div className="size-12 flex items-center justify-center bg-accent-500 text-white rounded-lg">
                                    <Phone className="size-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <div className="font-semibold text-stone-900 group-hover:text-accent-600 transition-colors">
                                        (254) 230-3102
                                    </div>
                                    <div className="text-sm text-stone-500">Call or text anytime</div>
                                </div>
                            </a>

                            <a
                                href="mailto:slaconcrete@gmail.com"
                                className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors group"
                            >
                                <div className="size-12 flex items-center justify-center bg-stone-800 text-white rounded-lg">
                                    <Mail className="size-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <div className="font-semibold text-stone-900 group-hover:text-accent-600 transition-colors">
                                        slaconcrete@gmail.com
                                    </div>
                                    <div className="text-sm text-stone-500">Email us anytime</div>
                                </div>
                            </a>

                            <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                                <div className="size-12 flex items-center justify-center bg-stone-600 text-white rounded-lg">
                                    <MapPin className="size-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <div className="font-semibold text-stone-900">Service Area</div>
                                    <div className="text-sm text-stone-500">
                                        Waco, Temple, Killeen & Central Texas
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="p-6 bg-stone-900 text-white rounded-xl">
                            <h3 className="font-display font-semibold text-lg mb-3">Business Hours</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Monday - Friday</span>
                                    <span>7:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Saturday</span>
                                    <span>8:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Sunday</span>
                                    <span>By Appointment</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Form */}
                    <motion.div
                        className="bg-stone-50 rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10"
                        variants={fadeInRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                    >
                        <ContactForm />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
