/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

goog.provide('pp.lg.Set');

goog.require('goog.object');

/**
 * @constructor
 */
pp.lg.Set = function() {
    /**
     * @type {Object.<string, !pp.lg.Identificable>} symbol.id => symbol
     * @private
     */
    this.set_ = {};


    /**
     * @type {boolean}
     * @private
     */
    this.closed_  = false;
};

/**
 *
 * @param {!pp.lg.Identificable} symbol
 * @return {boolean} was symbol inserted firstime?
 */
pp.lg.Set.prototype.add = function(symbol) {
    if (!this.closed_) {
        this.set_[symbol.getId()] = symbol;
    } else {
        goog.asserts.fail('Set is already closed against add operation');
    }
};


/**
 * @param id
 * @returns {pp.lg.Identificable}
 */
pp.lg.Set.prototype.getById = function(id) {
    return goog.object.get(this.set_, id, null);
};


pp.lg.Set.prototype.close = function() {
    this.closed_ = true;
};