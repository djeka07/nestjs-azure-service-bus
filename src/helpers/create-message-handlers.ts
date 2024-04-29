import {
  MessageHandlers,
  ProcessErrorArgs,
  ServiceBusReceivedMessage,
} from '@azure/service-bus';
import handleMessage from './handle-message';

export default (handler: (payload?: unknown) => void): MessageHandlers => ({
  processMessage: async (receivedMessage: ServiceBusReceivedMessage) => {
    handleMessage(receivedMessage, handler);
  },
  processError: (args: ProcessErrorArgs): Promise<void> => {
    return new Promise<void>(() => {
      throw new Error(`Error processing message: ${args.error}`);
    });
  },
});
