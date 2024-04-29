import { Receiver } from '../interfaces';
import { isEmpty } from '../helpers';

export default (receiver: Receiver) => {
  if (isEmpty(receiver)) {
    return '';
  }

  if (!receiver?.subscription) {
    return receiver.name;
  }

  return `${receiver.name}/${receiver.subscription}`;
};
