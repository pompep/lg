/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview Computes and holds values of nonterminals required for coumputation Follow-k set for givenn Nonterminal
 */

goog.provide('pp.lg.fp.Follow');
goog.require('pp.lg.Symbol');

/**
 * @param {pp.lg.Grammar} G
 * @param {number} k
 * @param {string} nonTermId
 * @constructor
 * @extends pp.lg.fp.Table
 */
pp.lg.fp.Follow = function(G, k, nonTermId) {
    /**
     * @type {pp.lg.Symbol}
     * @private
     */
    this.nonTerm_ = goog.asserts.assertInstanceof(G.getNonTermById(nonTermId), pp.lg.Symbol, nonTermId + ' is not in nonterminals set');

    goog.base(this, G, k);
};
goog.inherits(pp.lg.fp.Follow, pp.lg.fp.Table);

/**
 * @inheritDoc
 */
pp.lg.fp.Follow.prototype.getDebugTitle = function() {
    return 'Follow';
};

/**
 * @protected
 */
pp.lg.fp.Follow.prototype.buildEquations = function() {
    this.parseNonTermEq(this.nonTerm_);
};

/**
 *
 * @param {pp.lg.Symbol} s
 * @private
 */
pp.lg.fp.Follow.prototype.parseNonTermEq = function(s) {
    if (this.parsing(s)) {
        return;
    }

    this.addToParsing(s);
    var rules = this.G.getRulesRightContains(s),
        unionFuncs = [],
        nonTermEq
    ;

    for (var i = 0, len = rules.length; i < len; i++) {
        var r = rules[i],
            ruleStartNonTerm = r.getLeft().getSymbolAt(0)
        ;

        this.parseNonTermEq(ruleStartNonTerm); // follow of leftRight is needed

        var eq = goog.bind(function(nonTerm, startNonTerm, rightSuffix) {
            var first = this.G.first(rightSuffix, this.k),
                followOfStartNonTerm = this.get(startNonTerm),
                ret = first.kConcat(followOfStartNonTerm, this.k)
            ;

            //console.log(nonTerm.toString()+ '=' +'first of '+ rightSuffix.toString() + '='+ first.toString(), 'follow of ' + startNonTerm.toString() + '=' + followOfStartNonTerm.toString(), ret.toString())
            return ret;
        }, this, s, ruleStartNonTerm, r.getRight().suffixAfter(s));

        unionFuncs.push(eq);
    }

    nonTermEq = goog.bind(function(nonTerm, funcs) {
        var ret = new pp.lg.Set();
        for (var i = 0, l = funcs.length; i < l; i++) {
            ret = ret.union(funcs[i]());
        }

        if (this.G.isInitNonTerm(nonTerm)) {
            ret.add(null); // special rule when computing Follow for initial nonTerm
        }

        return ret;

    }, this, s, unionFuncs);

    this.addEquation(s, nonTermEq);
};
//
///**
// * @inheritDoc
// */
//pp.lg.fp.Follow.prototype.get = function(nonTerm) {
//    var ret = this.equations_[nonTerm.getId()].getResult();
//
//    if (this.G.isInitNonTerm(nonTerm)) {
//        ret.add(null); // special rule when computing Follow for initial nonTerm
//    }
//
//    return ret;
//};