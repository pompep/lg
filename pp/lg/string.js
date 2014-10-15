/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

goog.provide('pp.lg.String');

/**
 *
 * @param {string} str
 * @param {pp.lg.Set} alphabet
 * @constructor
 */
pp.lg.String = function(str, alphabet) {

    /**
     * @type {!Array.<pp.lg.Symbol>}
     * @private
     */
    this.str_ = [];

    for (var i = 0, len = str.length; i < len; i++) {
        var symbol = goog.asserts.assertInstanceof(alphabet.getById(str[i]), pp.lg.Symbol, 'String contains symbols not from given alphabet');
        this.str_.push(symbol);
    }
};