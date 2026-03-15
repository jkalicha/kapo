import { Suspense } from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { SearchBar } from '@/components/landing/SearchBar'
import { FeaturedListings } from '@/components/landing/FeaturedListings'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { ForDealerships } from '@/components/landing/ForDealerships'
import { TrustSection } from '@/components/landing/TrustSection'
import { Testimonials } from '@/components/landing/Testimonials'
import { CTABanner } from '@/components/landing/CTABanner'
import { Footer } from '@/components/landing/Footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <HeroSection />
      <SearchBar />
      <Suspense fallback={<FeaturedListingsSkeleton />}>
        <FeaturedListings />
      </Suspense>
      <HowItWorks />
      <ForDealerships />
      <TrustSection />
      <Testimonials />
      <CTABanner />
      <Footer />
    </main>
  )
}

function FeaturedListingsSkeleton() {
  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-2">
            <div className="h-8 w-52 rounded bg-[#1A1A1A] animate-pulse" />
            <div className="h-4 w-72 rounded bg-[#1A1A1A] animate-pulse" />
          </div>
          <div className="hidden sm:block h-10 w-32 rounded bg-[#1A1A1A] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-[#27272A] bg-[#111111] overflow-hidden">
              <div className="h-44 bg-[#1A1A1A] animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 rounded bg-[#1A1A1A] animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-[#1A1A1A] animate-pulse" />
                <div className="h-px bg-[#27272A]" />
                <div className="flex justify-between">
                  <div className="h-4 w-1/3 rounded bg-[#1A1A1A] animate-pulse" />
                  <div className="h-7 w-24 rounded bg-[#1A1A1A] animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
