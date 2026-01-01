import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedSoftware } from "@/components/FeaturedSoftware";
import { PlatformSection } from "@/components/PlatformSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedSoftware />
      <PlatformSection />
    </Layout>
  );
};

export default Index;
