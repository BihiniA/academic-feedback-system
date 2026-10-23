import Hero from '../components/About/Hero'
import Values from '../components/About/Values'
import Mission from '../components/About/Mission'
import Team from '../components/About/Team'

export default function About() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <Hero />

      {/* Mission Section */}
      <Mission />

      {/* Values Section */}
      <Values />
      
      {/* Team Section */}
      <Team />
      
    </div>
  );
}