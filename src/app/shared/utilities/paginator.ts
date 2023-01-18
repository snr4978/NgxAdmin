export class Paginator {

  private _size: number = 30;
  private _index: number = 0;
  private _total: number = 0;
  private _items: any[] = [];

  public get size() {
    return this._size;
  }

  public get index() {
    return this._index;
  }

  public get total() {
    return this._total;
  }

  public get items() {
    return this._items;
  }

  public async request<T extends { items: any[], total: number }>(func: (offset: number, limit: number) => Promise<T>, size: number, index: number): Promise<boolean> {
    this._size = size;
    this._index = index;
    let res: T | undefined;
    let lastPage: number = -1;
    while (this._index > lastPage) {
      lastPage > -1 && (this._index = lastPage);
      res = await func(this._size * this._index, this._size);
      lastPage = res ? Math.max(0, Math.ceil(res.total / this._size) - 1) : Number.MAX_VALUE;
    }
    if (res) {
      this._total = res.total;
      this._items = res.items;
      return true;
    }
    else {
      this._total = 0;
      this._items = [];
      return false;
    }
  }
}
