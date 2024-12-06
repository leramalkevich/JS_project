export type RefreshResponseType = {
    accessToken: string,
    refreshToken: string
}

export type RefreshResponseErrorType = {
    error: boolean;
    message: string;
    validation: Array<{ key: string, message: string }>
}

export type LoginResponseType = {
    tokens: RefreshResponseType,
    user: {
        name: string,
        lastName: string,
        id: number,
    }
}

export type SignUpResponseType = {
    user: {
        id: number,
        email: string,
        name: string,
        lastName: string,
    },
}