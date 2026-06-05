import { useCallback } from 'react'

interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  life: number
}

export function useConfetti() {
  const triggerConfetti = useCallback((originX?: number, originY?: number) => {
    const canvas = document.createElement('canvas')
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '9999'
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')!
    const colors = ['#FFD6E7', '#FF6B9D', '#C084FC', '#90CDF4', '#6DDC91', '#FEF08A', '#FDA4AF']
    const particles: ConfettiParticle[] = []

    const cx = originX ?? window.innerWidth / 2
    const cy = originY ?? window.innerHeight * 0.3

    for (let i = 0; i < 120; i++) {
      const angle = (Math.random() * Math.PI * 2)
      const speed = Math.random() * 8 + 3
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        life: 1,
      })
    }

    let animId: number
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.2
        p.vx *= 0.99
        p.rotation += p.rotationSpeed
        p.life -= 0.012
        if (p.life > 0) {
          alive = true
          ctx.save()
          ctx.globalAlpha = p.life
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
          ctx.restore()
        }
      }
      if (alive) {
        animId = requestAnimationFrame(animate)
      } else {
        canvas.remove()
      }
    }

    animId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animId)
      canvas.remove()
    }
  }, [])

  return { triggerConfetti }
}
