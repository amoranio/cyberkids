/** Lightweight Web Audio beeps — no external files needed. */

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.08,
) {
  const audio = getCtx()
  if (!audio) return
  if (audio.state === 'suspended') void audio.resume()

  const osc = audio.createOscillator()
  const g = audio.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.value = gain
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration)
  osc.connect(g)
  g.connect(audio.destination)
  osc.start()
  osc.stop(audio.currentTime + duration)
}

export const sfx = {
  click(enabled: boolean) {
    if (!enabled) return
    tone(520, 0.06, 'triangle', 0.06)
  },
  success(enabled: boolean) {
    if (!enabled) return
    tone(523, 0.1, 'sine', 0.07)
    setTimeout(() => tone(659, 0.12, 'sine', 0.07), 80)
    setTimeout(() => tone(784, 0.18, 'sine', 0.07), 160)
  },
  wrong(enabled: boolean) {
    if (!enabled) return
    tone(220, 0.15, 'square', 0.04)
  },
  celebrate(enabled: boolean) {
    if (!enabled) return
    ;[523, 659, 784, 1046].forEach((f, i) => {
      setTimeout(() => tone(f, 0.2, 'sine', 0.08), i * 90)
    })
  },
  whoosh(enabled: boolean) {
    if (!enabled) return
    tone(180, 0.2, 'sawtooth', 0.03)
  },
}
