

export default class BeepBox {
  constructor() {
    this.ctx = new AudioContext();
    const vco = this.ctx.createOscillator();
    vco.type = vco.SINE;
    vco.start(0);

    const vca = this.ctx.createGain();
    vca.gain.value = 0;

    vco.connect(vca);
    vca.connect(this.ctx.destination);

    this.vco = vco;
    this.vca = vca;

    this.activeNotes = [];
  }

  playNote(freq) {
    this.vco.frequency.value = freq;
    this.vca.gain.value = 1;
    this.activeNotes.push(freq);
    setTimeout(this.endNote.bind(this), 300);
  }

  endNote() {
    this.activeNotes.shift();
    if (this.activeNotes.length === 0) {
      this.vca.gain.value = 0;
    }  
  }
}
