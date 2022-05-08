import Cart from './Cart';

describe('Cart', () => {
  let cart;

  const product = {
    name: 'MacBook Pro',
    price: 35388,
  };

  beforeEach(() => {
    cart = new Cart();
  });

  it('should return 0 when getTotal() is executed in a newly created instance', () => {
    expect(cart.getTotal()).toEqual(0);
  });

  it('should multiply quantity and price and receive the total amount', () => {
    const item = { quantity: 2, product };
    cart.add(item);
    expect(cart.getTotal()).toEqual(item.quantity * item.product.price);
  });

  it('should ensure no more than one product exists at a time', () => {
    cart.add({
      quantity: 2,
      product,
    });
    cart.add({
      quantity: 1,
      product,
    });

    expect(cart.getTotal()).toEqual(1 * product.price);
  });
});
