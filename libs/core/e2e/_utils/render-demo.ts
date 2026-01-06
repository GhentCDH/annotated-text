const mainDivId = 'demo-container';

export const renderDemoDiv = (title: string, id: string) => {
  const mainDiv = document.getElementById(mainDivId);
  const demo = document.createElement('div');

  const contentDiv = document.createElement('div');
  contentDiv.id = id;

  const titleDiv = document.createElement('h4');
  titleDiv.textContent = title;

  demo.append(titleDiv);
  demo.append(contentDiv);
  mainDiv.append(demo);

  return { demo, contentDiv, id };
};
