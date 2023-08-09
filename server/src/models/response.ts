export interface ResponseInterface<T> {
    message: string;
    data: T | undefined;
    error: boolean;
}
