const keyValueToString = ([key, value]) => {
  if (typeof value === 'object' && !Array.isArray(value)) {
    throw new Error('Please check your params');
  }
  return `${key}=${value}`;
};

module.exports.queryString = obj =>
  Object.entries(obj).map(keyValueToString).join('&');

module.exports.parseToObject = string =>
  Object.fromEntries(
    string.split('&').map(item => {
      let [key, value] = item.split('=');
      if (value.includes(',')) {
        value = value.split(',');
      }

      return [key, value];
    }),
  );
