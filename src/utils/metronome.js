import * as Tone from 'tone';

let synth = null;
let currentBpm = null;
let isPlaying = false;
let updateCallback = null;

let currentBeat = 0;

export const initSynth = () => {
  if (!synth) {
    // Synth berfrekuensi tinggi dengan gelombang tajam agar menusuk dan sangat jelas terdengar di speaker HP / laptop
    synth = new Tone.Synth({
      oscillator: { type: 'square' }, // Gelombang square agar tajam dan tembus suara bising
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.02 }
    }).toDestination();
    // Naikkan volume output agar maksimal
    synth.volume.value = 6;
  }
};

export const startMetronome = async (bpm, onTick) => {
  await Tone.start();
  initSynth();

  // Pastikan berhenti total dan bersihkan seluruh schedule lama
  Tone.Transport.stop();
  Tone.Transport.cancel();
  Tone.Transport.position = 0;

  Tone.Transport.bpm.value = bpm;
  currentBpm = bpm;
  isPlaying = true;
  currentBeat = 0;

  Tone.Transport.scheduleRepeat((time) => {
    // Pola 4/4 Ketukan Nyaring:
    // Beat 1 (TIK): 2500 Hz (C7 tajam / piercing)
    // Beat 2,3,4 (TAK): 1200 Hz (D6 jernih & tegas)
    const isFirstBeat = (currentBeat % 4) === 0;
    const note = isFirstBeat ? 'C7' : 'D6';
    synth.triggerAttackRelease(note, '32n', time);

    const beatNum = (currentBeat % 4) + 1;
    currentBeat++;

    if (onTick) {
      Tone.Draw.schedule(() => {
        onTick(bpm, isFirstBeat, beatNum);
      }, time);
    }
  }, '4n');

  Tone.Transport.start();
};

export const stopMetronome = () => {
  Tone.Transport.stop();
  Tone.Transport.cancel();
  Tone.Transport.position = 0;
  isPlaying = false;
  currentBpm = null;
  currentBeat = 0;
};

export const getMetronomeState = () => ({
  isPlaying,
  currentBpm,
});

// Getaran Haptik HP (Vibration API) untuk Smartphone Android / Browser pendukung
export const triggerHapticVibrate = (pattern = 200) => {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    console.warn('Vibration API not supported or blocked:', e);
  }
};

// Suara Peringatan Timer Lapangan Menggunakan Web Audio API (Sangat ringan dan tidak delay)
let sharedAudioCtx = null;

export const playAlertSound = (type = 'beep') => {
  try {
    // Jalankan getaran haptik HP
    if (type === 'beep') {
      // Getar sekali 250ms saat 60s, 30s, 15s
      triggerHapticVibrate(250);
    } else if (type === 'countdown') {
      // Getar cepat tegas 150ms saat 3, 2, 1
      triggerHapticVibrate(150);
    } else if (type === 'timesup') {
      // Pola getar panjang berturut-turut saat Waktu Habis: getar 400ms, jeda 100ms, getar 400ms, jeda 100ms, getar 600ms
      triggerHapticVibrate([400, 100, 400, 100, 600]);
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }

    const ctx = sharedAudioCtx;

    if (type === 'beep') {
      // Beep tunggal 880Hz (A5) jernih untuk sisa 60s, 30s, 15s
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'countdown') {
      // Beep tegas bernada tinggi 1200Hz untuk 3, 2, 1
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'timesup') {
      // Long Buzzer ganda bernada rendah 440Hz -> 330Hz penanda WAKTU HABIS
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    }
  } catch (err) {
    console.error('Audio alert error:', err);
  }
};
