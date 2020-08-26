
export class LCRNG {
  static value = 1000;
  static multiplier = 24693;
  static increment = 3967;
  static modulus = Math.pow(2, 32) - 1;

  static getSeed(): number {
    return LCRNG.value;
  }

  static setSeed(seed: number): void {
    this.value = seed;
  }

  static random(): number {
    LCRNG.value = (( LCRNG.multiplier * LCRNG.value ) + LCRNG.increment ) % LCRNG.modulus;
    return LCRNG.value / LCRNG.modulus;
  }

  // Does NOT use the LCRNG
  static getIntFromMathRand(): number {
    return Math.floor(Math.random() * (Math.pow(2, 32) - 1) );
  }
}
