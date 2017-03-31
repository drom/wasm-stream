#!/usr/bin/env node
'use strict';

var wasmStream = require('../lib/wasm-stream');

var c = wasmStream();

if (process.stdin.isTTY) {
    c.push('wasm2ast v1.0.0\n');
}

process.stdin.pipe(c).pipe(process.stdout);
