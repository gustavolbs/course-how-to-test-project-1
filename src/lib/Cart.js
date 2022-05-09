import find from 'lodash/find';
import remove from 'lodash/remove';
import Money from 'dinero.js';
import { calculateDiscount } from './discount.utils';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

export default class Cart {
  constructor() {
    this.items = [];
  }

  add(item) {
    const { quantity, product, condition } = item;
    if (!quantity || !product.name || !product.price) {
      throw new Error('Invalid item');
    }

    const itemToFind = { product };
    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind);
    }

    let newItem = {
      quantity: parseInt(quantity, 10),
      product: {
        name: product.name,
        price: parseInt(product.price, 10),
      },
      ...(condition ? { condition: condition } : {}),
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
    return this.items
      .reduce((acc, item) => {
        const { quantity, product, condition } = item;
        const amount = Money({ amount: quantity * product.price });
        let discount = Money({ amount: 0 });

        if (condition) {
          discount = calculateDiscount(amount, item);
        }

        return acc.add(amount).subtract(discount);
      }, Money({ amount: 0 }))
      .getAmount();
  }

  summary() {
    const total = this.getTotal();
    const formatted = Money({ amount: total }).toFormat('$0,0.00');
    const items = this.items;

    return { total, formatted, items };
  }

  checkout() {
    const { total, items, formatted } = this.summary();

    this.items = [];

    return { total, items, formatted };
  }
}
