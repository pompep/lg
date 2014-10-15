/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

goog.provide('pp.lg.Rule');

goog.require('pp.lg.string');

/**
 *
 * @param {pp.lg.String} left
 * @param {pp.lg.String} right
 * @constructor
 */
pp.lg.Rule = function(left, right) {

    /**
     * @type {pp.lg.String}
     * @private
     */
    this.left_ = left;

    /**
     * @type {pp.lg.String}
     * @private
     */
    this.right_ = right;
};