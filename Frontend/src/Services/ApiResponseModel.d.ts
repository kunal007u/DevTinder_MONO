export interface ApiResponseModel<T> {
    data?: T;
    status: {
        message: string,
        code: number,
        type: string,
        error: string,
    };
}