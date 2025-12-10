export class DragItemDataService {
  private static _instance: DragItemDataService | undefined;
  private readonly items: Map<string, Record<string, unknown>>;

  private constructor() {
    this.items = new Map<string, Record<string, unknown>>();
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new DragItemDataService();
    }

    return this._instance;
  }

  public contains(key: string) {
    return this.items.has(key);
  }

  public get(key: string) {
    return this.items.get(key);
  }

  public add(key: string, data: Record<string, unknown>) {
    this.items.set(key, data);
  }

  public remove(key: string) {
    this.items.delete(key);
  }

  public clear() {
    this.items.clear();
  }
}
