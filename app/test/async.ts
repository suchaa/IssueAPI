import * as async from 'async';

async.waterfall([
    function(callback) {
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        console.log(arg1,arg2);
        
        callback(null, 'three');
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        console.log(arg1);
        
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
    console.log(result);
    
});
