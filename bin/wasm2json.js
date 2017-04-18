#!/usr/bin/env node
'use strict';

var wasmStream = require('../lib/wasm-stream');

var magicVersion = Buffer.alloc(8, '0061736d01000000', 'hex').toString();

function main (get, set) {

    // function onSectionType (b) {
    //
    //     function onSectionTypeNumTypes (b) {
    //         console.log(b);
    //     }
    //
    //     var sectionSize = b[0];
    //     get(1, onSectionTypeNumTypes);
    // }

    function onSection (b) {
        var sectionKind = b[0];
        set('section ' + sectionKind.toString());
        get(1, function (b1) {

            var sectionSize = b1[0];
            set(' size ' + sectionSize.toString() + '\n');

            function onSectionSkip () {
                get(sectionSize, function () {
                    get(1, onSection);
                });
            }

            switch (sectionKind) {
            // case 0:
            //     set('type 0:\n');
            //     break;
            // case 1:
            //     set('section "Type":\n');
            //     get(1, onSectionType);
            //     break;
            default:
                // set(sectionKind.toString());
                onSectionSkip();
            }

        });
    }

    function onMagicVersion (b) {
        if (b.toString() !== magicVersion) {
            console.error('Unknown format:', b);
        }
        set('module\n');
        get(1, onSection);
    }

    get(8, onMagicVersion);
}

var c = wasmStream(main);

if (process.stdin.isTTY) {
    c.push('wasm2ast v1.0.0\n');
}

process.stdin.pipe(c).pipe(process.stdout);

/* eslint no-console:0*/
