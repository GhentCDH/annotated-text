import markdownit, { type Token } from "markdown-it";

const md = markdownit({
  html: false,
}).disable("list");

const markdownEnv = {};

export const replaceMarkdownToHtml = (text: string): string => {
  return md.renderInline(text, markdownEnv);
};

const document = globalThis.document;
export const stripHtmlFromText = (text: string) => {
  const div = document?.createElement("div") ?? ({} as HTMLElement);
  div.innerHTML = text;
  return div.textContent || div.innerText || "";
};

type TokenInfo = {
  content: string;
  markup: string;
  length: number;
  openTag: boolean;
  closeTag: boolean;
};

const findTokenInRange = (token: Token, offset: number): TokenInfo[] => {
  if (token.children) {
    // TODO loop through children
    return token.children
      .map((child) => findTokenInRange(child, offset))
      .flat();
  }

  const { markup, content } = token;
  return [
    {
      content,
      markup,
      length: content.length,
      openTag: token.type?.indexOf("_open") >= 0,
      closeTag: token.type?.indexOf("_close") >= 0,
    } as TokenInfo,
  ];
};

export const getPartialMarkdown = (
  text: string,
  start: number,
  end: number,
) => {
  const parsedLines = md.parseInline(text, markdownEnv);

  const tokens = parsedLines.map((token) => findTokenInRange(token, 0)).flat();

  let nextStart = 0;
  const markdownText: string[] = [];
  let index = 0;

  for (const token of tokens) {
    const tokenEnd = nextStart + token.length;

    if (nextStart < start && tokenEnd < start) {
      // Out of range, just skip
    } else if (nextStart < start) {
      const prevToken = tokens[index - 1];
      if (prevToken?.openTag) {
        markdownText.push(prevToken.markup);
      }
      markdownText.push(token.content.substring(start - nextStart));
    } else if (end < tokenEnd) {
      markdownText.push(token.content.substring(0, end + 1));

      const nextToken = tokens[index + 1];
      if (nextToken?.closeTag) {
        markdownText.push(nextToken.markup);
      }
      break;
    } else {
      markdownText.push([token.content, token.markup].join(""));
    }
    nextStart = nextStart + token.length;
    index++;
  }
  // find the first and last tokens in the absolute range
  const newText = markdownText.flat().join("");
  return { html: replaceMarkdownToHtml(newText), text: newText };
};
