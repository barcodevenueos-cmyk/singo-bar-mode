// Web Speech API for voice announcements
const synth = typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis : null;

let selectedVoice = null;

// Initialize voice (pick a good English voice)
export const initVoice = () => {
  if (!synth) return;
  
  const voices = synth.getVoices();
  
  // Try to find a good quality English voice
  selectedVoice = voices.find(voice => 
    voice.lang.startsWith('en') && (
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen')
    )
  ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
};

// Call voice initialization when voices are loaded
if (synth) {
  if (synth.getVoices().length > 0) {
    initVoice();
  } else {
    synth.onvoiceschanged = initVoice;
  }
}

export const speakNumber = (number) => {
  if (!synth || !number) return;
  
  // Cancel any ongoing speech
  synth.cancel();
  
  // Determine letter based on number
  let letter = '';
  if (number >= 1 && number <= 15) letter = 'B';
  else if (number >= 16 && number <= 30) letter = 'I';
  else if (number >= 31 && number <= 45) letter = 'N';
  else if (number >= 46 && number <= 60) letter = 'G';
  else if (number >= 61 && number <= 75) letter = 'O';
  
  const text = `${letter} ${number}`;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  synth.speak(utterance);
};

export const speakText = (text) => {
  if (!synth) return;
  
  synth.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  synth.speak(utterance);
};

export const stopSpeaking = () => {
  if (synth) {
    synth.cancel();
  }
};
