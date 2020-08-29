import {Constants} from "../utils/Constants";
import {LCRNG} from "./LCRNG";
import {FibboGenerator} from "./FibboGenerator";
import {FibboDifficulty} from "./FibboDifficulty";
import {Game} from "./models/Game";

export class GameEncoder {

  static ENCODING_CHARS: string[] = null;

  static buildFromCodeString(codeString: string): Game {

    // Parse and validate string format. Convert string to 40-bit number
    let code = GameEncoder.validateStringAndGenerateCode(codeString);
    if (code === null) return null;

    let pattern = Constants.GEN_ONE_PATTERN;

    // Use pattern to separate keyWithTarget and seed
    const seedArray: boolean[] = [];
    const keyWithTargetArray: boolean[] = [];
    for (let i = 0; i < 40; i++) {
      if (pattern % 2) {
        keyWithTargetArray.push(code % 2 === 1);
      } else {
        seedArray.push(code % 2 === 1);
      }
      pattern = GameEncoder.rightShift(pattern, 1);
      code = GameEncoder.rightShift(code, 1);
    }

    // Build seed from reverse of seedArray
    let seed = 0;
    while (seedArray.length !== 0) {
      seed *= 2;
      if (seedArray.pop()) seed++;
    }

    // Build keyWithTarget from reverse of keyWithTargetArray
    let keyWithTarget = 0;
    while (keyWithTargetArray.length !== 0) {
      keyWithTarget *= 2;
      if (keyWithTargetArray.pop()) keyWithTarget++;
    }

    // Determine the expected value of key using seed
    let expectedKey = 0;
    LCRNG.setSeed(seed);
    for (let i = 0; i < 6; i++) {
      expectedKey <<= 1;
      if (LCRNG.random() < 0.5) {
        expectedKey++;
      }
    }

    // Get indices of MSB and LSB of target in key. For example, an index of 0 means that data
    // is stored as the first bit of key
    const indexMSB = Math.floor(LCRNG.random() * 8);
    let indexLSB = Math.floor(LCRNG.random() * 8);

    // Handle if both indices are the same
    while (indexLSB === indexMSB) {
      indexLSB = Math.floor(LCRNG.random() * 8);
    }

    const target = GameEncoder.validateKeyAndDecodeTarget(
      keyWithTarget,
      expectedKey,
      indexLSB,
      indexMSB
    );
    if (target === null) return null;

    // Build game
    const game = FibboGenerator.generate(target, seed);
    game.difficulty = FibboDifficulty.getDifficulty(game);

    return game;
  }

  static generateCodeString(seed: number, target: number): string {

    // Determine key using seed
    let key = 0;
    LCRNG.setSeed(seed);
    for (let i = 0; i < 6; i++) {
      key <<= 1;
      if (LCRNG.random() < 0.5) {
        key++;
      }
    }

    // Indices of MSB and LSB of target in key. For example, an index of 0 means that data
    // will be stored as the first bit of key
    const indexMSB = Math.floor(LCRNG.random() * 8);
    let indexLSB = Math.floor(LCRNG.random() * 8);

    // Handle when both indices are the same
    while (indexLSB === indexMSB) {
      indexLSB = Math.floor(LCRNG.random() * 8);
    }

    // Combine key and target
    const keyWithTarget = GameEncoder.combineKeyAndTarget(
      key,
      GameEncoder.getTargetCode(target),
      indexLSB,
      indexMSB
    );

    // Combine seed and key/target
    let code = GameEncoder.combineSeedAndKey(
      seed,
      keyWithTarget,
      Constants.GEN_ONE_PATTERN
    );

    // Convert each set of 5 bits to a character and push onto a stack
    const charStack: string[] = [];
    for (let i = 0; i < 8; i++) {
      const charId = GameEncoder.getLeastSigBits(code, 5);
      charStack.push(GameEncoder.getChar(charId));
      code = GameEncoder.rightShift(code, 5);
    }

    // Remove chars from stack and build final code string
    let codeString = '';
    while (charStack.length > 0) {
      codeString += charStack.pop();
      if (charStack.length === 4) {
        codeString += '-';
      }
    }

    return codeString;
  }

  private static combineKeyAndTarget(key: number, targetCode: number, indexLSB: number, indexMSB: number): number {

    // Add target to keyWithTargetArray
    const keyWithTargetArray: boolean[] = [];
    for (let i = 0; i < 8; i++) {
      if (i === 7 - indexLSB) {
        keyWithTargetArray.push(targetCode % 2 === 1);

      } else if (i === 7 - indexMSB) {
        keyWithTargetArray.push(targetCode !== 1);

      } else {
        keyWithTargetArray.push(key % 2 === 1);
        key >>= 1;
      }
    }

    // Build keyWithTarget from the reverse of keyWithTargetArray
    let keyWithTarget = 0;
    while (keyWithTargetArray.length !== 0) {
      keyWithTarget <<= 1;
      if (keyWithTargetArray.pop()) keyWithTarget++;
    }

    return keyWithTarget;
  }

  private static combineSeedAndKey(seed: number, key: number, pattern: number): number {

    // Set the necessary bits to match pattern
    const codeArray: boolean[] = [];
    for (let i = 0; i < 40; i++) {
      if (pattern % 2) {
        // set bit according to key
        codeArray.push(key % 2 === 1);
        key = GameEncoder.rightShift(key, 1);
      } else {
        // add next bit from seed to codeArray
        codeArray.push(seed % 2 === 1);
        seed = GameEncoder.rightShift(seed, 1);
      }
      pattern = GameEncoder.rightShift(pattern, 1);
    }

    // Build code from reverse of codeArray
    let code = 0;
    while (codeArray.length !== 0) {
      code *= 2;
      if (codeArray.pop()) code++;
    }

    return code;
  }

  private static validateStringAndGenerateCode(codeString: string): number {

    // Split string on hyphen. Validate that there are two elements in the resulting array
    const splitOnHyphen = codeString.split('-');
    if (splitOnHyphen.length != 2) {
      console.error('Game could not be built from code ' + codeString + '. Incorrect hyphenation.');
      return null;
    }

    // Split strings on each character. Validate that there are 8 characters in the charArray
    const charArray: string[] = [];
    splitOnHyphen.forEach(function (s) {
      charArray.push(...s.split(''));
    });
    if (charArray.length !== 8) {
      console.error('Game could not be built from code ' + codeString + '. Incorrect number of characters.');
      return null;
    }

    // Convert each character in the array to its id. Ensure that all characters are valid
    const charIdArray: number[] = [];
    let invalid = false;
    charArray.forEach(function (c) {
      const id = GameEncoder.getCharId(c);
      if (id === null) {
        console.error('Game could not be built from code ' + codeString + '. \'' + c + '\' is not a valid character.');
        invalid = true;
      }
      charIdArray.push(GameEncoder.getCharId(c));
    });
    if (invalid) return null;

    // Combine character ids to form 40-bit integer
    let code = 0;
    charIdArray.forEach(function (id) {
      code = GameEncoder.leftShift(code, 5);
      code += id;
    });

    return code;
  }

  private static validateKeyAndDecodeTarget(
    keyWithTarget: number,
    expectedKey: number,
    indexLSB: number,
    indexMSB: number): number {

    // Separate targetCode and key
    let targetCode = 0;
    let keyArray: boolean[] = [];
    for (let i = 0; i < 8; i++) {
      if (7 - indexLSB === i) {
        targetCode += (keyWithTarget % 2);
      } else if (7 - indexMSB === i) {
        targetCode += 2 * (keyWithTarget % 2);
      } else {
        keyArray.push(keyWithTarget % 2 === 1);
      }
      keyWithTarget >>= 1;
    }

    // Build key from the reverse of keyArray
    let key = 0;
    while (keyArray.length !== 0) {
      key *= 2;
      if (keyArray.pop()) key++;
    }

    // Validate key
    if (key !== expectedKey) {
      console.error('Game could not be created. Validation failed.');
      return null;
    }

    return GameEncoder.getTargetFromTargetCode(targetCode);
  }

  static getLeastSigBits(n: number, bits: number): number {
    let nCopy = GameEncoder.rightShift(n, bits);
    nCopy = GameEncoder.leftShift(nCopy, bits);
    return nCopy ^ n;
  }

  static leftShift(n: number, bits: number): number {
    return n * Math.pow(2, bits);
  }

  static rightShift(n: number, bits: number): number {
    return Math.floor(n / Math.pow(2, bits));
  }

  static toBitString(n: number, bitLength: number): string {
    let s = '';
    for (let i = 0; i < bitLength; i++) {
      if (n % 2) {
        s += '1';
      } else {
        s += '0';
      }
      n = GameEncoder.rightShift(n, 1);
    }

    // Reverse string
    const splitString = s.split('');
    const reverseArray = splitString.reverse();

    return reverseArray.join('');
  }

  private static initEncodingChars(): void {

    // Characters to ignore because they look too similar to others
    const ignoreChars = ['l', 'j', 'i'];

    GameEncoder.ENCODING_CHARS = [];
    for (let i = 1; i < 10; i++) {
      GameEncoder.ENCODING_CHARS.push(i.toString(10));
    }
    for (let i = 97; i < 123; i++) {
      const char = String.fromCharCode(i);
      if (!ignoreChars.includes(char)) GameEncoder.ENCODING_CHARS.push(char);
    }
  }

  static getChar(id: number): string {

    // Initialize ENCODING_CHARS, if necessary
    if (GameEncoder.ENCODING_CHARS === null) {
      GameEncoder.initEncodingChars();
    }

    if (id >= 0 && id < 32) {
      return GameEncoder.ENCODING_CHARS[id];
    }
    return null;
  }

  static getCharId(char: string): number {

    // Initialize ENCODING_CHARS, if necessary
    if (GameEncoder.ENCODING_CHARS === null) {
      GameEncoder.initEncodingChars();
    }

    const index = GameEncoder.ENCODING_CHARS.indexOf(char);
    if (index === -1) {
      return null;
    }
    return index;
  }

  static getTargetCode(target: number): number {

    // Encode target in 2 bits as 1, 2, or 3
    switch (target) {
      case 34:
        return 1;
      case 55:
        return 2;
      case 89:
        return 3;
      default:
        console.error('Invalid target passed to GameEncoder.getTargetCode()');
        return null;
    }
  }

  static getTargetFromTargetCode(targetCode: number): number {
    switch (targetCode) {
      case 1:
        return 34;
      case 2:
        return 55;
      case 3:
        return 89;
      default:
        console.error('Invalid targetCode passed to GameEncoder.getTargetFromTargetCode()');
        return null;
    }
  }
}
