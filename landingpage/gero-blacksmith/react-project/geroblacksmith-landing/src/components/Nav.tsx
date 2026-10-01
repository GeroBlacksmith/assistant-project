import { useEffect, useRef, useState } from 'react'

export default function Nav() {
     const navRef = useRef<HTMLElement>(null)
      const [activeSection, setActiveSection] = useState(0)
    
      useEffect(() => {
        const nav = navRef.current
        if (!nav) return
    
        const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
        const sections = links.map((link) => document.getElementById(link.hash.slice(1)))
        let currentIndex = -1
    
        const spy = () => {
          const scrollPosition = window.scrollY + window.innerHeight * 0.35
          let nextIndex = 0
          sections.forEach((section, index) => {
            if (section && section.offsetTop <= scrollPosition) nextIndex = index
          })
    
          if (nextIndex === currentIndex) return
          currentIndex = nextIndex
          setActiveSection(nextIndex)
          nav.scrollLeft = links[nextIndex].offsetLeft - 20
        }
    
        window.addEventListener('scroll', spy, { passive: true })
        spy()
    
        return () => window.removeEventListener('scroll', spy)
      }, [])
    
    return (<nav aria-label="Sections" ref={navRef}>
        <a className={activeSection === 0 ? 'on' : undefined} href="#hero">gero</a>
        <a className={activeSection === 1 ? 'on' : undefined} href="#about">about me</a>
        <a className={activeSection === 2 ? 'on' : undefined} href="#sound">about my music</a>
        <a className={activeSection === 3 ? 'on' : undefined} href="#philosophy">philosophy</a>
        <a className={activeSection === 4 ? 'on' : undefined} href="#music">music</a>
        <a className={activeSection === 5 ? 'on' : undefined} href="#projects">projects</a>
        <a className={activeSection === 6 ? 'on' : undefined} href="#live">live events</a>
        <a className={activeSection === 7 ? 'on' : undefined} href="#socials">socials</a>
        <a className={activeSection === 8 ? 'on' : undefined} href="#contact">contact</a>
      </nav>)
}