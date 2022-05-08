import find from 'lodash/find';
import remove from 'lodash/remove';

export default class Cart {
  constructor() {
    this.items = [];
  }

  add(item) {
    if (!item.quantity || !item.product.name || !item.product.price) {
      throw new Error('Invalid item');
    }

    const itemToFind = { product: item.product };
    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind);
    }

    let newItem = {
      quantity: parseInt(item.quantity, 10),
      product: {
        name: item.product.name,
        price: parseInt(item.product.price, 10),
      },
    };

    this.items.push(newItem);
  }

  remove(product) {
    if (!product.name || !product.price) {
      throw new Error('Invalid product');
    }

    remove(this.items, { product });
  }

  getTotal() {
    return this.items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);
  }

  summary() {
    const total = this.getTotal();
    const items = this.items;

    return { total, items };
  }

  checkout() {
    const { total, items } = this.summary();

    this.items = [];

    return { total, items };
  }
}
