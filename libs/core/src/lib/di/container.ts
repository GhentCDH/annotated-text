export type Token<T> = (new (...args: any[]) => T) | string | symbol;

export class Container {
  private factories = new Map<any, () => any>();
  private instances = new Map<any, any>();

  constructor(private parent?: Container) {}

  register<T>(classRef: new (...args: any[]) => T, factory?: () => T): this;
  register<T>(token: string | symbol, factory: () => T): this;
  register<T>(tokenOrClass: any, factory?: () => T): this {
    const resolvedFactory = factory ?? (() => new tokenOrClass());
    this.factories.set(tokenOrClass, resolvedFactory);

    return this;
  }

  get<T>(token: Token<T>): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    if (this.factories.has(token)) {
      const instance = this.factories.get(token)!();
      this.instances.set(token, instance);
      return instance;
    }

    if (this.parent) {
      return this.parent.get<T>(token);
    }

    throw new Error(`Service not found: ${String(token)}`);
  }

  has(token: any): boolean {
    return this.factories.has(token) || (this.parent?.has(token) ?? false);
  }

  createScope(): Container {
    return new Container(this);
  }

  // Clear instances but keep factories (useful for testing)
  reset(): void {
    this.instances.clear();
  }

  // Completely destroy the container
  destroy(): void {
    this.factories.clear();
    this.instances.clear();
  }
}

export const rootContainer = new Container();
