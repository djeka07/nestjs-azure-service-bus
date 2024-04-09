import { Receiver } from '../interfaces';
import { isEmpty } from './object';

export default (receiver: Receiver) => {
  if (isEmpty(receiver)) {
    return '';
  }

  if (!receiver?.subscription && !receiver?.provider) {
    return receiver.name;
  }

  return `${receiver?.provider ? `${receiver.provider}/` : ''}${receiver.name}${!!receiver.subscription ? `/${receiver.subscription}` : ''}`;
};
