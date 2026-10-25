import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Education from '@/components/sections/Education'
import Experience from '@/components/sections/Experience'
import Organization from '@/components/sections/Organization'
import Certificates from '@/components/sections/Certificates'
import Skills from '@/components/sections/Skills'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Experience />
      <Organization />
      <Certificates />
      <Skills />
      <Contact />
    </>
  )
}
