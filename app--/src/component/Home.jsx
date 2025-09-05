import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../style/homeStyle.css"

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🎬 Your Smart Streaming Companion</h1>
        <p className="home-subtitle">
          Say goodbye to decision fatigue and hello to effortless entertainment.
        </p>
      </header>

      <section className="home-description">
        <p>
          Our AI-powered platform helps you discover what to watch by asking just a few
          intelligent questions based on your mood, habits, and time of day — no endless scrolling.
          Can’t remember the name of a show from a scene, screenshot, or quote? Use our Scene
          Search Engine to instantly identify the episode or series using advanced audio-visual
          recognition and NLP.
        </p>
        <p>
          Plus, make streaming social again: track your watch history, rate content, create private
          watch groups, and share reactions or run polls — all with full privacy control. It's the
          smartest, most personalized way to watch.
        </p>
      </section>

      <div className="home-buttons">
        <button className="primary-btn" onClick={() => navigate('/register')}>Get Started</button>
        <button className="secondary-btn" onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  )
}

export default Home
