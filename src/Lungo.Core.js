/** 
 * Contains all the common functions used in Lungo.
 * 
 * @namespace LUNGO
 * @class Core
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

LUNGO.Core = (function(lng, $, undefined) {

    var ARRAY_PROTO = Array.prototype;
    var OBJ_PROTO   = Object.prototype;
    var SUPPORTED_OS = ['ios', 'android', 'blackberry', 'webos'];

    /**
     * Console system to display messages when you are in debug mode.
     *
     * @method log
     *
     * @param {number} Severity based in (1)Log, (2)Warn, (>2)Error
     * @param {string} Message to show in console
     */
    var log = function(severity, message) {
        if (lng.Environment.isDesktop()) {
            console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
        } else {
            // @todo : send to the server
        }
    };

    /**
     * Executes callbacks based on the parameters received.
     *
     * @method execute
     *
     * @param {Function} callback to execute
     */
    var execute = function() {
        var args = toArray(arguments);
        var callback = args.shift();

        if (toType(callback) === 'function') {
            callback.apply(null, args);
        }
    };

    /**
     * Creates a new function that, when called, itself calls this function in
     * the context of the provided this value, with a given sequence of arguments
     * preceding any provided when the new function was called.
     *
     * @method bind
     *
     * @param {object} object to which the 'this' can refer in the new function when the new function is called.
     * @param {Function} method A function object.
     */
    var bind = function(object, method) {
        return function() {
            return method.apply(object, toArray(arguments));
        };
    };
        
    /**
     * Copy from any number of objects and mix them all into a new object.
     * The implementation is simple; just loop through arguments and
     * copy every property of every object passed to the function.
     *
     * @method mix
     *  
     * @param {object} arguments to mix them all into a new object.
     * @return {object} child a new object with all the objects from the arguments mixed.
     */
     var mix = function() {
        var child = child || {};
        for (var arg = 0, len = arguments.length; arg < len; arg++) {
            var argument = arguments[arg];
            for (var prop in argument) {
                if (isOwnProperty(argument, prop)) {
                    child[prop] = argument[prop];
                }
            }
        }
        return child;
    };
    
    /**
     * Every object descended from Object inherits the hasOwnProperty method.
     * This method can be used to determine whether an object has the specified property
     * as a direct property of that object.
     *
     * @param {object} object to test for a property's existence inside itself.
     * @param {string} property the name of the property to test.
     * @return {boolean} indicating whether the object has the specified property.
     */
    var isOwnProperty = function(object, property) {
        return OBJ_PROTO.hasOwnProperty.call(object, property);
    };

    /**
     * Determine the internal JavaScript [[Class]] of an object.
     *
     * @param {object} obj to get the real type of itself.
     * @return {string} with the internal JavaScript [[Class]] of itself.
     */
    var toType = function(obj) {
        return OBJ_PROTO.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };

    /**
     * Convert an array-like object into a true JavaScript array.
     *
     * @param {object} obj Any object to turn into a native Array.
     * @return {object} The object is now a plain array.
     */
    var toArray = function(obj) {
        return ARRAY_PROTO.slice.call(obj, 0);
    };

    /**
     * 
     *
     */
    var isMobile = function() {
        var result = false;

        for (var i = 0, len = SUPPORTED_OS.length; i < len && !result; i++) {
            var mobile_os = SUPPORTED_OS[i];
            $.os[mobile_os] && (result = true);
        }

        return result;
    };

    return {
        log: log,
        execute: execute,
        bind: bind,
        mix: mix,
        isOwnProperty: isOwnProperty,
        toType: toType,
        toArray: toArray,
        isMobile: isMobile
    };

})(LUNGO, Zepto);