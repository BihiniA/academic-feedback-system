import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Rates from '../components/Home/Rates';
import Optimize from '../components/Home/Optimize';

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />
      
      {/* Rates Section */}
      <Rates/>

      {/* Optimize Section */}
      <Optimize />
      
    </div>
  );
}