export function sum(num1, num2) {
  num1 = parseInt(num1, 10);
  num2 = parseInt(num2, 10);

  if (Number.isNaN(num1) || Number.isNaN(num2)) {
    throw new Error('The value provided is not a valid number');
  }

  return num1 + num2;
}
