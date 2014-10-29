/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

goog.provide('pp.lg.Grammar');

goog.require('goog.string');
goog.require('goog.asserts');

goog.require('pp.lg.Symbol');
goog.require('pp.lg.Rule');
goog.require('pp.lg.Set');
goog.require('pp.lg.FixedPointTable');


/**
 * TODO automaticky rozpoznavat z pravidel? a udelat nepovinne parametry S N T
 * @param {!Array.<string>} P rule should be in this format a->b|c|d
 * @param {string} S
 * @param {!Array.<string>} T Defaults depends on P
 * @param {!Array.<string>} N Defaults depends on P
 * @constructor
 */
pp.lg.Grammar = function(P, S, T, N) {
    /**
     * @type {pp.lg.Set}
     * @private
     */
    this.nonTerms_ = new pp.lg.Set();

    /**
     * @type {pp.lg.Set}
     * @private
     */
    this.terms_ = new pp.lg.Set();

    /**
     * Holds all symbols (terms and nonterms)
     * @type {!pp.lg.Set}
     * @private
     */
    this.alphabet_ = this.initAlphabet(T, N);

    /**
     * @type {Array.<pp.lg.Rule>}
     * @private
     */
    this.rules_ = this.initRules(P);

    /**
     *
     * @type {pp.lg.Symbol}
     */
    this.start = goog.asserts.assertInstanceof(this.nonTerms_.getById(S), pp.lg.Symbol, 'S is not defined in set on nonterminals');
};

/**
 *
 * @type {string}
 */
pp.lg.Grammar.prototype.ruleSeparator = '|';

/**
 *
 * @type {string}
 */
pp.lg.Grammar.prototype.lrSeparator = '->';

/**
 *
 * @param {!Array.<string>} ruleStrs a->b|c|d
 * @returns {!Array.<pp.lg.Rule>}
 */
pp.lg.Grammar.prototype.initRules = function(ruleStrs) {
    var rules = [];
    
    for (var i = 0, len = ruleStrs.length; i < len; i++) {
        var rule = ruleStrs[i],
            left_rights = rule.split(this.lrSeparator),
            rights
        ;

        goog.asserts.assert(goog.string.contains(rule, this.lrSeparator) && left_rights.length === 2, 'Rule must be of format alpha'+ this.lrSeparator + 'beta');

        if (goog.string.contains(left_rights[1], this.ruleSeparator)) {
            rights = left_rights[1].split(this.ruleSeparator);
        } else {
            rights = [left_rights[1]];
        }

        var left = new pp.lg.String(left_rights[0], this.alphabet_);

        for (var j = 0, l= rights.length; j < l; j++) {
            rules.push(new pp.lg.Rule(left, new pp.lg.String(rights[j], this.alphabet_)));
        }
    }

    return rules;
};

/**
 *
 * @param {!Array.<string>} terms
 * @param {!Array.<string>} nonTerms
 * @returns {!pp.lg.Set}
 * @private
 */
pp.lg.Grammar.prototype.initAlphabet = function(terms, nonTerms) {
    var s;

    var alphabet = new pp.lg.Set();

    for (var i = 0, len = terms.length; i < len; i++) {
        var term = new pp.lg.Symbol(terms[i], true);
        alphabet.add(term);
        this.terms_.add(term);
    }

    for (var j = 0, l = nonTerms.length; j < l; j++) {
        var nonTerm = new pp.lg.Symbol(nonTerms[j], false);

        if (!alphabet.add(nonTerm)) {
            goog.asserts.fail('Terminal / nonterminal chaos')
        } else {
            this.nonTerms_.add(nonTerm);
        }
    }

    alphabet.close();
    this.terms_.close();
    this.nonTerms_.close();

    return alphabet;
};

/**
 * @param {string} str
 * @param {number} k
 * @return {pp.lg.Set}
 */
pp.lg.Grammar.prototype.first = function(str, k) {
    goog.asserts.assert(k >= 0, 'k should be >= 0');

    var alpha = new pp.lg.String(str, this.alphabet_),
        firsts = [],
        fixedPointTable = new pp.lg.FixedPointTable(this, alpha, k)
    ;

    for (var i = 0, len = alpha.length(); i < len; i++) {
        firsts.push(this.firstOfSymbol(alpha.getSymbolAt(i), fixedPointTable));
    }

    var ret = firsts[0];

    for (var j = 1, len = firsts.length; j < len; j++) {
        ret = ret.kConcat(firsts[j], k);
    }

    return ret;
};

/**
 *
 * @param {pp.lg.Symbol} symbol
 * @param {pp.lg.FixedPointTable} fixedPointTable
 * @return {pp.lg.Set}
 * @private
 */
pp.lg.Grammar.prototype.firstOfSymbol = function(symbol, fixedPointTable) {
    var ret;

    if (symbol.isTerminal()) {
        ret = new pp.lg.Set();
        ret.add(symbol);
    } else {
        ret = fixedPointTable.get(symbol);
    }

    return ret;
};

//pp.lg.Grammar.prototype.fixedPointTable = function() {
//    var ret = {},
//        nonTerms = this.nonTerms_.asArray()
//    ;
//
//    for (var i = 0, len = nonTerms.length; i < len; i++) {
//        ret
//
//    }
//
//    return ret;
//};

/**
 *
 * @param {string} nonTerm
 * @return {pp.lg.Set}
 */
pp.lg.Grammar.prototype.follow = function(nonTerm) {
    var ret = new pp.lg.Set();
    return ret;
};

/**
 *
 * @param leftTerm
 * @return {!Array.<pp.lg.Rule>}
 */
pp.lg.Grammar.prototype.getRulesWithLeftEqual = function(leftTerm) {
    var ret = [];

    for (var i = 0, len = this.rules_.length; i < len; i++) {
        var rule = this.rules_[i];

        if (rule.leftIsEqual(leftTerm)) {
            ret.push(rule);
        }
    }

    return ret;
};