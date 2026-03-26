import markdownit, { type Token } from 'markdown-it';

type Limit = {
  start: number;
  end: number;
  ignoreLines?: boolean;
};

const md = markdownit({
  html: false,
}).disable('list');

const markdownEnv = {};

export const replaceMarkdownToHtml = (text: string): string => {
  return md.render(text, markdownEnv);
};

const document = globalThis.document;
export const stripHtmlFromText = (text: string) => {
  const div = document?.createElement('div') ?? ({} as HTMLElement);
  div.innerHTML = text;
  return div.textContent || div.innerText || '';
};

type TokenInfo = {
  start: string;
  end: string;
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
  let length = content.length;
  if (token.type === 'paragraph_close') {
    length = 1;
  }
  return [
    {
      content,
      markup,
      length,
      start: 0,
      end: length,
      openTag: token.type?.indexOf('_open') >= 0,
      closeTag: token.type?.indexOf('_close') >= 0,
    } as TokenInfo,
  ];
};

const parseLineToTokens = (token: Token, prevStart: number) => {
  let nextStart = prevStart;
  let length = 0;

  const children = token.children?.map((child) => {
    const start = nextStart;
    const end = start + child.content.length;
    length = length + child.content.length;
    nextStart = nextStart + child.content.length;

    return {
      ...child,
      start,
      end,
    };
  });

  return {
    end: prevStart + length,
    start: prevStart,
    length,

    children,
  };
};

const inRange = (
  start: number,
  end: number,
  line: { start: number; end: number },
) => {
  if (line.start < start && line.end < start) {
    return false;
  }
  if (line.start > end && line.end > end) {
    return false;
  }
  return true;
};

/**
 * this function returns a markdown string with a limited range of text. It keeps the markdown tags,
 * f.e. if you have split in the middle of a strong tag then it will keep the strong markup
 * @param text
 * @param start
 * @param end
 */
export const getPartialMarkdownWithLimit = (
  text: string,
  limit: Limit,
  startOffset = 0,
) => {
  const parsedLines = md.parse(text, markdownEnv);
  let nextStart = startOffset;
  const markdownText: string[] = [];
  let index = 0;
  const { start, end } = limit;
  let lineStart: number = null;
  let lineEnd: number = null;
  for (const parsedLine of parsedLines) {
    const line = parseLineToTokens(parsedLine, nextStart);
    if (!line.children?.length) {
      continue;
    }
    nextStart = line.end + 1;

    if (!inRange(start, end, line)) {
      continue;
    }

    for (const child of line.children) {
      if (!inRange(start, end, child)) {
        continue;
      }

      let lStart = child.start;
      let lEnd = child.end;

      if (!limit?.ignoreLines) {
        lStart = start < lStart ? lStart : start;
        lEnd = end < lEnd ? end : lEnd;
      }

      if (lStart !== child.start) {
        const prevChild = line.children[index - 1];
        if (prevChild) markdownText.push(prevChild.markup);
      }

      if (lineStart === null) lineStart = lStart;
      if (lineEnd === null) lineEnd = lEnd;

      lStart = lStart - line.start;
      lEnd = lEnd - line.start;

      markdownText.push(child.content.substring(lStart, lEnd));
      markdownText.push(child.markup);

      if (lEnd !== child.end) {
        const nextChild = line.children[index + 1];
        if (nextChild) markdownText.push(nextChild.markup);
      }
      index += 1;
    }
    index = 0;
  }

  const _markdownText = markdownText.flat().join('');

  return {
    html: replaceMarkdownToHtml(_markdownText),
    markdownText: _markdownText,
    start: lineStart,
    end: lineEnd,
  };
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
      markdownText.push([token.content, token.markup].join(''));
    }
    nextStart = nextStart + token.length;
    index++;
  }
  // find the first and last tokens in the absolute range
  const newText = markdownText.flat().join('');

  return { html: replaceMarkdownToHtml(newText), text: newText };
};
