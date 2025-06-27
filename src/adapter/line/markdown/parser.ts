export const markdownToHtmlMap = {
  strong: {
    characters: "**",
    regex: /\*\*(.+?)\*\*/g,
    nodeName: "strong",
  }, // Bold
  em: {
    characters: "*",
    regex: /\*(?!\*)(.+?)\*/g,
    nodeName: "em",
  }, // Italic
} as const;

const markdownList = Object.values(markdownToHtmlMap);

import markdownit from "markdown-it";

const md = markdownit().disable("list");

export const replaceMarkdownToHtml = (text: string): string => {
  // We don't escape HTML entities here because we want to allow HTML tags in the markdown.
  // It is the responsibility of the user to ensure that the input is safe.
  let html = text;

  markdownList.forEach((markdownToHtml) => {
    const { nodeName, regex } = markdownToHtml;

    html = html.replace(regex, `<${nodeName}>$1</${nodeName}>`);
  });

  // replace # title in markdown with h1 tag
  html = html.replace(/^(#{1,6})\s*(.+)$/gm, (match, hashes, content) => {
    const level = hashes.length;
    return `<h${level}>${content}</h${level}>`;
  });

  // return html;
  return md.render(text);
};

export const stripHtmlFromText = (text: string) => {
  const div = document.createElement("div");
  div.innerHTML = text;
  return div.textContent || div.innerText || "";
};
