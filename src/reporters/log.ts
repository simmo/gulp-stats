import chalk from 'chalk';
import { Reporter } from '../types';
import table from 'text-table';
import stripAnsi from 'strip-ansi';

const logReporter: Reporter = ({ tasks, totalTime, totalTimePretty }) => {
	const formattedTasks = table(
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
	);

	console.log(
		`\nGulp ran ${chalk.cyan.bold(
			`${tasks.length} task${tasks.length === 1 ? '' : 's'}`
		)} in ${chalk.cyan.bold(totalTimePretty)}\n\n${formattedTasks}\n`
	);
};

export default logReporter;
