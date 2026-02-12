/**
 * Token type for dependency injection.
 * Can be a class constructor, string, or symbol used to identify a service.
 */
export type Token<T> = (new (...args: any[]) => T) | string | symbol;

/**
 * A lightweight dependency injection container with lazy instantiation and hierarchical scoping.
 *
 * Features:
 * - Lazy instantiation: Services are created only when first requested
 * - Singleton per scope: Each service is instantiated once per container scope
 * - Hierarchical scoping: Child containers can access parent services
 * - Factory-based registration: Services are registered with factory functions
 *
 * @example
 * ```ts
 * const container = new Container();
 * container.register(MyService, () => new MyService());
 * const service = container.get(MyService);
 * ```
 */
export class Container {
  /** Factory functions for creating service instances */
  private factories = new Map<any, () => any>();

  /** Cached singleton instances (lazily created on first get) */
  private instances = new Map<any, any>();

  /**
   * @param parent - Optional parent container for hierarchical lookup
   */
  constructor(private parent?: Container) {}

  /**
   * Register a service with the container.
   *
   * @param classRef - Class constructor to use as both token and default factory
   * @param factory - Optional custom factory function
   * @returns this for method chaining
   */
  register<T>(classRef: new (...args: any[]) => T, factory?: () => T): this;
  /**
   * Register a service with a string or symbol token.
   *
   * @param token - String or symbol identifier for the service
   * @param factory - Factory function to create the service instance
   * @returns this for method chaining
   */
  register<T>(token: string | symbol, factory: () => T): this;
  register<T>(tokenOrClass: any, factory?: () => T): this {
    const resolvedFactory = factory ?? (() => new tokenOrClass());
    this.factories.set(tokenOrClass, resolvedFactory);

    return this;
  }

  /**
   * Update the factory for an existing service. This allows changing how a service is created without modifying the registration logic.
   *
   * @throws Error if the service is not already registered
   * @param token
   * @param factory
   */
  update<T>(token: any, factory: () => T): this {
    if (!this.factories.has(token)) {
      throw new Error(`Cannot update unregistered service: ${String(token)}`);
    }
    this.factories.set(token, factory);
    this.instances.delete(token); // Clear cached instance to allow re-creation with new factory
    return this;
  }

  /**
   * Retrieve a service instance from the container.
   * Creates the instance on first access (lazy instantiation) and caches it.
   * Falls back to parent container if service not found locally.
   *
   * @param token - The token identifying the service
   * @returns The service instance
   * @throws Error if service is not registered in this container or any parent
   */
  get<T>(token: Token<T>): T {
    // Return cached instance if available
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    // Create and cache instance if factory exists
    if (this.factories.has(token)) {
      const instance = this.factories.get(token)!();
      this.instances.set(token, instance);
      return instance;
    }

    // Delegate to parent container if available
    if (this.parent) {
      return this.parent.get<T>(token);
    }

    throw new Error(`Service not found: ${String(token)}`);
  }

  /**
   * Check if a service is registered in this container or any parent.
   */
  has(token: any): boolean {
    return this.factories.has(token) || (this.parent?.has(token) ?? false);
  }

  /**
   * Get all registered tokens in this container.
   * Does not include tokens from parent containers.
   */
  getTokens(): any[] {
    return Array.from(this.factories.keys());
  }

  /**
   * Get all registered tokens including those from parent containers.
   */
  getAllTokens(): any[] {
    const tokens = new Set(this.factories.keys());
    if (this.parent) {
      for (const token of this.parent.getAllTokens()) {
        tokens.add(token);
      }
    }
    return Array.from(tokens);
  }

  /**
   * Retrieve multiple service instances at once.
   *
   * @param tokens - Array of tokens identifying the services
   * @returns Array of service instances in the same order as the tokens
   */
  getMany<T extends any[]>(tokens: { [K in keyof T]: Token<T[K]> }): T {
    return tokens.map((token) => this.get(token)) as T;
  }

  /**
   * Create a child container with this container as its parent.
   * Child containers inherit access to parent services but can override them.
   */
  createScope(): Container {
    return new Container(this);
  }

  /**
   * Clear cached instances but keep factories.
   * Useful for testing to reset service state between tests.
   */
  reset(): void {
    this.instances.clear();
  }

  /**
   * Completely destroy the container, clearing both factories and instances.
   * Use when disposing of a scoped container.
   */
  destroy(): void {
    this.factories.clear();
    this.instances.clear();
  }
}

/**
 * Global root container for application-wide services.
 * Scoped containers (like AnnotationModule) should be created from this.
 */
export const rootContainer = new Container();
