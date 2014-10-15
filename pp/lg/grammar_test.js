/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

var g = new pp.lg.Grammar([
    'A->Bc|a',
    'B->A|C|d',
    'C->B|D',
    'D->e'
], 'S', ['c', 'a', 'd', 'e'], ['A', 'B', 'C', 'D']);