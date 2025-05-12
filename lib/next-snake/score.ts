export class Score {
  private score: number = 0;
  private constructor() {}

  private static instance: Score | undefined;

  static getInstanc(): Score {
    if (this.instance === undefined) this.instance = new Score();
    return this.instance;
  }

  getScore() {
    return this.score;
  }

  addScore(point: number) {
    this.score = this.score + point;
  }

  setScore(num: number) {
    this.score = num;
  }
}
