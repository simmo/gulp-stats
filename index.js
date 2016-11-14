'use strict';

var chalk       = require('chalk'),
    prettyTime  = require('pretty-hrtime'),
    table       = require('text-table');

function formatTable(data) {
    var timeDiff = data.totalTime[0] + (data.totalTime[1] / 1e9); // 1 times 10 to the power of 9

    function ordinalSuffixOf(i) {
        var j = i % 10,
            k = i % 100;

        if (j === 1 && k !== 11) {
            return i + 'st';
        }
        if (j === 2 && k !== 12) {
            return i + 'nd';
        }
        if (j === 3 && k !== 13) {
            return i + 'rd';
        }
        return i + 'th';
    }

    // Sort table by duration
    data.stats.sort(function(a, b) {
        if (a.durationFloat === b.durationFloat) {
            return 0;
        }
        return (a.durationFloat > b.durationFloat) ? -1 : 1;
    });

    var outHead = ['Task', 'Time', '% of total', 'Finished'].map(function(heading) {
        return chalk.bold.underline(heading);
    });

    var outList = data.stats.map(function(entry) {
        return [
            entry.task,
            chalk.cyan(entry.duration),
            chalk.magenta(Math.round((entry.durationFloat / timeDiff) * 100) + '%'),
            ordinalSuffixOf(entry.finishIndex + 1),
        ];
    });

    var outTable = [outHead].concat(outList);

    var tableOpts = {
        align: ['l', 'r', 'r', 'r'],
        stringLength: function(str) {
            var r = new RegExp('\x1b(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)', 'g');
            return str.replace(r, '').length;
        }
    };

    return table(outTable, tableOpts);
}

function defaultReporter(data) {
    // Overview
    console.log('\nGulp ran', chalk.cyan.bold(data.stats.length + ' task' + (data.stats.length === 1 ? '' : 's')), 'in', chalk.cyan.bold(prettyTime(data.totalTime)));

    // Display table
    console.log('\n' + formatTable(data) + '\n');
}

module.exports = function(gulp, reporter) {

    reporter = typeof reporter !== 'undefined' ? reporter : defaultReporter;

    var tableData, startTime;

    function reset() {
        tableData = null;
        startTime = null;
    }

    reset();

    gulp.on('task_start', function () {
        if (tableData === null || startTime === null) {
            tableData = [];
            startTime = process.hrtime();
        }
    });

    gulp.on('task_stop', function (e) {
        // Build entry
        var entry = {
            finishIndex:    tableData.length,
            task:           e.task,
            duration:       prettyTime(e.hrDuration),
            durationFloat:  e.duration,
        };

        // Add to table
        tableData.push(entry);
    });

    gulp.on('stop', function () {
        var totalTime = process.hrtime(startTime);

        reporter({startTime: startTime, totalTime: totalTime, stats: tableData});

        reset();
    });

};
