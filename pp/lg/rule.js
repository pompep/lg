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
 * @param {number} right
 * @constructor
 */
pp.lg.Rule = function(left, right, id) {
    /**
     * @type {number}
     * @private
     */
    this.id_ = id;

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
 * @return {pp.lg.String}
 */
pp.lg.Rule.prototype.getLeft = function() {
    return this.left_;
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
    return '(' + this.id_ + '): ' + this.left_.getId() + '->' + this.right_.getId();
};