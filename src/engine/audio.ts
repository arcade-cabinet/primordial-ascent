/**
 * Lightweight Web Audio manager for Primordial Ascent.
 * No heavy dependencies (like Tone.js or Howler) to keep the bundle lean.
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private lavaGain: GainNode | null = null;
  private lavaOsc: OscillatorNode | null = null;

  async init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.5;

    // Start cave drone (low frequency oscillation + noise)
    this.startAmbient();
    this.startLavaRumble();
  }

  private startAmbient() {
    if (!this.ctx || !this.masterGain) return;
    
    this.ambientOsc = this.ctx.createOscillator();
    this.ambientOsc.type = "sine";
    this.ambientOsc.frequency.value = 40; // Deep hum
    
    const gain = this.ctx.createGain();
    gain.gain.value = 0.15;
    
    this.ambientOsc.connect(gain);
    gain.connect(this.masterGain);
    this.ambientOsc.start();
  }

  private startLavaRumble() {
    if (!this.ctx || !this.masterGain) return;
    
    this.lavaOsc = this.ctx.createOscillator();
    this.lavaOsc.type = "sawtooth";
    this.lavaOsc.frequency.value = 32;
    
    this.lavaGain = this.ctx.createGain();
    this.lavaGain.gain.value = 0; // Default silent
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 100;
    
    this.lavaOsc.connect(filter);
    filter.connect(this.lavaGain);
    this.lavaGain.connect(this.masterGain);
    this.lavaOsc.start();
  }

  updateLavaIntensity(distToLava: number) {
    if (!this.lavaGain || !this.ctx) return;
    const intensity = Math.max(0, 1 - distToLava / 60);
    this.lavaGain.gain.setTargetAtTime(intensity * 0.4, this.ctx.currentTime, 0.1);
  }

  playClick() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playCompletion() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const masterGain = this.masterGain;
    const now = ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.5);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.5);
    });
  }

  resume() {
    if (this.ctx?.state === "suspended") {
      this.ctx.resume();
    }
  }
}

export const audioManager = new AudioManager();
