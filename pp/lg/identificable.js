/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

goog.provide('pp.lg.Identificable');

/**
 * @interface
 */
pp.lg.Identificable = function() {};

/**
 * @return {string}
 */
pp.lg.Identificable.prototype.getId = function() {};

/**
 * @param {pp.lg.Identificable} b
 * @return {pp.lg.Identificable}
 */
pp.lg.Identificable.prototype.concat = function(b) {};

/**
 * @return {number}
 */
pp.lg.Identificable.prototype.length = function() {};

/**
 * @param {number} index
 * @return {pp.lg.Symbol}
 */
pp.lg.Identificable.prototype.getSymbolAt = function(index) {};

/**
 * @param {number} k
 * @return {pp.lg.Identificable}
 */
pp.lg.Identificable.prototype.first = function(k) {};

/**
 * @return {string}
 */
pp.lg.Identificable.prototype.toString = function() {};

/**
 * @param {pp.lg.Identificable} b
 * @return {boolean}
 */
pp.lg.Identificable.prototype.equals = function(b) {};