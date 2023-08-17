export interface ResponseInterface<T> {
    message: string | null;
    data: T | undefined | null;
    error: boolean;
}
