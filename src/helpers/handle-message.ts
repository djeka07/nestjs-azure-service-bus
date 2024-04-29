import { ServiceBusReceivedMessage } from '@azure/service-bus';
import { AzureServiceBusMessage } from 'src/interfaces';
import { removeNullUndefined } from './object';

export default (
  receivedMessage: ServiceBusReceivedMessage,
  handler: (payload?: unknown) => void,
): void => {
  const {
    body,
    deliveryCount,
    replyTo,
    messageId,
    state,
    enqueuedTimeUtc,
    lockedUntilUtc,
    expiresAtUtc,
    lockToken,
    timeToLive,
  } = receivedMessage;
  handler(
    removeNullUndefined({
      body,
      replyTo,
      deliveryCount,
      messageId,
      state,
      enqueuedTimeUtc,
      lockedUntilUtc,
      expiresAtUtc,
      lockToken,
      timeToLive,
    } as AzureServiceBusMessage<unknown>),
  );
};
