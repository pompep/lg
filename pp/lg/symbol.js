/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

goog.provide('pp.lg.Symbol');

goog.require('pp.lg.Identificable');
goog.require('pp.lg.String');

/**
 *
 * @param {string} id
 * @param {boolean} terminal
 * @constructor
 * @implements {pp.lg.Identificable}
 */
pp.lg.Symbol = function(id, terminal) {
    if (id.length !== 1) {
        goog.asserts.fail('Only symbols of length 1 are supported');
    }

    /**
     * @type {string}
     * @private
     */
    this.id_ = id;

    /**
     * @type {boolean}
     * @private
     */
    this.terminal_ = terminal;
};

/**
 * @returns {boolean}
 */
pp.lg.Symbol.prototype.isTerminal = function() {
    return this.terminal_;
};

/**
 * @returns {string}
 */
pp.lg.Symbol.prototype.getId = function() {
    return this.id_;
};

/**
 * @return {number}
 */
pp.lg.Symbol.prototype.length = function() {
    return 1;
};

/**
 * @param {number} index
 * @return {pp.lg.Symbol}
 */
pp.lg.Symbol.prototype.getSymbolAt = function(index) {
    return this;
};

/**
 * @param {pp.lg.Identificable} b
 * @return {pp.lg.Identificable}
 */
pp.lg.Symbol.prototype.concat = function(b) {
    if (goog.isNull(b)) {
        return this;
    } else {
        var ret = new pp.lg.String();
        ret.append(this);
        ret = ret.concat(b);
//        console.log('symbol concat', this.toString(), b.toString(), ret.toString());
        return ret;
    }
};

/**
 * @param {number} k
 * @return {pp.lg.Identificable}
 */
pp.lg.Symbol.prototype.first = function(k) {
    if (k > 0) {
        return this;
    } else {
        return null;
    }
};

/**
 * @return {string}
 */
pp.lg.Symbol.prototype.toString = function() {
    return '[' + this.getId()  + ']';
};