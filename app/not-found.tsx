import Link from 'next/link'

// Halaman 404 khusus. Dua bahasa ditampilkan bersamaan karena halaman ini tidak memakai konteks bahasa.
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl font-extrabold gradient-text sm:text-5xl">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-sm text-text-secondary">Alamat yang kamu tuju tidak ada atau sudah dipindahkan. / The address you opened does not exist or has moved.</p>
      <Link href="/" className="btn-primary mt-8">
        Kembali ke beranda / Back to home
      </Link>
    </section>
  )
}
