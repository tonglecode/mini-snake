export default class RateMove {
  private index: number;
  constructor(
    private sp: { x: number; y: number },
    private ep: { x: number; y: number },
    private rate: 3
  ) {
    this.index = 0;
  }
  // sx:1, ex:7

  getPosition() {
    while (this.index < this.rate) {
      this.index++;
      const moveLength = this.sp.x - this.ep.x;
      const moveStepX = moveLength / this.rate;
    }
  }
}
