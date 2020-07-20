
export class Queue<T> {
  queue: T[];
  headIndex: number;
  size: number;

  constructor() {
    this.queue = [];
    this.headIndex = 0;
    this.size = 0;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  dequeue(): T {
    if (this.size > 0) {
      const item: T = this.queue[this.headIndex];
      this.queue[this.headIndex] = null;
      this.size--;

      if (!this.isEmpty()) {
        this.headIndex++;
      }

      if (this.headIndex > 10) {
        this.queue = this.queue.slice(this.headIndex, this.queue.length - 1);
        this.headIndex = 0;
      }

      return item;
    }

    return null;
  }

  enqueue(item: T): void {
    if (item !== null && item !== undefined) {
      this.queue.push(item);
      this.size++;
    }
  }

  getSize(): number {
    return this.size;
  }
}
