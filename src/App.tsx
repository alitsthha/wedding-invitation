import { Hero } from "./components/sections/Hero";
import { Introduction } from "./components/sections/Introduction";
import { SaveTheDate } from "./components/sections/SaveTheDate";
import { Ceremony } from "./components/sections/Ceremony";
import { Timeline } from "./components/sections/Timeline";
import { RSVP } from "./components/sections/RSVP";
import { Closing } from "./components/sections/Closing";
import { Footer } from "./components/sections/Footer";
import { MusicToggle } from "./components/ui/MusicToggle";
import { wedding } from "./data/wedding";

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="paper-texture" aria-hidden="true" />

      <Hero monogram={wedding.couple.monogram} />

      <main id="main-content">
        <Introduction data={wedding} />
        <SaveTheDate data={wedding} />
        <Ceremony data={wedding} />
        <Timeline data={wedding} />
        <RSVP />
        <Closing data={wedding} />
      </main>
      <Footer data={wedding} />
      <MusicToggle src="/song.mp3" />
    </>
  );
}

export default App;
