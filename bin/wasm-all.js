#!/usr/bin/env node
'use strict';

var wasmStream = require('../lib/wasm-stream'),
    fs = require('fs'),
    path = require('path');

var iPath = path.resolve(__dirname, '..', 'wasm');
var oPath = path.resolve(__dirname, '..', 'json');

fs.readdir(iPath, function (err, iFiles) {
    if (err) {
        throw err;
    }
    iFiles
    .filter(function (e) {
        return e.match('^(.*).wasm$');
    })
    .map(function (iFileName) {
        var iStream = fs.createReadStream(path.resolve(iPath, iFileName));
        var oStream = fs.createWriteStream(path.resolve(oPath, iFileName + '.json'));
        var $ = wasmStream();
        iStream.pipe($).pipe(oStream);
    });
});
