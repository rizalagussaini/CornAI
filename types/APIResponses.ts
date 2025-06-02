export type APIResponse = {
	status: number;
	description: string;
	response?: any;
};

export type APIChatResponse = {
	thread_id: string;
	message: string;
};

export type APIThreadMessage = {
	id: string;
	role: string;
	content: APIMessageContent[];
};

export type APIMessageContent = {
	type: string;
	text?: string;
	image_url?: {
		url: string;
	}
};