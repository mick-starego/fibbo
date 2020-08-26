
export class Queue<T> {
  private queue: T[];
  private headIndex: number;
  private size: number;

  constructor() {
    this.queue = [];
    this.headIndex = 0;
    this.size = 0;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  dequeue(): T {
    if (this.size > 1) {
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

      if (item === null) {
        console.log('here');
      }

      return item;

    } else if (this.size === 1) {
      const item: T = this.queue[this.headIndex];
      this.size = 0;
      this.queue = [];
      this.headIndex = 0;

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

  toString(): string {
    let qString = 'queue:\n';
    for (let i = 0; i < this.queue.length; i++) {
      qString += '\t' + i + ': ' + this.queue[i] + '\n';
    }
    qString += 'headIndex: ' + this.headIndex + '\n';
    qString += 'size: ' + this.size;

    return qString;
  }
}
