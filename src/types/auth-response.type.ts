export type RefreshResponseType = {
    tokens: {
        accessToken: string,
        refreshToken: string
    }
}

export type RefreshResponseErrorType = {
    error: boolean;
    message: string;
    validation: Array<{ key: string, message: string }>
}

export type LoginResponseType = {
    tokens: {
        accessToken: string,
        refreshToken: string
    },
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

export type UserInfoResponseType = {
    user:{
        name:string,
        lastName:string,
        id:number
    }
}