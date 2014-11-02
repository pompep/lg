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
 * @inheritDoc
 */
pp.lg.Symbol.prototype.getId = function() {
    return this.id_;
};

/**
 * @inheritDoc
 */
pp.lg.Symbol.prototype.length = function() {
    return 1;
};

/**
 * @inheritDoc
 */
pp.lg.Symbol.prototype.getSymbolAt = function(index) {
    return this;
};

/**
 * @inheritDoc
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
 * @inheritDoc
 */
pp.lg.Symbol.prototype.first = function(k) {
    if (k > 0) {
        return this;
    } else {
        return null;
    }
};

/**
 * @inheritDoc
 */
pp.lg.Symbol.prototype.equals = function(b) {
    return goog.isNull(b) ? false : this.getId() === b.getId();
};

/**
 * @inheritDoc
 */
pp.lg.Symbol.prototype.toString = function() {
    return '[' + this.getId()  + ']';
};