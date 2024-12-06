export type CategoriesResponseType = {
    response: {
        id: number,
        title: string,
        error?: boolean,
        message?: string
    }
}

export type CategoryResponseType = {
    response: {
        id: number,
        type: string,
        amount: number,
        date: string,
        comment: string,
        category: string
    }
}

export type OneTypeResponseType = {
    response: Array<typeResponse>
}

export type typeResponse = {
    id: number,
    title: string,
}

