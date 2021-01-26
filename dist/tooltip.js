/*!
 Simple Javascript UI library to build modern and elegant web UI
 Copyright (c) 2021 A.D. Software Labs
 License: MIT
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ad"] = factory();
	else
		root["ad"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/tooltip/tooltip.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./packages/base/component.js":
/*!************************************!*\
  !*** ./packages/base/component.js ***!
  \************************************/
/*! exports provided: default, ADComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ADComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADComponent", function() { return ADComponent; });
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * MIT License
 * Copyright (c) 2021 A.D. Software Labs

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* const cssClasses = {};*/
var strings = {
  INSTANCE_KEY: 'ad-base'
};
/** Class representing a base ADComponent. */

var ADComponent = /*#__PURE__*/function () {
  _createClass(ADComponent, null, [{
    key: "attachTo",

    /**
     * @param {!Element} root
     * @return {!ADComponent}
     */
    value: function attachTo(root) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // Subclasses which extend ADComponent should provide an attachTo() method that takes a root element and
      // returns an instantiated component with its root set to that element.
      var instance = _construct(ADComponent, [root].concat(args)); // Attach instance to the root


      root.ad = root.ad || {};
      root.ad[strings.INSTANCE_KEY] = instance;
      return instance;
    }
    /**
     * @param {!Element} root
     * @return {!ADComponent}
     */

  }, {
    key: "getInstance",
    value: function getInstance(root) {
      return root.ad && root.ad[strings.INSTANCE_KEY] ? root.ad[strings.INSTANCE_KEY] : null;
    }
    /**
     * @param {!Element} root
     * @param {...?} args
     */

  }]);

  function ADComponent(root) {
    _classCallCheck(this, ADComponent);

    /** @protected {!Element} */
    this.root_ = root;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    this.init.apply(this, args);
    this.initSyncWithDOM();
  }
  /**
   * @param {...?} args
   */


  _createClass(ADComponent, [{
    key: "init",
    value: function init()
    /* ...args*/
    {// Subclasses can override this to do any additional setup work that would be considered part of a
      // "constructor". Essentially, it is a hook into the parent constructor before the component is
      // initialized. Any additional arguments besides root will be passed in here.
    }
  }, {
    key: "initSyncWithDOM",
    value: function initSyncWithDOM() {// Subclasses should override this method if they need to perform work to synchronize with a host DOM
      // object. An example of this would be a form control wrapper that needs to synchronize its internal state
      // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
      // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
    }
  }, {
    key: "destroy",
    value: function destroy() {// Subclasses may implement this method to release any resources / deregister any listeners they have
      // attached. An example of this might be deregistering a resize event from the window object.
    }
    /**
     * Wrapper method to add an event listener to the component's root element. This is most useful when
     * listening for custom events.
     * @param {!string} evtType
     * @param {!Function} handler
     */

  }, {
    key: "listen",
    value: function listen(evtType, handler) {
      this.root_.addEventListener(evtType, handler);
    }
    /**
     * Wrapper method to remove an event listener to the component's root element. This is most useful when
     * unlistening for custom events.
     * @param {!string} evtType
     * @param {!Function} handler
     */

  }, {
    key: "unlisten",
    value: function unlisten(evtType, handler) {
      this.root_.removeEventListener(evtType, handler);
    }
    /**
     * Fires a cross-browser-compatible custom event from the component root of the given type,
     * with the given data.
     * @param {!string} evtType
     * @param {Object?} evtData
     * @param {boolean=} shouldBubble
     */

  }, {
    key: "emit",
    value: function emit(evtType, evtData) {
      var shouldBubble = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var evt;

      if (typeof CustomEvent === 'function') {
        evt = new CustomEvent(evtType, {
          detail: evtData,
          bubbles: shouldBubble
        });
      } else {
        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(evtType, shouldBubble, false, evtData);
      }

      this.root_.dispatchEvent(evt);
    }
  }]);

  return ADComponent;
}();




/***/ }),

/***/ "./packages/tooltip/tooltip.js":
/*!*************************************!*\
  !*** ./packages/tooltip/tooltip.js ***!
  \*************************************/
/*! exports provided: default, ADTooltip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ADTooltip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADTooltip", function() { return ADTooltip; });
/* harmony import */ var _node_modules_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/base/component */ "./packages/base/component.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * MIT License
 * Copyright (c) 2021 A.D. Software Labs

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var strings = {
  INSTANCE_KEY: 'ad-tooltip',
  MOUSE_OVER: 'mouseover',
  MOUSE_LEAVE: 'mouseleave',
  POS_Y: 'ad-tooltip-y',
  POS_X: 'ad-tooltip-x',
  TITLE: 'title',
  TOOLTIP_CL: 'ad-tooltip',
  TOOLTIP_SHOW_CL: 'ad-tooltip--show'
};
/**
 * Class representing a ADTooltip component.
 * @extends ADComponent
 */

var ADTooltip = /*#__PURE__*/function (_ADComponent) {
  _inherits(ADTooltip, _ADComponent);

  var _super = _createSuper(ADTooltip);

  function ADTooltip() {
    _classCallCheck(this, ADTooltip);

    return _super.apply(this, arguments);
  }

  _createClass(ADTooltip, [{
    key: "init",
    value: function init() {
      var _this = this;

      // Create and load tooltip element
      this.reset(); // Set position if explicitly specified

      var y = this.root_.getAttribute(strings.POS_Y);
      var x = this.root_.getAttribute(strings.POS_X);

      if (x && y) {
        this.setPosition(x, y);
      } // Attach event handlers


      this.listen(strings.MOUSE_OVER, function (e) {
        return _this.mouseOverEventHandler_(e);
      });
      this.listen(strings.MOUSE_LEAVE, function (e) {
        return _this.mouseOutEventHandler_(e);
      });
    }
    /**
      * @param {!number} x - position
      * @param {!number} y - position
      */

  }, {
    key: "setPosition",
    value: function setPosition(x, y) {
      this.x_ = x;
      this.y_ = y;
      this.toolTip_.style.left = x + 'px';
      this.toolTip_.style.top = y + 'px';
    }
    /** Reload function used to reload tooltip if a source was updated */

  }, {
    key: "reset",
    value: function reset() {
      // Get title attriute's content and remove it
      var toolTipContent = this.toolTipContent_ = this.root_.getAttribute(strings.TITLE);
      this.root_.removeAttribute(strings.TITLE); // Create and add tooltip html

      if (!this.toolTip_) {
        var tooltip = document.createElement('span');
        tooltip.classList.add(strings.TOOLTIP_CL);
        tooltip.innerHTML = toolTipContent;
        this.toolTip_ = tooltip;
        this.root_.insertAdjacentElement('afterend', tooltip);
      } else {
        this.toolTip_.innerHTML = toolTipContent;
      }
    }
  }, {
    key: "mouseOverEventHandler_",
    value: function mouseOverEventHandler_() {
      var pos = this.getTooltipPosition_();
      this.setPosition(pos.x, pos.y);
      this.toolTip_.classList.add(strings.TOOLTIP_SHOW_CL);
    }
  }, {
    key: "mouseOutEventHandler_",
    value: function mouseOutEventHandler_() {
      this.toolTip_.classList.remove(strings.TOOLTIP_SHOW_CL);
    }
    /**
      * @return {!Object} - object {y=x, x=x} returns postio of the tooltip
      * element
      */

  }, {
    key: "getTooltipPosition_",
    value: function getTooltipPosition_() {
      var x;
      var y;

      if (this.x_ && this.y_) {
        x = this.x_;
        y = this.y_;
      } else {
        var elRec = this.root_.getBoundingClientRect();
        var ttRec = this.toolTip_.getBoundingClientRect();
        var center = elRec.left + elRec.width / 2;
        var left = center - this.toolTip_.clientWidth / 2; // 8 is once side padding
        // Left breaker

        if (left < 0) {
          // A threshold distance of 32px is expected
          // to be maintained between the tooltip and the viewport edge.
          left = 32;
        } // Right breaker


        var screenWidth = document.body.clientWidth;

        if (left + ttRec.width + 8 > screenWidth) {
          // A threshold distance of 32px is expected
          // to be maintained between the tooltip and the viewport edge.
          left = screenWidth - this.toolTip_.clientWidth - 32;
        }

        x = left;
        y = elRec.bottom + 8;
      }

      return {
        y: y,
        x: x
      };
    }
  }], [{
    key: "attachTo",

    /**
      * @param {!Element} root
      * @return {!ADTooltip}
      */
    value: function attachTo(root) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // Subclasses which extend ADComponent should provide an attachTo() method that takes a root element and
      // returns an instantiated component with its root set to that element.
      var instance = _construct(ADTooltip, [root].concat(args)); // Attach instance to the root


      root.ad = root.ad || {};
      root.ad[strings.INSTANCE_KEY] = instance;
      return instance;
    }
    /**
      * @param {!Element} root
      * @return {!ADTooltip}
      */

  }, {
    key: "getInstance",
    value: function getInstance(root) {
      return root.ad && root.ad[strings.INSTANCE_KEY] ? root.ad[strings.INSTANCE_KEY] : null;
    }
  }]);

  return ADTooltip;
}(_node_modules_base_component__WEBPACK_IMPORTED_MODULE_0__["default"]);




/***/ })

/******/ });
});