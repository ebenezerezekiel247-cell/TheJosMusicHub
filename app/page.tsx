import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Image 
        src="/logo.png" 
        alt="The Jos Music Hub Logo" 
        width={120} 
        height={120}
        priority
      />
      <h1 className="mt-4 text-4xl font-bold text-brand">The Jos Music Hub</h1>
      <p className="mt-4 text-gray-400">Discover and stream music from Jos</p>
    </main>
  )
}
