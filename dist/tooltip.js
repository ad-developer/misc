/*!
 Simple Javascript UI library to build modern and elegant web UI
 Copyright (c) 2021 A.D. Software Labs
 License: MIT
*/
var ad = typeof ad === "object" ? ad : {}; ad["tooltip"] =
/******/ (function(modules) { // webpackBootstrap
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
// import ADComponent from '../base/component';
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

var ADTooltip = /*#__PURE__*/function (_ad$component$ADCompo) {
  _inherits(ADTooltip, _ad$component$ADCompo);

  var _super = _createSuper(ADTooltip);

  function ADTooltip() {
    _classCallCheck(this, ADTooltip);

    return _super.apply(this, arguments);
  }

  _createClass(ADTooltip, [{
    key: "init",

    /**
     * @param {...?} args
     */
    value: function init() {
      var _this = this;

      var maxLength = 250;

      if (arguments.length > 0) {
        var obj = arguments.length <= 0 ? undefined : arguments[0];
        maxLength = obj.maxLength;
      }

      this.maxLength_ = maxLength; // Create and load tooltip element

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
        this.toolTip_ = tooltip; // Depricated - this approach is used for IE 11. Will be phased out
        // once IE is no longer supported.
        // this.root_.insertAdjacentElement('afterend', tooltip);

        this.insertAfter_(this.root_, tooltip);
      } else {
        this.toolTip_.innerHTML = toolTipContent;
      }

      var whiteSpace = 'nowrap';
      var maxWidth = 'none';

      if (this.toolTip_.clientWidth > this.maxLength_) {
        whiteSpace = 'normal';
        maxWidth = this.maxLength_ + 'px';
      }

      this.toolTip_.style['white-space'] = whiteSpace;
      this.toolTip_.style['max-width'] = maxWidth;
    }
    /**
      * @private
      */

  }, {
    key: "mouseOverEventHandler_",
    value: function mouseOverEventHandler_() {
      var pos = this.getTooltipPosition_();
      this.setPosition_(pos.x, pos.y);
      this.toolTip_.classList.add(strings.TOOLTIP_SHOW_CL);
    }
    /**
      * @private
      */

  }, {
    key: "mouseOutEventHandler_",
    value: function mouseOutEventHandler_() {
      this.toolTip_.classList.remove(strings.TOOLTIP_SHOW_CL);
    }
    /**
      * @private
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
    /**
      * @private
      * @param {!number} x - position
      * @param {!number} y - position
      */

  }, {
    key: "setPosition_",
    value: function setPosition_(x, y) {
      this.toolTip_.style.left = x + 'px';
      this.toolTip_.style.top = y + 'px';
    }
    /**
      * @private
      * @param {!Element} referenceElement - referenceElement
      * @param {!Element} newElement - newElement
      */

  }, {
    key: "insertAfter_",
    value: function insertAfter_(referenceElement, newElement) {
      referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
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
}(ad.component.ADComponent);




/***/ })

/******/ });