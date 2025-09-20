import AboutSection from "./components/AboutSection";
import { BackToTop } from "./components/BackToTop";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import QuickAccess from "./components/QuickAccess";

export default function Home(){
  return(
    <main className="min-h-screen">
      <HeroSection />
      <BackToTop />
      <FeaturesSection />
      <AboutSection />
      <QuickAccess />
    </main>
  );
}