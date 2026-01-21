export class Result<T, E = Error> {
    private readonly _isSuccess  : boolean;
    private readonly _value     ?: T;
    private readonly _error     ?: E;

    private constructor(isSuccess: boolean, error?: E, value?: T) {
        this._isSuccess = isSuccess;
        this._error     = error;
        this._value     = value;

        if (isSuccess && error) {
            throw new Error('Invalid Result: Success result cannot have an error');
        }
        if (!isSuccess && value !== undefined) {
            throw new Error('Invalid Result: Failure result cannot have a value');
        }
    }

    // ==================== Factory Methods ====================
    public static ok<U, F = Error>(value?: U): Result<U, F> {
        return new Result<U, F>(true, undefined, value);
    }

    public static fail<U, F = Error>(error: F): Result<U, F> {
        return new Result<U, F>(false, error);
    }

    // ==================== State Checkers ====================
    public isOk(): boolean {
        return this._isSuccess;
    }

    public isFailure(): boolean {
        return !this._isSuccess;
    }

    // ==================== Getters ====================
    public getValue(): T {
        if (!this._isSuccess) {
            throw new Error("Cannot get value from a failed result. Use getError() instead.");
        }
        return this._value as T;
    }

    public getError(): E {
        if (this._isSuccess) {
            throw new Error("Cannot get error from a successful result. Use getValue() instead.");
        }
        return this._error as E;
    }

    public getValueOrUndefined(): T | undefined {
        return this._isSuccess ? this._value : undefined;
    }

    public getErrorOrUndefined(): E | undefined {
        return !this._isSuccess ? this._error : undefined;
    }

    // ==================== Functional Methods ====================
    public map<U>(fn: (value: T) => U): Result<U, E> {
        if (this._isSuccess) {
            return Result.ok(fn(this._value as T));
        }
        return Result.fail(this._error as E);
    }

    public mapError<F>(fn: (error: E) => F): Result<T, F> {
        if (this._isSuccess) {
            return Result.ok(this._value);
        }
        return Result.fail(fn(this._error as E));
    }

    public flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        if (this._isSuccess) {
            return fn(this._value as T);
        }
        return Result.fail(this._error as E);
    }

    public match<U>(patterns: {
        ok   : (value: T) => U;
        fail : (error: E) => U;
    }) : U {
        if (this._isSuccess) {
            return patterns.ok(this._value as T);
        }
        return patterns.fail(this._error as E);
    }

    public onSuccess(fn: (value: T) => void): Result<T, E> {
        if (this._isSuccess) {
            fn(this._value as T);
        }
        return this;
    }

    public onFailure(fn: (error: E) => void): Result<T, E> {
        if (!this._isSuccess) {
            fn(this._error as E);
        }
        return this;
    }

    public getOrElse(defaultValue: T): T {
        return this._isSuccess ? (this._value as T) : defaultValue;
    }

    public toJSON() {
        return {
            isSuccess: this._isSuccess,
            value: this._value,
            error: this._error,
        };
    }
}
