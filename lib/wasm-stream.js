'use strict';

var stream = require('stream');

function wasm2ast (main) {

    var $ = stream.Transform();

    // state
    var currBuff,
        prevBuff,
        currCurs = 0,
        job,
        nextChunk;

    function checkForJob () {
        var data, newCursor, dataLeft;
        if (job !== undefined) {
            if (currBuff !== undefined) {
                if (prevBuff === undefined) {
                    // no tail
                    newCursor = currCurs + job.len;
                    if (currBuff.length > newCursor) {
                        // enough data
                        data = currBuff.slice(currCurs, newCursor);
                        currCurs = newCursor;
                        job.done(data);
                    } else {
                        // not enough data
                        prevBuff = currBuff;
                        nextChunk();
                    }
                } else {
                    // have tail
                    dataLeft = prevBuff.length - currCurs;
                    if (job.len > (dataLeft + currBuff.length)) {
                        throw new Error('request is bigger then buffer size');
                    }
                    newCursor = job.len - dataLeft;
                    data = prevBuff
                        .slice(currCurs, prevBuff.length)
                        .concat(currBuff.slice(0, newCursor));
                    currCurs = newCursor;
                    job.done(data);
                }
            }
        }
    }

    $.on('error', function () { /* TODO */ });

    $._transform = function (chunk, enc, next) {
        currBuff = chunk;
        // prevBuff = currBuff;
        // prevCurs = currCurs;
        // currCurs = 0;
        // var res = (chunk.length).toString() + ' ';
        // $.push(Buffer.alloc(res.length, res, 'ascii'));
        nextChunk = next;
        checkForJob();
    };

    $._flush = function (next) {
        // $.push(Buffer.alloc(1, ')', 'ascii'));
        $.push(null);
        next();
    };

    function get (len, cb) {
        // console.log('get(' + len + ')');
        // register job
        job = {
            len: len,
            done: cb
        };
        checkForJob();
    }

    function set (data) {
        // console.log('set(' + data + ')');
        $.push(Buffer.alloc(data.length, data, 'ascii'));
    }

    main(get, set);

    return $;
}

module.exports = wasm2ast;
/* eslint no-console:0 */
