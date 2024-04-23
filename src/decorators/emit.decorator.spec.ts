import { Inject } from '@nestjs/common';
import { Emittable } from './emit.decorator';
import { AZURE_SERVICE_BUS_SENDER } from '../constants';

jest.mock('@nestjs/common');

describe('GIVEN Emittable', () => {
  test('WHEN call Inject THEN Inject should be called with the right arguments', () => {
    Emittable('test');
    expect(Inject).toHaveBeenCalledWith(`${AZURE_SERVICE_BUS_SENDER}TEST`);
  });
});
