import chalk from 'chalk';
import { Reporter } from '../utils/types';
import table from 'text-table';
import stripAnsi from 'strip-ansi';

const header = (what: string, time: string) =>
	`\nGulp ran ${chalk.cyan.bold(what)} in ${chalk.cyan.bold(time)}\n`;

const logReporter: Reporter = ({ tasks, totalTime, totalTimePretty }) => {
	if (tasks.length === 0) {
		console.log(header('no tasks', totalTimePretty));

		return;
	}

	console.log(
		`${header(
			`${tasks.length} task${tasks.length === 1 ? '' : 's'}`,
			totalTimePretty
		)}\n${table(
			[
				['Task', 'Time', '% of total'].map(header =>
					chalk.bold.underline(header)
				),
				...tasks.map(({ duration, durationPretty, name }) => [
					name,
					chalk.cyan(durationPretty),
					chalk.magenta(Math.round((duration / totalTime) * 100) + '%'),
				]),
			],
			{
				align: ['l', 'r', 'r'],
				stringLength: (string: string) => stripAnsi(string).length,
			}
		)}\n`
	);
};

export default logReporter;
