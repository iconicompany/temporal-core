import { ActivityInterfaceFor, ApplicationFailure, ChildWorkflowHandle, ChildWorkflowOptions, ExternalWorkflowHandle } from "@temporalio/workflow";

/**
 * @abstract
 */
export abstract class Options<T> {
  protected _activities: ActivityInterfaceFor<T>;
  protected _childWorks: ChildWorkflowHandle<any>[] = [];
  protected _logInfoFunc: (...args: any[]) => void = console.log;
  protected _logDebugFunc: (...args: any[]) => void = console.debug;
  protected _handle: ExternalWorkflowHandle;
  protected _workflowId: string | null = null;
  protected _workflowIdWaiter: string | null = null;
  protected _childWork: (() => any) | string = () => {};

  constructor(activities: ActivityInterfaceFor<T>, handle: ExternalWorkflowHandle) {
    this._activities = activities;
    this._handle = handle;
  }

  /**
   * Log level info
   * @param  {...any} args
   * @returns void
   */
  info(...args: any[]): void {
    this._logInfoFunc(...args);
  }

  /**
   * Log level debug
   * @param  {...any} args
   * @returns void
   */
  public debug(...args: any[]): void {
    this._logDebugFunc(...args);
  }

  /**
   * signaling between workflow or others info transport
   */
  async signal(nameFunc: string, obj: any): Promise<void> {
    throw new Error("Method 'signals()' not implemented");
  }

  /**
   *
   * @param {string | Function} nameChild
   * @param {ChildWorkflowOptions} options
   * @returns ChildWorkflowHandle
   */
  async startChild(nameChild: string | Function, options: ChildWorkflowOptions): Promise<ChildWorkflowHandle<any>> {
    throw new Error("Method 'startChild()' not implemented");
  }

  /**
   *
   * @returns Promise<any>
   */
  async waitChildWorks(): Promise<any> {
    throw new Error("Method 'waitChildWorks()' not implemented");
  }

  /**
   * Error if necessary
   */
  getApplicationError(error: string): never {
    throw new Error("Method 'getApplicationError()' not implemented");
  }

  /**
   * Getter for array functions
   * @returns { Array<Function> }
   */
  getActivities(): ActivityInterfaceFor<T> {
    return this._activities;
  }

  /**
   *
   * @returns string | null
   */
  getWorkflowsId(): string | null {
    return this._workflowId;
  }

  /**
   *
   * @param {(...args: any[]) => void} logFunc
   */
  setLogDebugFunc(logFunc: (...args: any[]) => void): void {
    this._logDebugFunc = logFunc;
  }

  /**
   *
   * @param {string} workflowsId
   */
  setWorkflowId(workflowsId: string): void {
    this._workflowId = workflowsId;
  }

  /**
   *
   * @param {(...args: any[]) => void} logFunc
   */
  setLogInfoFunc(logFunc: (...args: any[]) => void): void {
    this._logInfoFunc = logFunc;
  }

  /**
   *
   * @returns (() => any) | string
   */
  getChildWork(): (() => any) | string {
    return this._childWork;
  }

  /**
   *
   * @param { string | (() => any) } childWork
   */
  setChildWork(childWork: string | (() => any)): void {
    this._childWork = childWork;
  }
}

export class TemporalOptions<ActivityT> extends Options<ActivityT> {
  /**
   *
   * @param {Array<Function>} activities
   * @param {ExternalWorkflowHandle} handle
   */
  constructor(activities: ActivityInterfaceFor<ActivityT>, handle: ExternalWorkflowHandle) {
    super(activities, handle);
    this._activities = activities;
    this._handle = handle;
  }

  /**
   *
   * @override
   * @param {string} nameFunc
   * @param  {any} obj // TODO: set structure { uid, type_doc, path, path_gray}
   * @returns void
   */
  public async signal(nameFunc: string, obj: any): Promise<void> {
    return await this._handle.signal(nameFunc, obj);
  }

  /**
   *
   * @override
   * @param {string} error
   */
  getApplicationError(error: string): never {
    throw new ApplicationFailure(error);
  }

  /**
   *
   * @override
   * @param {string | Function} nameChild
   * @param {ChildWorkflowOptions} options
   * @returns ChildWorkflowHandle
   */
  async startChild(nameChild: string | Function, options: ChildWorkflowOptions): Promise<ChildWorkflowHandle<any>> {
    const handle = await super.startChild(nameChild, options);
    this._childWorks.push(handle);
    return handle;
  }

  /**
   *
   * @returns Promise<any>
   */
  async waitChildWorks(): Promise<any> {
    return Promise.all(this._childWorks.map((childHandle) => childHandle.result()));
  }
}
