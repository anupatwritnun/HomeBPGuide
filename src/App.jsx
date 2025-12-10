import { useState, useRef, useEffect } from 'react'
import { steps } from './data/steps'
import './index.css'

function App() {
  const [started, setStarted] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const audioRef = useRef(null)

  const currentStep = steps[currentStepIndex]
  const totalSteps = steps.length

  useEffect(() => {
    // Reset timer when step changes
    setTimerActive(false)
    if (currentStep.timer) {
      setTimeLeft(currentStep.timer)
    }
  }, [currentStepIndex, currentStep.timer])

  useEffect(() => {
    let interval = null
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setTimerActive(false)
    }
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const toggleTimer = () => {
    setTimerActive(!timerActive)
  }

  useEffect(() => {
    if (started && !finished && audioRef.current) {
      // Small timeout to ensure source is updated and DOM is ready
      const timer = setTimeout(() => {
        playAudio()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentStepIndex, started, finished])

  const playAudio = () => {
    if (audioRef.current) {
      // Reload the source
      audioRef.current.load()
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn("Audio autoplay blocked or file missing", err)
          setIsPlaying(false)
        })
    }
  }

  const handleStart = () => {
    setStarted(true)
    // Interaction here allows future auto-plays
  }

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1)
    } else {
      setFinished(true)
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const handleRestart = () => {
    setFinished(false)
    setCurrentStepIndex(0)
    setStarted(false) // Go back to start to force interaction again if needed, or just true
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  if (!started) {
    return (
      <div className="glass-card">
        <div className="icon-large">🏥</div>
        <h1>คู่มือการวัดความดันโลหิตที่บ้าน</h1>
        <p>เรียนรู้วิธีการวัดความดันที่ถูกต้องทีละขั้นตอน เพื่อสุขภาพที่ดีของคุณ</p>
        <button onClick={handleStart} style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
          เริ่มเรียนรู้ (Start)
        </button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="glass-card">
        <div className="icon-large">🎉</div>
        <h1>เรียนรู้จบแล้ว!</h1>
        <p>อย่าลืมนำไปปฏิบัติตามเพื่อผลลัพธ์ที่แม่นยำนะครับ</p>
        <div className="controls" style={{ justifyContent: 'center' }}>
          <button onClick={handleRestart}>เริ่มใหม่ (Restart)</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="glass-card">
        <div className="icon-large">{currentStep.icon}</div>
        <h2>{currentStep.id}. {currentStep.title}</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{currentStep.content}</p>

        <ul>
          {currentStep.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>

        {currentStep.timer && (
          <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3rem', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={toggleTimer}
              style={{
                backgroundColor: timerActive ? '#ef4444' : 'var(--primary)',
                minWidth: '150px'
              }}
            >
              {timerActive ? 'หยุดจับเวลา (Pause)' : timeLeft === 0 ? 'เริ่มใหม่ (Restart)' : 'เริ่มจับเวลา (Start)'}
            </button>
            {timeLeft === 0 && currentStep.timer && (
              <p style={{ color: '#06c755', fontWeight: 'bold', marginTop: '1rem' }}>✅ ครบเวลาแล้ว! (Time's up!)</p>
            )}
          </div>
        )}

        {currentStep.image && (
          <div style={{ margin: '1.5rem 0' }}>
            <img
              src={currentStep.image}
              alt="Step illustration"
              style={{ maxWidth: '200px', borderRadius: '12px', border: '5px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
          </div>
        )}

        {currentStep.link && (
          <div style={{ marginBottom: '1.5rem' }}>
            <a
              href={currentStep.link}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#06c755', // Line Green
                color: 'white',
                padding: '0.8rem 1.5rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {currentStep.linkText || 'Open Link'} ➜
            </a>
          </div>
        )}

        {/* Audio Player Logic */}
        <div className="audio-control">
          <audio
            ref={audioRef}
            src={currentStep.audio}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
          <button
            className="secondary"
            onClick={toggleAudio}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            {isPlaying ? '🔊 กำลังเล่นเสียง...' : '🔈 เล่นเสียงคำบรรยาย'}
          </button>
        </div>

        <div className="controls">
          <button
            className="secondary"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
          >
            ย้อนกลับ
          </button>
          <button onClick={handleNext}>
            {currentStepIndex === totalSteps - 1 ? 'เสร็จสิ้น' : 'ถัดไป'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
