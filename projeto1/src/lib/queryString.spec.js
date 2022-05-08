const { queryString } = require('./queryString');

describe('Object to query string', () => {
  it('should create a valid query string when an object is provided ', () => {
    const obj = {
      name: 'Gustavo',
      profession: 'developer',
    };

    console.log(queryString(obj));

    expect(queryString(obj)).toBe(
      `name=${obj.name}&profession=${obj.profession}`,
    );
  });
});

// describe('Query string to object', () => {

// });
