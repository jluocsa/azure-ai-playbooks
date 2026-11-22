<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

const videoRef = ref<HTMLVideoElement | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
const isPlaying = ref(false)
const hasStarted = ref(false)
const triedFallback = ref(false)

function ensureAudible(el: HTMLVideoElement) {
  el.muted = false
  if (el.volume === 0) el.volume = 1
}

function onTimeUpdate() {
  const el = videoRef.value
  if (el && el.currentTime > 0.05) hasStarted.value = true
}

function onVideoError() {
  const el = videoRef.value
  if (!el) return
  if (!triedFallback.value) {
    triedFallback.value = true
    const fallbackUrl = el.currentSrc.includes('.webm')
      ? withBase('/video/azure-ai-playbooks-csa-forum-intro.mp4?v=3')
      : withBase('/video/azure-ai-playbooks-csa-forum-intro.webm?v=3')
    const resumeTime = el.currentTime || 0
    const shouldResume = hasStarted.value
    el.src = fallbackUrl
    el.load()
    if (shouldResume) {
      el.currentTime = resumeTime
      ensureAudible(el)
      el.play().catch(() => {
        isPlaying.value = false
        hasStarted.value = false
      })
    }
    return
  }
  isPlaying.value = false
  hasStarted.value = false
}

function playWithSound() {
  const el = videoRef.value
  if (!el) return
  hasStarted.value = true
  ensureAudible(el)
  el.play().catch(() => {
    isPlaying.value = false
    hasStarted.value = false
  })
}

function playFromStart() {
  const el = videoRef.value
  if (!el) return
  hasStarted.value = true
  ensureAudible(el)
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.play().catch(() => {
    isPlaying.value = false
    hasStarted.value = false
  })
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.location.hash === '#csa-forum-video') {
    setTimeout(() => {
      sectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)
  }
})

defineExpose({ playFromStart })
</script>

<template>
  <section id="csa-forum-video" ref="sectionRef" class="ivs-section no-print">
    <div class="ms-container">
      <div class="ivs-card">
        <div class="ivs-header">
          <div>
            <span class="ivs-kicker">
              <span class="ivs-rec-dot" aria-hidden="true"></span>
              <span>STUDIO BRIEFING &middot; CSA FORUM EDITION (2:24 &middot; 1080p HD &middot; STUDIO VOICEOVER + SCORE)</span>
            </span>
            <h2 class="ivs-title">Executive &amp; CSA Forum Introduction Film</h2>
            <p class="ivs-sub">
              Walk through the 1:N Solution Industrialization Factory, Playbook 01&rsquo;s GPT-5.6+ prompt-caching &amp;
              two-regime PTU math, runnable CI/KQL kits, and repeatable 3-week delivery scope in two and a half minutes.
            </p>
          </div>

          <div class="ivs-actions">
            <a
              class="ms-btn ms-btn-secondary ivs-dl-btn"
              :href="withBase('/video/azure-ai-playbooks-csa-forum-intro.mp4?v=3')"
              download="azure-ai-playbooks-csa-forum-intro.mp4"
            >
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M8.75 1.75a.75.75 0 0 0-1.5 0v6.69L4.97 6.16a.75.75 0 0 0-1.06 1.06l3.56 3.56a.75.75 0 0 0 1.06 0l3.56-3.56a.75.75 0 1 0-1.06-1.06L8.75 8.44V1.75ZM2.5 11.75a.75.75 0 0 0-1.5 0v1.5A1.75 1.75 0 0 0 2.75 15h10.5A1.75 1.75 0 0 0 15 13.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.25.25 0 0 1-.25.25H2.75a.25.25 0 0 1-.25-.25v-1.5Z"
                />
              </svg>
              <span>Download 1080p MP4 (PowerPoint / Teams)</span>
            </a>
          </div>
        </div>

        <div class="ivs-player-wrap" :class="{ 'is-playing': isPlaying }">
          <video
            ref="videoRef"
            class="ivs-video"
            controls
            playsinline
            preload="metadata"
            :poster="withBase('/video/azure-ai-playbooks-csa-forum-intro-poster.png?v=3')"
            @timeupdate="onTimeUpdate"
            @play="isPlaying = true; hasStarted = true"
            @pause="isPlaying = false"
            @ended="isPlaying = false"
            @error="onVideoError"
          >
            <source
              :src="withBase('/video/azure-ai-playbooks-csa-forum-intro.mp4?v=3')"
              type='video/mp4; codecs="avc1.64002a, mp4a.40.2"'
            />
            <source
              :src="withBase('/video/azure-ai-playbooks-csa-forum-intro.webm?v=3')"
              type='video/webm; codecs="vp9, opus"'
            />
            <track
              kind="captions"
              label="English (Synchronized Captions)"
              srclang="en"
              :src="withBase('/video/azure-ai-playbooks-csa-forum-intro.vtt?v=3')"
              default
            />
            Your browser does not support HTML5 video.
          </video>

          <button
            v-if="!isPlaying && !hasStarted"
            type="button"
            class="ivs-play-overlay"
            aria-label="Play 2:24 CSA Forum Studio Introduction Film with sound"
            @click="playWithSound"
          >
            <span class="ivs-play-pill">
              <span class="ivs-play-circle" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path fill="currentColor" d="M8 5.14v14l11-7-11-7Z" />
                </svg>
              </span>
              <span class="ivs-play-copy">
                <strong>Play Studio Intro Film (2:24)</strong>
                <span>1080p HD &middot; Baritone Voiceover + Score &middot; Sound On</span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
