///<reference path="../../typings/jasmine/jasmine.d.ts" />
///<reference path="../modules-shim.d.ts" />
import ClassName = require('main');

'use strict';
describe('ClassName', () => {
  var myClass: ClassName;

  beforeEach(() => {
    myClass = new ClassName();
  });

  describe('constructor', () => {
    it('should instantiate a new class', () => {
      expect(myClass).toEqual(jasmine.any(ClassName));
    });
  });
});
