import find from 'lodash/find';
import remove from 'lodash/remove';

export default class Cart {
  constructor() {
    this.total = 0;
    this.items = [];
  }

  add(item) {
    const itemToFind = { product: item.product };
    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind);
    }
    this.items.push(item);
  }

  getTotal() {
    return this.items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);
  }
}
