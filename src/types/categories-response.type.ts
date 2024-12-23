export type CategoriesResponseType = {
    error: boolean,
    response: {
        id: number,
        title: string,
        error?: boolean,
        message?: string
    }
}

export type OptionCategoryType = {
    readonly id: number,
    readonly title: string,
}

export type CategoryResponseType = {
    response: CategoryType | Array<CategoryType>
}

export type CategoryType = {
    id: number,
    type: string,
    amount: number,
    date: string,
    comment: string,
    category: string
}

export type OneTypeResponseType = {
    response: Array<TypeResponse>
}

export type TypeResponse = {
    id: number,
    title: string,
}

