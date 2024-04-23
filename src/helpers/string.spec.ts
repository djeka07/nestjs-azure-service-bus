import { toUpper } from './string';

describe('GIVEN toUpper', () => {
  test('WHEN string THEN return string in uppercase', () => {
    expect(toUpper('test')).toBe('TEST');
  });
  test('WHEN undefined THEN return empty string', () => {
    const obj = {};
    expect(toUpper(undefined)).toBe('');
  });

  test('WHEN null THEN return empty string', () => {
    expect(toUpper(null)).toBe('');
  });

  test('WHEN uppercase string THEN return a string uppercase', () => {
    expect(toUpper('TEST')).toBe('TEST');
  });
});
