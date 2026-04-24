import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Excellence } from "@/components/sections/Excellence";
import { Footer } from "@/components/sections/Footer";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { News } from "@/components/sections/News";
import { Services } from "@/components/sections/Services";
import { Timeline } from "@/components/sections/Timeline";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Services />
        <Excellence />
        <Gallery />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
