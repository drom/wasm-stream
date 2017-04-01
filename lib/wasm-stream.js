'use strict';

var stream = require('stream');

function wasm2ast () {

    var $ = stream.Transform();

    // state
    $.on('error', function () { /* TODO */ });

    $._transform = function (chunk, enc, next) {
        var res = (chunk.length).toString() + ' ';
        $.push(Buffer.alloc(res.length, res, 'ascii'));
        next();
    };

    $._flush = function (next) {
        $.push(Buffer.alloc(1, ')', 'ascii'));
        $.push(null);
        next();
    };

    $.push(Buffer.alloc(2, '( ', 'ascii'));

    return $;
}

module.exports = wasm2ast;
