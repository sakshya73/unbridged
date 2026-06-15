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

export function speak(text: string, onEnd?: () => void) {
  if (!voiceSupported()) {
    onEnd?.()
    return
  }
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const v = pickVoice()
  if (v) u.voice = v
  u.lang = v?.lang ?? "en-US"
  u.rate = 0.98
  u.pitch = 1.02
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  synth.speak(u)
}

export function stopSpeaking() {
  if (voiceSupported()) window.speechSynthesis.cancel()
}
