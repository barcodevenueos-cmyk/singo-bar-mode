// Create simple sound effects using Web Audio API
const audioContext = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext) 
  ? new (window.AudioContext || window.webkitAudioContext)() 
  : null;

const createBeep = (frequency, duration, volume = 0.3) => {
  if (!audioContext) return null;
  
  return () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };
};

const sounds = {
  numberCall: createBeep(800, 0.1, 0.3),
  daub: createBeep(1200, 0.05, 0.2),
  win: () => {
    if (!audioContext) return;
    
    // Play a celebratory chord
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      setTimeout(() => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.5);
      }, i * 100);
    });
  },
  click: createBeep(600, 0.03, 0.1)
};

export const playSound = (soundName) => {
  if (sounds[soundName] && audioContext) {
    // Resume audio context if suspended (required by browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    sounds[soundName]();
  }
};

export default sounds;