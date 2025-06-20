const document = globalThis.document;

export const waitUntilElementExists = (id: string) => {
  return new Promise((resolve) => {
    if (!document) {
      resolve(null);
      return;
    }
    const checkExist = setInterval(() => {
      const element = document?.getElementById(id);
      if (element) {
        clearInterval(checkExist);
        resolve(element);
      }
    }, 100); // Check every 100ms
  });
};
