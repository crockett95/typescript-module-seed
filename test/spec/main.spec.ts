///<reference path="../../typings/jasmine/jasmine.d.ts" />
///<reference path="../modules-shim.d.ts" />
import ClassName = require('main');

'use strict';
describe('ClassName', () => {
  var myClass: ClassName;

  beforeEach(() => {
    myClass = new ClassName('Hello');
  });

  describe('constructor', () => {
    it('should instantiate a new class', () => {
      expect(myClass).toEqual(jasmine.any(ClassName));
    });

    it('should have a name', () => {
      expect(myClass.name).toBeDefined();
      expect(myClass.name).toEqual('Hello');
    });

    xit('needs more tests');
  });
});
