import { isEmpty } from './object';

describe('GIVEN isEmpty', () => {
  it('Should return false if object is not empty', () => {
    const obj = { test: 'test' };
    expect(isEmpty(obj)).toBeFalsy();
  });
  it('Should return true if object is empty', () => {
    const obj = {};
    expect(isEmpty(obj)).toBeTruthy();
  });

  it('Should return true if object is undefined', () => {
    expect(isEmpty(undefined)).toBeTruthy();
  });

  it('Should return true if object is null', () => {
    expect(isEmpty(null)).toBeTruthy();
  });
});
