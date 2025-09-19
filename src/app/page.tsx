import AboutSection from "./components/AboutSection";
import { BackToTop } from "./components/BackToTop";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import QuickAccess from "./components/QuickAccess";

export default function Home(){
  return(
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <BackToTop />
      <FeaturesSection />
      <AboutSection />
      <QuickAccess />
      <Footer />
    </main>
  );
}