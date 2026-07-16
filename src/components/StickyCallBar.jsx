import { Phone, MessageSquareText, ArrowRight } from 'lucide-react'

function trackTap(action) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', action, { event_category: 'sticky_call_bar' })
    }
}

export function StickyCallBar() {
    // Blog pages use a contact modal instead of an inline #contact section —
    // fall back to the homepage form so the button never dead-ends.
    const handleEstimateClick = (event) => {
        trackTap('sticky_estimate')
        if (typeof document !== 'undefined' && !document.getElementById('contact')) {
            event.preventDefault()
            window.location.href = '/#contact'
        }
    }

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-sm border-t border-stone-700/60 fixed-safe-bottom">
            <div className="grid grid-cols-3 gap-2 px-3 py-2.5">
                <a
                    href="tel:254-230-3102"
                    onClick={() => trackTap('sticky_call')}
                    className="inline-flex items-center justify-center gap-1.5 py-3 rounded-lg bg-accent-500 text-white text-sm font-bold hover:bg-accent-600 transition-colors"
                >
                    <Phone className="size-4" aria-hidden="true" />
                    Call
                </a>
                <a
                    href="sms:+12542303102"
                    onClick={() => trackTap('sticky_text')}
                    className="inline-flex items-center justify-center gap-1.5 py-3 rounded-lg border border-stone-600 text-white text-sm font-bold hover:bg-stone-800 transition-colors"
                >
                    <MessageSquareText className="size-4" aria-hidden="true" />
                    Text
                </a>
                <a
                    href="#contact"
                    onClick={handleEstimateClick}
                    className="inline-flex items-center justify-center gap-1.5 py-3 rounded-lg border border-stone-600 text-white text-sm font-bold hover:bg-stone-800 transition-colors"
                >
                    Estimate
                    <ArrowRight className="size-4" aria-hidden="true" />
                </a>
            </div>
        </div>
    )
}
