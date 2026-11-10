/**
 * Measure the line height of the text.
 *
 * The probe is attached to `parent` (the wrapper), so it inherits the font
 * family, size and zoom the text is rendered with.
 */
export const getLineHeight = (
  text: string,
  offset = 2,
  parent: HTMLElement = document.body,
) => {
  const tempElement = document.createElement('span');
  tempElement.style.visibility = 'hidden';
  tempElement.style.position = 'absolute';
  tempElement.style.whiteSpace = 'pre';
  tempElement.textContent = text;

  parent.appendChild(tempElement);
  const lineHeight = getLineHeightOnElement(tempElement);
  parent.removeChild(tempElement);

  return lineHeight + offset;
};

export const getLineHeightOnElement = (element: HTMLElement): number => {
  const computed = window.getComputedStyle(element);

  if (computed.lineHeight !== 'normal') {
    return parseFloat(computed.lineHeight);
  }

  // Measure actual line height for 'normal'
  const temp = document.createElement('span');
  temp.style.visibility = 'hidden';
  temp.textContent = 'Mg';
  element.appendChild(temp);
  const height = temp.offsetHeight;
  element.removeChild(temp);

  return height;
};
