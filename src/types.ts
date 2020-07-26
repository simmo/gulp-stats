export type Reporter = <R>(report: Report) => R | void;

export type HrTime = [number, number];

export type Report = {
	tasks: {
		name: string;
		duration: number;
		durationHr: HrTime;
		durationPretty: string;
	}[];
	totalTime?: number;
	totalTimeHr?: HrTime;
	totalTimePretty?: string;
};

export type GulpEvent = {
	uid: number;
	name: string;
	duration: HrTime;
	branch: boolean;
};
