import logoImage from '../assets/images/logo.png'
import { Phone } from 'lucide-react'

export function BlogHeader() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-stone-200 safe-top">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="/" className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="Concrete Works LLC"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain rounded-lg"
            />
            <span className="font-display font-semibold text-stone-900 hidden sm:block">
              Concrete Works LLC
            </span>
          </a>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-4 py-2 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[44px]"
            >
              Free Estimate
            </a>
            <a
              href="tel:254-230-3102"
              className="hidden sm:flex items-center gap-2 text-stone-700 hover:text-accent-600 font-medium transition-colors"
            >
              <Phone className="size-4" aria-hidden="true" />
              <span>(254) 230-3102</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
