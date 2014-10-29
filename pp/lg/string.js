/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

goog.provide('pp.lg.String');

goog.require('pp.lg.Identificable');

/**
 *
 * @param {string=} str
 * @param {!pp.lg.Set=} alphabet
 * @constructor
 * @implements {pp.lg.Identificable}
 */
pp.lg.String = function(str, alphabet) {
    /**
     * @type {!Array.<pp.lg.Symbol>}
     * @private
     */
    this.str_ = [];

    if (goog.isString(str)) {
        if (alphabet instanceof pp.lg.Set) {
            for (var i = 0, len = str.length; i < len; i++) {
                this.append(alphabet.getById(str[i]));
            }
        } else {
            goog.asserts.fail('No valid aplhabet passed to pp.lg.String constructor with initialize string');
        }
    }
};

/**
 * @param {*} symbol takes every type, but only pp.lg.Symbol are really appended, even empty symbol (aka null) is refused
 */
pp.lg.String.prototype.append = function(symbol) {
    if (symbol instanceof pp.lg.Symbol) {
        this.str_.push(symbol);
    }
};

/**
 * @returns {string}
 */
pp.lg.String.prototype.getId = function() {
    var ret = '';

    for (var i = 0, len = this.str_.length; i < len; i++) {
        var s = this.str_[i];
        ret += s.getId();
    }

    return ret;
};

/**
 * @param {pp.lg.Identificable} b
 * @return {pp.lg.String}
 */
pp.lg.String.prototype.concat = function(b) {
    var ret = this.clone();

    for (var i = 0, len = b.length(); i < len; i++) {
        ret.append(b.getSymbolAt(i));
    }
//    console.log('strconcat', this.getId(), b.getId(), ret.getId());
    return ret;
};

/**
 * @return {number}
 */
pp.lg.String.prototype.length = function() {
    return this.str_.length;
};

/**
 * @param {number} index
 * @return {pp.lg.Symbol}
 */
pp.lg.String.prototype.getSymbolAt = function(index) {
    goog.asserts.assert(index >= 0 && index < this.str_.length, 'Index out of String range');
    return this.str_[index];
};

/**
 * @param {number} k
 * @return {pp.lg.Identificable}
 */
pp.lg.String.prototype.first = function(k) {
    var ret;

    switch(k) {
        case 0:
            ret = null;
            break;
        case 1:
            ret = this.getSymbolAt(0);
            break;
        default:
            var nk = Math.min(k, this.length());
            ret = new pp.lg.String();

            for (var i = 0;  i < nk; i++) {
                ret.append(this.getSymbolAt(i));
            }
        ;
    }

    return ret;
};


/**
 * @return {pp.lg.String}
 */
pp.lg.String.prototype.clone = function() {
    var ret = new pp.lg.String();

    for (var i = 0, len = this.length(); i < len; i++) {
        ret.append(this.getSymbolAt(i));
    }

    return ret;
};

/**
 * @return {string}
 */
pp.lg.String.prototype.toString = function() {
    return '"' + this.getId() + '"';
};