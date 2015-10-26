import IMain = require('./i-main');

'use strict';

/**
 * The main class for this module
 *
 * This module is a seed, but it can be used to create something _really_ cool.
 * I love that I can type all this code in here
 *
 * Example:
 * ```js
 * new ClassName();
 * ```
 *
 * @public
 */
class ClassName implements IMain {

  /**
   * The name of the module
   */
  private _name: string;

  /**
   * Builds a new `ClassName`
   * 
   * @param name The name of the module
   * @returns The new instance
   */
  constructor(name?: string) {
    this.name = name;
    // console.log('Hello world');
  }

  get name(): string {
    return this._name;
  }
  set name(val: string) {
    this._name = val;
  }
}
export = ClassName;
