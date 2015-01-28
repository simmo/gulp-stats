'use strict';

var chalk       = require('chalk'),
    figures     = require('figures'),
    prettyTime  = require('pretty-hrtime'),
    table       = require('text-table');

module.exports = function(gulp) {

    var tableData = [],
        startTime = process.hrtime();

    gulp.on('task_stop', function (e) {
        // Build entry
        var entry = {
            index:          tableData.length,
            task:           e.task,
            duration:       prettyTime(e.hrDuration),
            durationFloat:  e.duration,
        };

        // Add to table
        tableData.push(entry);
    });

    gulp.on('stop', function (e) {
        var totalTime    = process.hrtime(startTime),
            timeDiff     = totalTime[0] + (totalTime[1] / 1e9); // 1 times 10 to the power of 9

        // Format table
        function formatTable(data) {
            // Sort table by duration
            data.sort(function(a, b) {
                if (a.durationFloat == b.durationFloat) return 0;
                return (a.durationFloat > b.durationFloat) ? -1 : 1;
            });

            // Map objects
            var tableDataProcessed = data.map(function(entry) {
                return [entry.task, chalk.cyan(entry.duration), chalk.magenta(Math.round((entry.durationFloat / timeDiff) * 100) + '%')];
            });

            return table(tableDataProcessed);
        }

        // Overview
        console.log('\nGulp ran', chalk.cyan.bold(tableData.length + ' task' + (tableData.length === 1 ? '' : 's')), 'in', chalk.cyan.bold(prettyTime(totalTime)));

        // Display table
        console.log('\n' + formatTable(tableData) + '\n');
    });

};
