
function polify(){
  // findIndex
  if (!Array.prototype.findIndex) {
    console.error('浏览器不支持数组findIndex方法，请更新浏览器');
    Object.defineProperty(Array.prototype, 'findIndex', {
      value: function(predicate) {
        'use strict';
        if (this == null) {
          throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
  
        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return i;
          }
        }
        return -1;
      },
      enumerable: false,
      configurable: false,
      writable: false
    });
  };

  // find
  if (!Array.prototype.find) {
    console.error('浏览器不支持数组includes方法，请更新浏览器');
    Object.defineProperty(Array.prototype, 'find', {
      value: function(predicate) {
       'use strict';
       if (this == null) {
         throw new TypeError('Array.prototype.find called on null or undefined');
       }
       if (typeof predicate !== 'function') {
         throw new TypeError('predicate must be a function');
       }
       var list = Object(this);
       var length = list.length >>> 0;
       var thisArg = arguments[1];
       var value;
  
       for (var i = 0; i < length; i++) {
         value = list[i];
         if (predicate.call(thisArg, value, i, list)) {
           return value;
         }
       }
       return undefined;
      }
    });
  }

  // includes
  if (!Array.prototype.includes) {
    console.error('浏览器不支持数组includes方法，请更新浏览器');
    Array.prototype.includes = function(searchElement /*, fromIndex*/) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.includes called on null or undefined');
      }
      var O = Object(this);
      var len = parseInt(O.length, 10) || 0;
      if (len === 0) {
        return false;
      }
      var n = parseInt(arguments[1], 10) || 0;
      var k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {k = 0;}
      }
      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement ||
           (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
          return true;
        }
        k++;
      }
      return false;
    };
  };

  // flat
  if (!Array.prototype.flat) {
    console.error('浏览器不支持数组flat方法，请更新浏览器');
    Object.defineProperty(Array.prototype, 'flat', {
      configurable: true,
      value: function flat () {
        var depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);
  
        return depth ? Array.prototype.reduce.call(this, function (acc, cur) {
          if (Array.isArray(cur)) {
            acc.push.apply(acc, flat.call(cur, depth - 1));
          } else {
            acc.push(cur);
          }
  
          return acc;
        }, []) : Array.prototype.slice.call(this);
      },
      writable: true
    });
  }
  // fetch
  if (!window.fetch){
    console.error('浏览器不支持fetch方法，请更新浏览器');
  }
  /* Disable minification (remove `.min` from URL path) for more info */
}

export default polify;
