import { Inject } from '@nestjs/common';
import { AZURE_SERVICE_BUS_SENDER } from '../constants';
import { toUpper } from '../helpers';

export const Emittable = (queue: string) =>
  Inject(`${AZURE_SERVICE_BUS_SENDER}${toUpper(queue)}`);
