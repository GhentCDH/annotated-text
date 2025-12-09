/* eslint-disable no-console */
export class Debugger {
  private _verboseEnabled = false;
  private _debugEnabled = false;
  private static _instance: Debugger;

  private constructor() {
    /* empty */
  }

  private static get instance() {
    if (!Debugger._instance) Debugger._instance = new Debugger();

    return Debugger._instance;
  }

  public static setDebug(debug: boolean) {
    this.instance._debugEnabled = debug;
  }

  public static setVerbose(verbose: boolean) {
    this.instance._verboseEnabled = verbose;
  }

  private static get verboseEnabled() {
    return this.instance._verboseEnabled;
  }

  private static get debugEnabled() {
    return this.instance._debugEnabled;
  }

  public static warn(...message: any) {
    console.warn(...message);
  }

  public static time(startTime: number, message: string) {
    const endTime = Date.now();
    const tookTime = endTime - startTime;
    const logMessage = `${message} took ${tookTime} ms , ${tookTime / 1000} s`;
    if (tookTime > 1000) {
      console.warn("TIMER", logMessage);
    } else {
      Debugger.debug("TIMER", logMessage);
    }
  }

  public static debug(subject: string, mainMessage: string, ...message: any) {
    if (!this.debugEnabled) return;

    console.log(Debugger.formatMessage(subject, mainMessage), message);
  }

  public static verbose(subject: string, mainMessage: string, ...message: any) {
    if (!this.verboseEnabled) return;

    console.debug(Debugger.formatMessage(subject, mainMessage), message);
  }

  private static formatMessage(subject: string, mainMessage: string) {
    return `${subject}: ${mainMessage}`;
  }
}
