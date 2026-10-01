import { useEffect, useRef } from 'react'
import './App.css'
import Nav from './components/Nav'
import Section from './components/Sections'

function App() {
  const scopeRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = scopeRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const colors = ['#b6ff00', '#00e5ff', '#ff2a6d']
    let time = 0
    let frameId: number | undefined

    const drawFrame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      if (canvas.width === 0) return

      for (let wave = 0; wave < colors.length; wave += 1) {
        context.beginPath()
        context.strokeStyle = colors[wave]
        context.lineWidth = 1

        for (let x = 0; x <= canvas.width; x += 3) {
          const progress = x / canvas.width
          const y = canvas.height * (0.5 + 0.12 * wave - 0.12)
            + Math.sin(progress * (9 + wave * 7) + time * (1 + wave * 0.6))
            * canvas.height * 0.06 * Math.sin(progress * 3 + time * 0.3)
            + (Math.random() - 0.5) * (wave === 2 ? canvas.height * 0.04 : 2)
          if (x === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }

        context.stroke()
      }
    }

    const animate = () => {
      drawFrame()
      time += 0.03
      frameId = window.requestAnimationFrame(animate)
    }

    const resize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      if (reduceMotion) drawFrame()
    }

    resize()
    if (reduceMotion) drawFrame()
    else animate()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (frameId !== undefined) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <>
      <Nav />

      <section id="hero">
        <canvas id="scope" ref={scopeRef} aria-hidden="true"></canvas>
        <h1><span>Gero</span><span>Blacksmith</span></h1>
        <p className="tag">Electronic music: IDM, breakcore, drum and bass, ambient. Made in a home studio, increasingly
          without a computer.</p>
      </section>
      <Section id="about" title="about me">
        <div className="col">
          <p>Gero Blacksmith is an artist and music producer working in electronic music. The name suggests a forge:
            sounds get heated, hit, bent and cooled into something new.</p>
          <p>Most of the work happens in a personal studio, where tracks are written, tested and reshaped. Some end up
            as mixes, some as releases, some as live jams recorded in one take.</p>
          <p className="note">Add your own story here: where you are from, when you started, what first pulled you into
            sound.</p>
        </div>
      </Section>
      <Section id="sound" title="about my music">


        <ul className="tags">
          <li>idm</li>
          <li>breakcore</li>
          <li>drum and bass</li>
          <li>ambient</li>
        </ul>
        <div className="col">
          <p>Broken rhythms and dense detail sit next to long, quiet textures. A track can go from a 170 bpm rush to a
            slow wash of ambient in a few minutes.</p>
          <p>Breaks are chopped and rebuilt until they stop sounding like the originals. Bass is heavy but kept clean.
            Silence and space count as much as noise.</p>
        </div>
      </Section>


      <section id="philosophy">
        <h2>philosophy<i>03</i></h2>
        <p className="big">Make it by hand. <b>Keep the mistakes</b> that sound good. Finish the track, then start another.
        </p>
        <div className="col" style={{ marginTop: '36px' }}>
          <p>Machines are instruments, not shortcuts. Dawless sessions mean every sound has a knob, a cable and a
            decision behind it.</p>
          <p>Music is for listening closely and for moving to. It does not need to be one or the other.</p>
        </div>
      </section>

      <section id="music">
        <h2>music<i>04</i></h2>
        <div className="col">
          <p>Tracks and mixes live on SoundCloud. Start there, then follow the Linktree for other streaming platforms.
          </p>
          <p><a className="btn" href="https://soundcloud.com/geroblacksmith" target="_blank" rel="noopener">listen on
            soundcloud</a><a className="btn" href="https://linktr.ee/geroblacksmith" target="_blank" rel="noopener"
              style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }}>all platforms</a></p>
          <p className="note">Tip: replace this block with an embedded player or your latest release title.</p>
        </div>
      </section>

      <section id="projects">
        <h2>projects<i>05</i></h2>
        <ul className="list">
          <li><span>Dawless jams</span><em>studio sessions on video, YouTube</em></li>
          <li><span>Mixes</span><em>long sets, SoundCloud</em></li>
          <li><span>Original tracks</span><em>IDM, breakcore, dnb, ambient</em></li>
          <li><span className="tick">Next project</span><em>name and date to be added</em></li>
        </ul>
      </section>

      <section id="live">
        <h2>live events<i>06</i></h2>
        <ul className="list">
          <li><span>No dates announced yet</span><em>check back soon</em></li>
          <li><span className="note">Date / venue / city</span><em>add a show here</em></li>
        </ul>
        <div className="col" style={{ marginTop: '28px' }}>
          <p>Interested in booking a live set or a dawless performance? <a href="#contact">Get in touch.</a></p>
        </div>
      </section>

      <section id="socials">
        <h2>socials<i>07</i></h2>
        <ul className="list">
          <li><a href="https://soundcloud.com/geroblacksmith" target="_blank" rel="noopener">SoundCloud</a><em>tracks
            and mixes</em></li>
          <li><a href="https://www.facebook.com/GeroBlacksmith/" target="_blank"
            rel="noopener">Facebook</a><em>official page</em></li>
          <li><a href="https://linktr.ee/geroblacksmith" target="_blank" rel="noopener">Linktree</a><em>every other
            platform</em></li>
          <li><span>YouTube</span><em>jams and varied videos, add your channel link</em></li>
        </ul>
      </section>

      <section id="contact">
        <h2>contact<i>08</i></h2>
        <div className="col">
          <p>For bookings, collaborations, remixes or just to say hello, write through any social channel or the
            Linktree.</p>
          <p><a className="btn" href="https://linktr.ee/geroblacksmith" target="_blank" rel="noopener">open linktree</a><a
            className="btn" href="https://www.facebook.com/GeroBlacksmith/" target="_blank" rel="noopener"
            style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }}>message on facebook</a></p>
          <p className="note">Add a direct email address here when you want one.</p>
        </div>
      </section>

      <footer>&copy; <span>{new Date().getFullYear()}</span> Gero Blacksmith</footer>
    </>
  )
}

export default App
