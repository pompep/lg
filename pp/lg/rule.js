/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

goog.provide('pp.lg.Rule');

goog.require('pp.lg.String');

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

/**
 *
 * @param {pp.lg.Identificable} left
 * @return {boolean}
 */
pp.lg.Rule.prototype.leftIsEqual = function(left) {
    return this.left_.getId() === left.getId();
};

/**
 * @return {pp.lg.String}
 */
pp.lg.Rule.prototype.getRight = function() {
    return this.right_;
};

/**
 * @return {string}
 */
pp.lg.Rule.prototype.toString = function() {
    return this.left_.getId() + '->' + this.right_.getId();
};