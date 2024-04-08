export default (queue: string, subscription?: string) => {
  if (!subscription) {
    return queue;
  }

  return `${queue}/${subscription}`;
};
