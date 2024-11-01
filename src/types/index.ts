export interface HbsOptions {
	cacheViews?: boolean;
	viewsPath: string;
	layoutsPath?: string;
	partialsPath?: string;
	globalData?: HbsData;
	externalPartialPaths?: string[];
	defaultLayout?: string;

}

export type HbsData = Record<string, any>;
