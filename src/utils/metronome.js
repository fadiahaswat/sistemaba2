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
