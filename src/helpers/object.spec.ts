import { isEmpty } from './object';

describe('GIVEN isEmpty', () => {
  test('WHEN object is not empty THEN return false', () => {
    const obj = { test: 'test' };
    expect(isEmpty(obj)).toBeFalsy();
  });
  test('WHEN object is empty THEN return true', () => {
    const obj = {};
    expect(isEmpty(obj)).toBeTruthy();
  });

  test('WHEN is undefined THEN return true', () => {
    expect(isEmpty(undefined)).toBeTruthy();
  });

  test('WHEN is null THEN return true', () => {
    expect(isEmpty(null)).toBeTruthy();
  });
});
