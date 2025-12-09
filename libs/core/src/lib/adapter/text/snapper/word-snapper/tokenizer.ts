import { Token, Tokenizr } from 'tokenizr';

export type Tokenizer = (token: string) => Token[];

//returns an array of tokens for a text, uses a defined word boundry
export const defaultTokenizr: Tokenizer = (text: string): Token[] => {
  const lexer = new Tokenizr();

  //ignore word boundries
  lexer.rule(/†/, (ctx: { accept: (arg0: string) => void }) => {
    //ctx.accept("start char")
    ctx.accept('start');
  });

  //ignore line numbers
  lexer.rule(/\d+\./, (ctx: { ignore: () => void }) => {
    //ctx.accept("gutter")
    ctx.ignore();
  });

  //ignore whitespace
  lexer.rule(/(\s+)|(,)|\./, (ctx: { ignore: () => void }) => {
    //ctx.accept("whitespace or typograpy")
    ctx.ignore();
  });

  //token
  lexer.rule(/[^\s,.]+/, (ctx: { accept: (arg0: string) => void }) => {
    ctx.accept('token');
  });

  //parse the text
  lexer.input(text);
  return lexer.tokens();
};
