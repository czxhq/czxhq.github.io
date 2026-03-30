<template>
  <div class="bg-scene">
    <canvas ref="canvasRef" class="bg-canvas"></canvas>
    <div class="bg-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
let ctx = null
let animationFrameId = null
const stalks = []
const fallingLeaves = []

const windField = {
  targetX: 0,
  currentX: 0,
  targetY: 0,
  currentY: 0,
  lastX: null,
  lastY: null,
  lastTime: 0
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function handlePointerMove(event) {
  const now = performance.now()
  if (windField.lastX === null || windField.lastY === null) {
    windField.lastX = event.clientX
    windField.lastY = event.clientY
    windField.lastTime = now
    return
  }

  const deltaX = event.clientX - windField.lastX
  const deltaY = event.clientY - windField.lastY
  const deltaTime = Math.max(now - windField.lastTime, 16)
  const speedFactor = Math.min(Math.hypot(deltaX, deltaY) / deltaTime, 1.8)

  windField.targetX = clamp((deltaX / deltaTime) * 0.24, -0.11, 0.11)
  windField.targetY = clamp((deltaY / deltaTime) * 0.1, -0.045, 0.045)

  // Short swipes should still feel like a passing gust.
  windField.targetX *= 0.4 + speedFactor * 0.55
  windField.targetY *= 0.28 + speedFactor * 0.35

  windField.lastX = event.clientX
  windField.lastY = event.clientY
  windField.lastTime = now
}

function handlePointerLeave() {
  windField.targetX = 0
  windField.targetY = 0
  windField.lastX = null
  windField.lastY = null
}

class FallingLeaf {
  constructor(w, h) {
    this.w = w
    this.h = h
    this.reset(true)
  }

  reset(initial = false) {
    this.x = Math.random() * this.w
    this.y = initial ? Math.random() * this.h : -20
    this.size = Math.random() * 10 + 10
    this.speedY = Math.random() * 0.8 + 0.6
    this.speedX = Math.random() * 1.5 - 0.75
    this.rotation = Math.random() * 360
    this.rotationSpeed = Math.random() * 1.5 - 0.75
    this.opacity = Math.random() * 0.4 + 0.2
    this.swaySpeed = Math.random() * 0.01 + 0.005
    this.swayOffset = Math.random() * Math.PI * 2
  }

  update(time, windX) {
    const ambientWind = Math.sin(time * this.swaySpeed + this.swayOffset) * 1.5
    this.y += this.speedY
    this.x += this.speedX + ambientWind + windX * 26
    this.rotation += this.rotationSpeed + windX * 10

    if (this.y > this.h + 20 || this.x < -40 || this.x > this.w + 40) {
      this.reset()
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)

    ctx.beginPath()
    ctx.moveTo(0, -this.size / 2)
    ctx.quadraticCurveTo(this.size / 2, 0, 0, this.size / 2)
    ctx.quadraticCurveTo(-this.size / 2, 0, 0, -this.size / 2)

    ctx.fillStyle = `rgba(124, 154, 86, ${this.opacity * 0.9})`
    ctx.fill()
    ctx.restore()
  }
}

class BambooStalk {
  constructor(x, layer, _w, h) {
    this.baseX = x
    this.layer = layer
    this.canvasHeight = h
    this.segments = Math.floor(Math.random() * 4) + (layer === 3 ? 10 : 12)
    this.baseWidth = layer * 4 + Math.random() * 3 + 2
    this.baseAngle = Math.random() * 0.06 - 0.03
    this.height = h + 150 + Math.random() * 200

    const colors = ['#9eac85', '#7f9661', '#69834e']
    const darkColors = ['#81906b', '#647a4b', '#4d6339']
    this.color = colors[layer - 1]
    this.nodeColor = darkColors[layer - 1]

    this.swaySpeed = 0.0008 + Math.random() * 0.0004
    this.swayPhase = Math.random() * Math.PI * 2
    this.maxBend = layer * 0.015 + 0.01
    this.windInfluence = 0.32 + layer * 0.1

    this.branches = []
    for (let i = Math.floor(this.segments * 0.3); i < this.segments; i++) {
      if (Math.random() > 0.4) {
        this.branches.push({
          segment: i,
          dir: Math.random() > 0.5 ? 1 : -1,
          leafCount: Math.floor(Math.random() * 4) + 2
        })
      }
    }
  }

  draw(ctx, time, windX, windY) {
    ctx.save()
    let cx = this.baseX
    let cy = this.canvasHeight + 20
    const segH = this.height / this.segments

    const ambientWind = Math.sin(time * this.swaySpeed + this.swayPhase) * this.maxBend
    const gustWind = windX * this.windInfluence
    const verticalLift = windY * 0.045

    ctx.lineCap = 'butt'
    ctx.lineJoin = 'miter'

    let currentAngle = this.baseAngle

    for (let i = 0; i < this.segments; i++) {
      const segmentRatio = i / this.segments
      currentAngle += ambientWind * segmentRatio
      currentAngle += gustWind * Math.pow(segmentRatio, 1.35)

      const nx = cx + Math.sin(currentAngle) * segH
      const ny = cy - Math.cos(currentAngle) * segH + verticalLift * segmentRatio * 9
      const w = this.baseWidth * (1 - segmentRatio * 0.3)

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(nx, ny)
      ctx.strokeStyle = this.color
      ctx.lineWidth = w
      ctx.stroke()

      if (i > 0) {
        ctx.beginPath()
        const perpAngle = currentAngle + Math.PI / 2
        const halfW = w / 2 + 1
        const x1 = cx + Math.sin(perpAngle) * halfW
        const y1 = cy - Math.cos(perpAngle) * halfW
        const x2 = cx - Math.sin(perpAngle) * halfW
        const y2 = cy + Math.cos(perpAngle) * halfW

        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = this.nodeColor
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      const branch = this.branches.find((br) => br.segment === i)
      if (branch) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(currentAngle)
        ctx.rotate((Math.PI / 5) * branch.dir)
        const leafWind = Math.sin(time * 0.002 + this.baseX) * 0.12 + gustWind * 0.45
        ctx.rotate(leafWind)

        ctx.fillStyle = this.color
        for (let j = 0; j < branch.leafCount; j++) {
          ctx.save()
          ctx.translate(j * 8 * branch.dir, -j * 4)
          ctx.rotate((Math.PI / 8 * j + 0.1) * branch.dir)

          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.quadraticCurveTo(12 * branch.dir, -8, 28 * branch.dir, -4)
          ctx.quadraticCurveTo(15 * branch.dir, 4, 0, 0)
          ctx.fill()

          ctx.restore()
        }
        ctx.restore()
      }

      cx = nx
      cy = ny
    }

    ctx.restore()
  }
}

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d', { alpha: false })

  const initObjects = () => {
    stalks.length = 0
    fallingLeaves.length = 0
    const w = canvas.width
    const h = canvas.height

    for (let i = 0; i < 40; i++) stalks.push(new BambooStalk(Math.random() * w, 1, w, h))
    for (let i = 0; i < 25; i++) stalks.push(new BambooStalk(Math.random() * w, 2, w, h))
    for (let i = 0; i < 15; i++) stalks.push(new BambooStalk(Math.random() * w, 3, w, h))
    for (let i = 0; i < 40; i++) fallingLeaves.push(new FallingLeaf(w, h))
  }

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    initObjects()
  }

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', handlePointerMove, { passive: true })
  window.addEventListener('mouseleave', handlePointerLeave)

  let time = 0
  const animate = () => {
    ctx.fillStyle = '#f7f4ec'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    time += 16
    windField.currentX += (windField.targetX - windField.currentX) * 0.07
    windField.currentY += (windField.targetY - windField.currentY) * 0.07
    windField.targetX *= 0.98
    windField.targetY *= 0.978

    stalks.forEach((stalk) => stalk.draw(ctx, time, windField.currentX, windField.currentY))
    fallingLeaves.forEach((leaf) => {
      leaf.update(time, windField.currentX)
      leaf.draw(ctx)
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  return () => {
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', handlePointerMove)
    window.removeEventListener('mouseleave', handlePointerLeave)
    cancelAnimationFrame(animationFrameId)
    stalks.length = 0
    fallingLeaves.length = 0
  }
}

let cleanup = null

onMounted(() => {
  cleanup = initCanvas()
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<style scoped>
.bg-scene {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: #f7f4ec;
  pointer-events: none;
}

.bg-canvas {
  position: absolute;
  inset: 0;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.45), transparent 42%),
    radial-gradient(circle at 80% 20%, rgba(232, 239, 227, 0.55), transparent 28%),
    linear-gradient(180deg, rgba(247, 244, 236, 0.12) 0%, rgba(232, 239, 227, 0.3) 100%);
  pointer-events: none;
}
</style>
