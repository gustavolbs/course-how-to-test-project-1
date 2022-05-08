import find from 'lodash/find';
import remove from 'lodash/remove';
import Money from 'dinero.js';

export const calculatePercentageDiscount = (amount, item) => {
  if (item.condition?.percentage && item.quantity > item.condition.minimum) {
    return amount.percentage(item.condition.percentage);
  }
  return Money({ amount: 0 });
};

export const calculateQuantityDiscount = (amount, item) => {
  if (item.condition?.quantity && item.quantity > item.condition.quantity) {
    const isEven = item.quantity % 2 === 0;

    if (!isEven) {
      let subtracted = amount.subtract(Money({ amount: item.product.price }));
      let discount = subtracted.percentage(50);
      return discount;
    }
    return amount.percentage(50);
  }

  return Money({ amount: 0 });
};

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

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
      ...(item.condition ? { condition: item.condition } : {}),
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
        const amount = Money({ amount: item.quantity * item.product.price });
        let discount = Money({ amount: 0 });

        if (item.condition?.percentage) {
          discount = calculatePercentageDiscount(amount, item);
        } else if (item.condition?.quantity) {
          discount = calculateQuantityDiscount(amount, item);
        }

        return acc.add(amount).subtract(discount);
      }, Money({ amount: 0 }))
      .getAmount();
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
