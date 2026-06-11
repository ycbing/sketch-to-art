import { Hero } from './components/Hero';
import { Showcase } from './components/Showcase';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { DeploySection } from './components/DeploySection';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Showcase />
      <Features />
      <HowItWorks />
      <DeploySection />
      <Footer />
    </main>
  );
}
