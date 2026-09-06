/* 
 * Convalt Energy - UI Audio Controller: AudioSynthesizer.js
 * Procedural Web Audio API Ambient Sound Drone Generator
 */

export class AudioSynthesizer {
  constructor() {
    this.isMuted = true;
    this.audioCtx = null;
    this.masterGain = null;
    this.oscillators = [];
  }

  initAudio() {
    if (this.audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.audioCtx = new AudioContext();

    // Master Gain
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);

    // Lowpass Filter for calm, warm ambient tone
    this.filter = this.audioCtx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);

    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.audioCtx.destination);

    // Create 3 harmonic warm sine oscillators (Deep C Major chord: C2, G2, E3)
    const freqs = [65.41, 98.00, 164.81];
    freqs.forEach((freq) => {
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Subtle LFO for organic ambient swelling
      const lfo = this.audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.1, this.audioCtx.currentTime);
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(4.0, this.audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(this.filter);
      osc.start();
      this.oscillators.push(osc);
    });
  }

  toggle() {
    if (!this.audioCtx) {
      this.initAudio();
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isMuted = !this.isMuted;

    if (this.masterGain) {
      const targetGain = this.isMuted ? 0.0001 : 0.15;
      this.masterGain.gain.exponentialRampToValueAtTime(
        targetGain,
        this.audioCtx.currentTime + 1.5
      );
    }

    return this.isMuted;
  }
}
