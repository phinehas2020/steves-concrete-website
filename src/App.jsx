import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { Values } from './components/Values'
import { Gallery } from './components/Gallery'
import { Testimonials } from './components/Testimonials'
import { FAQ } from './components/FAQ'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
function App() {

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="order-1 md:order-none">
          <Hero />
        </div>
        <div className="order-2 md:order-none">
          <Services />
        </div>
        <div className="order-3 md:order-none">
          <Gallery />
        </div>
        {/* Values - Hidden on mobile to reduce scroll to Gallery */}
        <div className="hidden md:block md:order-none">
          <Values />
        </div>
        <div className="order-5 md:order-none">
          <Testimonials />
        </div>
        <div className="order-6 md:order-none">
          <FAQ />
        </div>
        {/* Move Contact earlier on mobile for faster conversions */}
        <div className="order-4 md:order-none">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
