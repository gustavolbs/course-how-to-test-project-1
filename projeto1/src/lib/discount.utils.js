import Money from 'dinero.js';

export const calculatePercentageDiscount = (
  amount,
  { condition, quantity },
) => {
  if (condition?.percentage && quantity > condition.minimum) {
    return amount.percentage(condition.percentage);
  }
  return Money({ amount: 0 });
};

export const calculateQuantityDiscount = (
  amount,
  { condition, quantity, product },
) => {
  debugger;

  if (condition?.quantity && quantity > condition.quantity) {
    const isEven = quantity % 2 === 0;

    if (!isEven) {
      let subtracted = amount.subtract(Money({ amount: product.price }));
      let discount = subtracted.percentage(50);
      return discount;
    }
    return amount.percentage(50);
  }

  return Money({ amount: 0 });
};

export const calculateDiscount = (amount, item) => {
  const list = [item.condition].flat();

  const discounts = list.map(cond => {
    if (cond.percentage) {
      return calculatePercentageDiscount(amount, {
        ...item,
        condition: cond,
        quantity: item.quantity,
      }).getAmount();
    } else if (cond.quantity) {
      return calculateQuantityDiscount(amount, {
        ...item,
        condition: cond,
        quantity: item.quantity,
      }).getAmount();
    }
  });

  return Money({ amount: Math.max(...discounts) });
};
