import { Header } from "@/components/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { UseCases } from "@/components/landing/UseCases";
import { SocialProof } from "@/components/landing/SocialProof";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesGrid />
      <FeatureShowcase />
      <UseCases />
      <SocialProof />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;