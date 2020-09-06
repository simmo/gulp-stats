export type Reporter = (report: Report) => void;

export type HrTime = [number, number];

export type Report = {
	tasks: {
		name: string;
		duration: number;
		durationHr: HrTime;
		durationPretty: string;
		isBranch: boolean;
		isRoot: boolean;
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
