// Thin wrapper around the browser's Web Speech API (SpeechSynthesis).
// Free, no API key, works offline — voice quality varies by OS/browser.

const PREFERRED = [
  "Google US English",
  "Samantha",
  "Microsoft Aria Online (Natural) - English (United States)",
  "Microsoft Jenny Online (Natural) - English (United States)",
  "Daniel",
  "Karen",
  "Moira",
]

export function voiceSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!voiceSupported()) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  for (const name of PREFERRED) {
    const v = voices.find((x) => x.name === name)
    if (v) return v
  }
  return voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ?? voices[0]
}

// Warm up the (async) voice list so the first utterance can pick a good voice.
export function warmVoices() {
  if (!voiceSupported()) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
}

// Split narration into sentence-sized chunks. A single long utterance gets
// silently truncated by Chrome at ~15s, so we speak one sentence at a time and
// only report "done" after the last one — which keeps onEnd honest.
function chunkText(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*(\s|$)/g) ?? [text]
  const out: string[] = []
  for (const raw of sentences) {
    const s = raw.trim()
    if (!s) continue
    if (s.length <= 200) {
      out.push(s)
      continue
    }
    // a very long sentence: break it on commas so no chunk risks the cutoff
    let buf = ""
    for (const part of s.split(/,\s*/)) {
      if (buf && (buf + ", " + part).length > 200) {
        out.push(buf)
        buf = part
      } else {
        buf = buf ? `${buf}, ${part}` : part
      }
    }
    if (buf) out.push(buf)
  }
  return out.length ? out : [text]
}

// Monotonic id so a new speak()/stopSpeaking() invalidates any in-flight
// sequence: stale utterance callbacks check `mine === runId` and bail.
let runId = 0
let keepAlive: ReturnType<typeof setInterval> | undefined

function clearKeepAlive() {
  if (keepAlive) {
    clearInterval(keepAlive)
    keepAlive = undefined
  }
}

export function speak(text: string, onEnd?: () => void) {
  if (!voiceSupported()) {
    onEnd?.()
    return
  }
  const synth = window.speechSynthesis
  synth.cancel()
  clearKeepAlive()
  const mine = ++runId
  const v = pickVoice()
  const chunks = chunkText(text)
  let i = 0

  // Chrome can quietly pause long synthesis; nudging resume keeps it alive.
  keepAlive = setInterval(() => {
    if (mine !== runId || !synth.speaking) return
    synth.resume()
  }, 7000)

  const speakNext = () => {
    if (mine !== runId) return
    if (i >= chunks.length) {
      clearKeepAlive()
      onEnd?.()
      return
    }
    const u = new SpeechSynthesisUtterance(chunks[i++])
    if (v) u.voice = v
    u.lang = v?.lang ?? "en-US"
    u.rate = 0.98
    u.pitch = 1.02
    u.onend = () => speakNext()
    u.onerror = () => speakNext() // skip a failed chunk, keep going
    synth.speak(u)
  }
  speakNext()
}

export function stopSpeaking() {
  if (!voiceSupported()) return
  runId++ // invalidate any in-flight sequence so its callbacks no-op
  clearKeepAlive()
  window.speechSynthesis.cancel()
}
