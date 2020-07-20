import {Queue} from "./Queue";
import {Game} from "./Game";
import {Constants} from "../utils/Constants";
import {FibboGenerator} from "./FibboGenerator";
import {FibboDifficulty} from "./FibboDifficulty";
import {Target} from "./Target";

export class FibboQueue {

  static BEGINNER_QUEUE = new Queue<Game>();
  static NOVICE_QUEUE = new Queue<Game>();
  static ADVANCED_QUEUE = new Queue<Game>();
  static EXPERT_QUEUE = new Queue<Game>();

  static QUEUE_STATES = FibboQueue.initializeQueueStates();
  static SATISFIED_CAPACITY = 15;
  static CRITICAL_CAPACITY = 3;
  static FULL_CAPACITY = 50;

  static INITIALIZE_TIMEOUT = 400;
  static STANDARD_TIMEOUT = 100;
  static CRITICAL_TIMEOUT = 250;

  static INITIALIZED = false;

  static initialize() {

    if (FibboQueue.INITIALIZED) {
      return;
    } else {
      FibboQueue.INITIALIZED = true;
    }

    FibboQueue.initializeQueueStates();

    const currentTime = Date.now();

    while (Date.now() - currentTime < FibboQueue.INITIALIZE_TIMEOUT) {

      const target = new Target();

      const game = FibboGenerator.generate(target.get());
      const difficulty = FibboDifficulty.getDifficulty(game);
      game.difficulty = difficulty;
      const queue = FibboQueue.getQueue(difficulty);

      if (queue.getSize() < FibboQueue.FULL_CAPACITY) {
        queue.enqueue(game);
      }
    }

    FibboQueue.setQueueStates();
  }

  static getGame(difficulty: string): Game {

    const state = FibboQueue.QUEUE_STATES[difficulty];
    let force = false;
    let timeout: number = null;
    let target: Target = new Target();

    switch (state) {
      case Constants.QUEUE_EMPTY:
        force = true;
        timeout = FibboQueue.CRITICAL_TIMEOUT;

        if (difficulty === Constants.BEGINNER_DIFFICULTY) {
          target.configure(1, 0, 0);
        } else if (difficulty === Constants.EXPERT_DIFFICULTY) {
          target.configure(0, 0, 1);
        } else {
          target.configure(0, 1, 0);
        }
        break;

      case Constants.QUEUE_CRITICAL:
        timeout = FibboQueue.CRITICAL_TIMEOUT;

        if (difficulty === Constants.BEGINNER_DIFFICULTY) {
          target.configure(0.8, 0.2, 0);
        } else if (difficulty === Constants.EXPERT_DIFFICULTY) {
          target.configure(0, 0.2, 0.8);
        } else {
          target.configure(0.1, 0.8, 0.1);
        }
        break;

      case Constants.QUEUE_NOT_SATISFIED:
        timeout = FibboQueue.STANDARD_TIMEOUT;

        if (difficulty === Constants.BEGINNER_DIFFICULTY) {
          target.configure(0.6, 0.3, 0.1);
        } else if (difficulty === Constants.EXPERT_DIFFICULTY) {
          target.configure(0.1, 0.3, 0.6);
        } else {
          target.configure(0.2, 0.6, 0.2);
        }
        break;

      default:
        timeout = FibboQueue.STANDARD_TIMEOUT;
    }

    const currentTime = Date.now();
    let thisDifficultyGenerated = false;

    while (Date.now() - currentTime < timeout || (force && !thisDifficultyGenerated)) {

      const game = FibboGenerator.generate(target.get());
      const gameDifficulty = FibboDifficulty.getDifficulty(game);
      game.difficulty = gameDifficulty;
      const queue = FibboQueue.getQueue(gameDifficulty);

      if (difficulty === gameDifficulty) {
        thisDifficultyGenerated = true;
      }

      if (
        queue.getSize() < FibboQueue.FULL_CAPACITY &&
        (!force || difficulty === gameDifficulty)
      ) {
        queue.enqueue(game);
      }
    }

    FibboQueue.setQueueStates();

    return FibboQueue.getQueue(difficulty).dequeue();

  }


  static initializeQueueStates(): any {
    FibboQueue.QUEUE_STATES = {};
    Constants.ALL_DIFFICULTIES.forEach(function (difficulty) {
      FibboQueue.QUEUE_STATES[difficulty] = Constants.QUEUE_EMPTY;
    });
  }

  static setQueueStates(): void {

    Constants.ALL_DIFFICULTIES.forEach(function (difficulty) {
      const queue = FibboQueue.getQueue(difficulty);

      if (FibboQueue.isEmpty(queue)) {
        FibboQueue.QUEUE_STATES[difficulty] = Constants.QUEUE_EMPTY;

      } else if (FibboQueue.isCritical(queue)) {
        FibboQueue.QUEUE_STATES[difficulty] = Constants.QUEUE_CRITICAL;

      } else if (FibboQueue.isSatisfied(queue)) {
        FibboQueue.QUEUE_STATES[difficulty] = Constants.QUEUE_SATISFIED;

      } else if (FibboQueue.isNotSatisfied(queue)) {
        FibboQueue.QUEUE_STATES[difficulty] = Constants.QUEUE_NOT_SATISFIED;

      } else if (FibboQueue.isFull(queue)) {
        FibboQueue.QUEUE_STATES[difficulty] = Constants.QUEUE_FULL;
      }
    })
  }

  static getQueue(difficulty: string): Queue<Game> {

    if (difficulty === Constants.BEGINNER_DIFFICULTY) {
      return FibboQueue.BEGINNER_QUEUE;
    } else if (difficulty === Constants.NOVICE_DIFFICULTY) {
      return FibboQueue.NOVICE_QUEUE;
    } else if (difficulty === Constants.ADVANCED_DIFFICULTY) {
      return FibboQueue.ADVANCED_QUEUE;
    } else if (difficulty === Constants.EXPERT_DIFFICULTY) {
      return FibboQueue.EXPERT_QUEUE;
    }
  }

  static isEmpty(queue: Queue<Game>): boolean {
    return queue.isEmpty();
  }

  static isCritical(queue: Queue<Game>): boolean {
    return !queue.isEmpty() &&
    queue.getSize() <= FibboQueue.CRITICAL_CAPACITY;
  }

  static isNotSatisfied(queue: Queue<Game>): boolean {
    return !FibboQueue.isEmpty(queue) &&
      !FibboQueue.isCritical(queue) &&
      queue.getSize() <= FibboQueue.SATISFIED_CAPACITY;
  }

  static isSatisfied(queue: Queue<Game>): boolean {
    return !FibboQueue.isFull(queue) &&
      queue.getSize() >= FibboQueue.SATISFIED_CAPACITY;
  }

  static isFull(queue: Queue<Game>): boolean {
    return queue.getSize() === FibboQueue.FULL_CAPACITY;
  }

  static log(): void {

    let sizes = 'Sizes:\n';
    Constants.ALL_DIFFICULTIES.forEach(function (difficulty) {
      sizes += '\t' + difficulty + ': ' + FibboQueue.getQueue(difficulty).getSize() + '\n';
    });

    let states = 'States:\n';
    Constants.ALL_DIFFICULTIES.forEach(function (difficulty) {
      states += '\t' + difficulty + ': ' + FibboQueue.QUEUE_STATES[difficulty] + '\n';
    });

    console.log(sizes + '\n' + states);
  }
}
