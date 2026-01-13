const mainDivId = 'demo-container';

export const getLogDivId = (id: string) => {
  return `${id}-log`;
};

export const writeToLogDiv = (id: string, text: string) => {
  const logDiv = document.getElementById(getLogDivId(id));
  logDiv.innerText = text;
  return logDiv;
};

export const renderDemoDiv = (title: string, id: string, addLogger?: true) => {
  const mainDiv = document.getElementById(mainDivId);
  const demo = document.createElement('div');

  demo.classList.add('demo');

  const contentDiv = document.createElement('div');
  contentDiv.id = id;

  const titleDiv = document.createElement('h4');
  titleDiv.textContent = title;

  demo.append(titleDiv);
  demo.append(contentDiv);

  let logDiv: HTMLDivElement | undefined;
  if (addLogger) {
    logDiv = document.createElement('div');
    logDiv.id = getLogDivId(id);
    logDiv.classList.add('log');
    demo.append(logDiv);
  }

  mainDiv.append(demo);

  return { demo, contentDiv, id, logDiv };
};
