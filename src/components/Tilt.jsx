import React, { useRef, useCallback } from 'react'

/**
 * Subtle 3D tilt on hover. Wrap any block element.
 *
 * <Tilt><div className="card">...</div></Tilt>
 *
 * - Reads mouse position relative to the element, sets CSS vars --rx/--ry
 *   consumed by .tilt-inner in index.css.
 * - Throttled via requestAnimationFrame to avoid layout thrash.
 * - max prop controls the max rotation in degrees (default 6).
 */
export default function Tilt({ children, max = 6, className = '' }) {
  const wrapRef = useRef(null)
  const rafRef = useRef(0)

  const onMove = useCallback((e) => {
    const wrap = wrapRef.current
    if (!wrap) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = wrap.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width   // 0..1
      const y = (e.clientY - rect.top)  / rect.height  // 0..1
      const ry = (x - 0.5) * (max * 2)   // -max..+max
      const rx = (0.5 - y) * (max * 2)
      const inner = wrap.firstElementChild
      if (inner) {
        inner.style.setProperty('--rx', `${rx.toFixed(2)}deg`)
        inner.style.setProperty('--ry', `${ry.toFixed(2)}deg`)
      }
    })
  }, [max])

  const onLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const wrap = wrapRef.current
    if (!wrap) return
    const inner = wrap.firstElementChild
    if (inner) {
      inner.style.setProperty('--rx', '0deg')
      inner.style.setProperty('--ry', '0deg')
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-wrap ${className}`}
    >
      <div className="tilt-inner">
        {children}
      </div>
    </div>
  )
}
