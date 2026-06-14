import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import BestSellers from '@/components/home/BestSellers';
import ProcessSection from '@/components/home/ProcessSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import CTABanner from '@/components/home/CTABanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <WhyChooseUs />
      <BestSellers />
      <ProcessSection />
      <ReviewsSection />
      <CTABanner />
    </>
  );
}
