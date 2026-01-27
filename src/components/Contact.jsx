import { useState } from 'react'
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react'
import { cn } from '../lib/utils'

export function Contact() {
    const [formState, setFormState] = useState('idle') // idle, submitting, success, error
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormState('submitting')

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setFormState('success')
    }

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <section id="contact" className="section-padding bg-white">
            <div className="container-main">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Column - Info */}
                    <div>
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
                    </div>

                    {/* Right Column - Form */}
                    <div className="bg-stone-50 rounded-2xl p-6 md:p-8 lg:p-10">
                        {formState === 'success' ? (
                            <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                                <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="size-8 text-green-600" aria-hidden="true" />
                                </div>
                                <h3 className="font-display font-bold text-2xl text-stone-900 mb-2">
                                    Message Sent!
                                </h3>
                                <p className="text-stone-600 mb-6">
                                    Thanks for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => {
                                        setFormState('idle')
                                        setFormData({ name: '', email: '', phone: '', service: '', message: '' })
                                    }}
                                    className="text-accent-600 font-semibold hover:text-accent-700"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <h3 className="font-display font-bold text-2xl text-stone-900 mb-6">
                                    Request a Free Estimate
                                </h3>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow"
                                            placeholder="John Smith"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1.5">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow"
                                            placeholder="(254) 555-0123"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="service" className="block text-sm font-medium text-stone-700 mb-1.5">
                                        Service Interested In
                                    </label>
                                    <select
                                        id="service"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow appearance-none"
                                    >
                                        <option value="">Select a service...</option>
                                        <option value="driveway">Driveway</option>
                                        <option value="patio">Patio</option>
                                        <option value="stamped">Stamped Concrete</option>
                                        <option value="decorative">Decorative Concrete</option>
                                        <option value="commercial">Commercial Project</option>
                                        <option value="repair">Concrete Repair</option>
                                        <option value="foundation">Foundation</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">
                                        Project Details *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow resize-none"
                                        placeholder="Tell us about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={formState === 'submitting'}
                                    className={cn(
                                        'w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg transition-colors duration-150 min-h-[52px]',
                                        formState === 'submitting'
                                            ? 'opacity-70 cursor-not-allowed'
                                            : 'hover:bg-accent-600'
                                    )}
                                >
                                    {formState === 'submitting' ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="size-5" aria-hidden="true" />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-stone-500 text-center">
                                    We respect your privacy and will never share your information.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
