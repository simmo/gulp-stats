# gulp-stats

![npm](https://img.shields.io/npm/v/gulp-stats?style=flat-square) ![npm](https://img.shields.io/npm/dw/gulp-stats?style=flat-square) ![Travis (.com)](https://img.shields.io/travis/com/simmo/gulp-stats?style=flat-square)

> Display task stats summary for [Gulp](https://gulpjs.com/)

![screenshot](screenshot.png)

## Installation

```sh
$ npm i --save-dev gulp-stats
```

## Usage

Add to your `gulpfile.js` before the task(s) you wish to log and pass in the instance of Gulp.

```js
const gulp = require('gulp');
const stats = require('gulp-stats');

stats(gulp);

// ... Tasks ...
```

### Options

#### `reporter: (report: Report) => void`

This can be used to provide your own report hander.

A `Report` is defined as:

```ts
{
	tasks: {
		name: string;
		duration: number;
		durationHr: [number, number];
		durationPretty: string;
	}
	[];
	totalTime: number;
	totalTimeHr: [number, number];
	totalTimePretty: string;
}
```

**Example**

```js
const gulp = require('gulp');
const stats = require('gulp-stats');

stats(gulp, reporter: ({ tasks, totalTimePretty }) => {
	console.log(`Total time: ${totalTimePretty}`);
	console.log(`Task count: ${tasks.length}`);
});
```

MIT © [Mike Simmonds](https://mike.id)
