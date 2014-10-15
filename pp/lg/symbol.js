/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

goog.provide('pp.lg.Symbol');

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
 * @returns {string}
 */
pp.lg.Symbol.prototype.getId = function() {
    return this.id_;
};

/**
 * @returns {boolean}
 */
pp.lg.Symbol.prototype.isTerminal = function() {
    return this.terminal_;
};