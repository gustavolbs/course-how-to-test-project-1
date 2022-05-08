import Cart, {
  calculateQuantityDiscount,
  calculatePercentageDiscount,
} from './Cart';
import Money from 'dinero.js';

describe('Cart', () => {
  let cart;

  const product = {
    name: 'MacBook Pro',
    price: 35388,
  };

  const product2 = {
    name: 'iPad Pro',
    price: 12314,
  };

  beforeEach(() => {
    cart = new Cart();
  });

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created instance', () => {
      expect(cart.getTotal()).toEqual(0);
    });

    it('should multiply quantity and price and receive the total amount', () => {
      const item = { quantity: 2, product };
      cart.add(item);
      expect(cart.getTotal()).toEqual(item.quantity * item.product.price);
    });

    it('should multiply quantity and price even if they are strings and receive the total amount', () => {
      const item = { quantity: '2', product };
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

    it('should throw an error when an invalid item is added', () => {
      expect(() => {
        cart.add({
          quantity: undefined,
          product,
        });
      }).toThrowError();

      expect(() => {
        cart.add({
          quantity: 1,
          product: {
            name: '',
            price: undefined,
          },
        });
      }).toThrowError();

      expect(() => {
        cart.add();
      }).toThrowError();

      expect(() => {
        cart.add([]);
      }).toThrowError();
    });

    it('should throw an error when an invalid product is removed', () => {
      cart.add({
        quantity: 1,
        product,
      });

      expect(() => {
        cart.remove();
      }).toThrowError();

      expect(() => {
        cart.remove('product');
      }).toThrowError();

      expect(() => {
        cart.remove(1);
      }).toThrowError();

      expect(() => {
        cart.remove([]);
      }).toThrowError();

      expect(() => {
        cart.remove({});
      }).toThrowError();

      expect(() => {
        cart.remove({
          name: undefined,
          price: undefined,
        });
      }).toThrowError();
    });

    it('should update total when a product gets included and then removed', () => {
      cart.add({
        quantity: 2,
        product,
      });
      cart.add({
        quantity: 1,
        product: product2,
      });

      cart.remove(product);

      expect(cart.getTotal()).toEqual(1 * product2.price);
    });
  });

  describe('checkout()', () => {
    it('should return an object with the total and the list of items', () => {
      cart.add({
        quantity: 2,
        product,
      });
      cart.add({
        quantity: 3,
        product: product2,
      });

      expect(cart.checkout()).toMatchSnapshot();
    });

    it('should return an object with the total and the list of items when summary() is called', () => {
      cart.add({
        quantity: 2,
        product,
      });
      cart.add({
        quantity: 3,
        product: product2,
      });

      expect(cart.summary()).toMatchSnapshot();
      expect(cart.getTotal()).toBeGreaterThan(0);
    });

    it('should reset the cart when checkout() is called', () => {
      cart.add({
        quantity: 3,
        product: product2,
      });

      cart.checkout();

      expect(cart.getTotal()).toEqual(0);
    });
  });

  describe('special conditions', () => {
    it('should apply percentage discount when quantity above minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 3,
      });

      const discountMultiplier = (100 - condition.percentage) / 100;

      expect(cart.getTotal()).toEqual(
        Math.ceil(product.price * 3 * discountMultiplier),
      );
    });

    it('should NOT apply percentage discount when quantity is below minimum', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 2,
      });

      expect(cart.getTotal()).toEqual(product.price * 2);
    });

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 6,
      });

      const discountMultiplier = 0.5;

      expect(cart.getTotal()).toEqual(
        Math.ceil(product.price * 6 * discountMultiplier),
      );
    });

    it('should NOT apply quantity discount when quantity is below minimum', () => {
      const condition = {
        quantity: 6,
      };

      cart.add({
        product,
        condition,
        quantity: 6,
      });

      expect(cart.getTotal()).toEqual(product.price * 6);
    });

    it('should apply quantity discount for odd quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 7,
      });

      const discountMultiplier = 0.5;
      const fourProductsWithDiscount = product.price * 6 * discountMultiplier;

      expect(cart.getTotal()).toEqual(
        Math.ceil(fourProductsWithDiscount + product.price),
      );
    });

    it('should apply no discount when item condition is not defined', () => {
      const item = {
        product,
        condition: undefined,
        quantity: 7,
      };

      const discountQuantity = calculateQuantityDiscount(
        Money({ amount: 0 }),
        item,
      );
      const discountPercentage = calculatePercentageDiscount(
        Money({ amount: 0 }),
        item,
      );

      expect(discountQuantity.getAmount()).toEqual(0);
      expect(discountPercentage.getAmount()).toEqual(0);
    });
  });
});
