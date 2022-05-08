const { queryString, parseToObject } = require('./queryString');

describe('Object to query string', () => {
  it('should create a valid query string when an object is provided ', () => {
    const obj = {
      name: 'Gustavo',
      profession: 'developer',
    };

    expect(queryString(obj)).toBe(
      `name=${obj.name}&profession=${obj.profession}`,
    );
  });

  it('should create a valid query string even when an array is passed as value', () => {
    const obj = {
      name: 'Gustavo',
      abilities: ['JS', 'TDD'],
    };

    expect(queryString(obj)).toBe(
      `name=${obj.name}&abilities=${obj.abilities.join(',')}`,
    );
  });

  it('should throw an error when an object is passed as value', () => {
    const obj = {
      name: 'Gustavo',
      abilities: {
        first: 'JS',
        second: 'TDD',
      },
    };

    expect(() => queryString(obj)).toThrowError();
  });
});

describe('Query string to object', () => {
  it('should convert a query to object', () => {
    const obj = {
      name: 'Gustavo',
      profession: 'developer',
    };
    const qs = `name=${obj.name}&profession=${obj.profession}`;

    expect(parseToObject(qs)).toEqual(obj);
  });

  it('should convert a query of a single key-value to object', () => {
    const obj = {
      name: 'Gustavo',
    };
    const qs = `name=${obj.name}`;

    expect(parseToObject(qs)).toEqual(obj);
  });

  it('should convert a query string to an object taking care of comma separated values', () => {
    const obj = {
      name: 'Gustavo',
      abilities: ['JS', 'TDD'],
    };
    const qs = `name=${obj.name}&abilities=${obj.abilities.join(',')}`;

    expect(parseToObject(qs)).toEqual(obj);
  });
});
