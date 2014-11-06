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
goog.require('pp.lg.fp.First');
goog.require('pp.lg.fp.Follow');


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
     * @private
     */
    this.initNonTerm_ = goog.asserts.assertInstanceof(this.getNonTermById(S), pp.lg.Symbol, 'S is not defined in set on nonterminals');
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
    var rules = [],
        ruleId = 0
    ;
    
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
            rules.push(new pp.lg.Rule(left, new pp.lg.String(rights[j], this.alphabet_), ++ruleId));
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
//console.log(rightSuffix.toString(),this.k, this.G.first(rightSuffix, this.k))
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
 * @param {string|pp.lg.String} str
 * @param {number} k
 * @return {pp.lg.Set}
 */
pp.lg.Grammar.prototype.first = function(str, k) {
    goog.asserts.assert(k >= 0, 'k should be >= 0');

    var alpha = goog.isString(str) ? new pp.lg.String(str, this.alphabet_) : str,
        firsts = [],
        firstFixedPoint = new pp.lg.fp.First(this, k, alpha)
    ;

    for (var i = 0, len = alpha.length(); i < len; i++) {
        firsts.push(this.firstOfSymbol(alpha.getSymbolAt(i), firstFixedPoint));
    }

    var len = firsts.length,
        ret
    ;

    if (len > 0) {
        ret = firsts[0];

        for (var j = 1; j < len; j++) {
            ret = ret.kConcat(firsts[j], k);
        }
    } else {
        ret = new pp.lg.Set();
        ret.add(null);
    }

    return ret;
};

/**
 *
 * @param {pp.lg.Symbol} symbol
 * @param {pp.lg.fp.First} firstFixedPoint
 * @return {pp.lg.Set}
 * @private
 */
pp.lg.Grammar.prototype.firstOfSymbol = function(symbol, firstFixedPoint) {
    var ret;

    if (symbol.isTerminal()) {
        ret = new pp.lg.Set();
        ret.add(symbol);
    } else {
        ret = firstFixedPoint.get(symbol);
    }

    return ret;
};

/**
 *
 * @param {string} nonTermId
 * @param {number} k
 * @return {pp.lg.Set}
 */
pp.lg.Grammar.prototype.follow = function(nonTermId, k) {
    var followFixedPoint = new pp.lg.fp.Follow(this, k, nonTermId);
    return followFixedPoint.get(this.getNonTermById(nonTermId));
};

/**
 *
 * @param {pp.lg.Identificable} leftTerm
 * @return {!Array.<pp.lg.Rule>}
 */
pp.lg.Grammar.prototype.getRulesWithLeftEqual = function(leftTerm) {
    var filter = goog.bind(function(left, rule) {
        return rule.getLeft().equals(left);
    }, this, leftTerm);

    return goog.array.filter(this.rules_, filter);
};

/**
 *
 * @param {pp.lg.Symbol} symbol
 * @returns {!Array.<pp.lg.Rule>}
 */
pp.lg.Grammar.prototype.getRulesRightContains = function(symbol) {
    var filter = goog.bind(function(symbol, rule) {
        return rule.getRight().contains(symbol);
    }, this, symbol);
//console.log(symbol.toString(), goog.array.filter(this.rules_, filter))
    return goog.array.filter(this.rules_, filter);
};


/**
 * @param {string} nonTermId
 * @returns {pp.lg.Symbol}
 */
pp.lg.Grammar.prototype.getNonTermById = function(nonTermId) {
    return /** @type pp.lg.Symbol */ (this.nonTerms_.getById(nonTermId));
};

/**
 * @param {pp.lg.Symbol} nonTerm
 * @returns {boolean}
 */
pp.lg.Grammar.prototype.isInitNonTerm = function(nonTerm) {
    return this.initNonTerm_.equals(nonTerm);
};

/**
 *
 * @param {number} k
 * @return {!Array.<pp.lg.Set>}
 */
pp.lg.Grammar.prototype.sll = function(k) {
    var ret = [];

    for (var i = 0, len = this.rules_.length; i < len; i++) {
        var rule = this.rules_[i],
            fi = this.first(rule.getRight(), k),
            fo = this.follow(rule.getLeft().getId(), k),
            fifo = fi.kConcat(fo, k)
        ;

        console.log(i+1, fi.toString(), fo.toString(), fifo.toString());
        ret.push(fifo)
    }


    return ret;
};

/**
 * @return {boolean}
 */
pp.lg.Grammar.prototype.isReduced = goog.abstractMethod;

/**
 * @return {pp.lg.Grammar} new reduced grammar
 */
pp.lg.Grammar.prototype.reduce = goog.abstractMethod;

/**
 * @return {boolean}
 */
pp.lg.Grammar.prototype.isNormalized = goog.abstractMethod;