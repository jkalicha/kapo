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
      <FeaturedListings />
      <HowItWorks />
      <ForDealerships />
      <TrustSection />
      <Testimonials />
      <CTABanner />
      <Footer />
    </main>
  )
}
