export function BlogFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-stone-900 text-stone-300 safe-bottom">
      <div className="container-main py-10">
        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm">
          <p>© {currentYear} Concrete Works, LLC. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="/#contact" className="hover:text-white transition-colors">
              Free Estimate
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
