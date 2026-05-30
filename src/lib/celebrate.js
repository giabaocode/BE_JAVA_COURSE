import confetti from 'canvas-confetti'

/**
 * Fire a confetti burst at the given screen position (defaults to center top).
 * Used when the user marks a lesson/step complete.
 */
export function celebrate({ x = 0.5, y = 0.25 } = {}) {
  // Two staggered bursts feel snappier than one big one.
  confetti({
    particleCount: 50,
    spread: 65,
    origin: { x, y },
    colors: ['#00e5ff', '#a855f7', '#ff2bd6', '#aaff2b', '#ffb000'],
    scalar: 0.9,
    startVelocity: 32,
    ticks: 180,
    gravity: 0.95,
    disableForReducedMotion: true,
  })
  setTimeout(() => {
    confetti({
      particleCount: 32,
      spread: 90,
      origin: { x, y: y + 0.05 },
      colors: ['#5eecff', '#cfe9ff', '#ff7ae6'],
      scalar: 0.7,
      startVelocity: 26,
      ticks: 160,
      gravity: 0.9,
      disableForReducedMotion: true,
    })
  }, 90)
}

/** Larger burst for milestones (e.g. finishing a phase). */
export function celebrateBig() {
  const duration = 1200
  const end = Date.now() + duration
  ;(function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: ['#00e5ff', '#a855f7', '#ff2bd6'],
      disableForReducedMotion: true,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: ['#00e5ff', '#a855f7', '#ff2bd6'],
      disableForReducedMotion: true,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}
