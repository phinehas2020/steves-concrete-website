import { motion } from 'motion/react'
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react'
import { fadeInUp, viewportConfig } from '../lib/animations'
import { ContactForm } from './ContactForm'

const whatToExpect = [
    'Response within 4 hours during business hours',
    'Stephen will call to discuss your project',
    'Free on-site assessment and measurements',
    'Detailed written estimate within 48 hours',
]

export function Contact() {
    return (
        <section id="contact" className="section-padding bg-stone-50">
            <div className="container-main">
                <div className="grid gap-10 lg:gap-16 lg:grid-cols-2">
                    {/* Left Column - Info */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                    >
                        <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                            Get Started
                        </span>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                            Ready for a Free Estimate?
                        </h2>
                        <p className="text-lg text-stone-600 text-pretty mb-8">
                            Tell us about your project. We'll review it and get back to you quickly 
                            with honest feedback and a competitive quote.
                        </p>

                        {/* What to expect */}
                        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
                            <h3 className="font-display font-semibold text-lg text-stone-900 mb-4">
                                What Happens Next
                            </h3>
                            <ul className="space-y-3">
                                {whatToExpect.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-stone-600">
                                        <CheckCircle className="size-5 text-accent-500 flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-8">
                            <a
                                href="tel:254-230-3102"
                                className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-stone-100 transition-colors group shadow-sm"
                            >
                                <div className="size-12 flex items-center justify-center bg-accent-500 text-white rounded-lg">
                                    <Phone className="size-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <div className="font-semibold text-stone-900 group-hover:text-accent-600 transition-colors">
                                        (254) 230-3102
                                    </div>
                                    <div className="text-sm text-stone-500">Call or text — we respond quickly</div>
                                </div>
                            </a>

                            <a
                                href="mailto:slaconcrete@gmail.com"
                                className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-stone-100 transition-colors group shadow-sm"
                            >
                                <div className="size-12 flex items-center justify-center bg-stone-800 text-white rounded-lg">
                                    <Mail className="size-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <div className="font-semibold text-stone-900 group-hover:text-accent-600 transition-colors">
                                        slaconcrete@gmail.com
                                    </div>
                                    <div className="text-sm text-stone-500">Send photos of your project</div>
                                </div>
                            </a>

                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                                <div className="size-12 flex items-center justify-center bg-stone-600 text-white rounded-lg">
                                    <MapPin className="size-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <div className="font-semibold text-stone-900">Service Area</div>
                                    <div className="text-sm text-stone-500">
                                        Waco, Temple, Killeen & Central Texas — within 50 miles
                                    </div>
                                </div>
                            </div>

                            {/* Embedded Google Map */}
                            <div className="rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                                <iframe
                                    title="Concrete Works LLC service area - Waco, TX"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212964.283721818!2d-97.158368!3d31.502073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864f83f4616e7423%3A0x6d37e0b28e7a8e0b!2sWaco%2C%20TX%2C%20USA!5e0!3m2!1sen!2sus"
                                    width="100%"
                                    height="250"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="p-5 bg-stone-900 text-white rounded-xl">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="size-5 text-accent-400" />
                                <h3 className="font-display font-semibold">Business Hours</h3>
                            </div>
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
                                    <span>By appointment</span>
                                </div>
                            </div>
                            <p className="mt-4 pt-4 border-t border-stone-800 text-xs text-stone-400">
                                Emergency repairs available. Call anytime — if we don't answer, we call back within 4 hours.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column - Form */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm"
                        variants={fadeInUp}
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
