export function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <h1 className="font-display font-bold text-3xl text-stone-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-stone-600 mb-6">
        The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="inline-flex items-center justify-center px-4 py-2.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
      >
        Back to Home
      </a>
    </div>
  )
}
