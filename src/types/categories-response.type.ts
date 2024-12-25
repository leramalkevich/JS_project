export type CategoriesResponseType = {
    error: boolean,
    response: {
        id: number,
        title: string,
        error?: boolean,
        message?: string
    }
}

export type CategoriesResponseMainPageType = {
    error:boolean,
    response: Array<OptionCategoryType>|Array<0>
    // response: OptionCategoryType | Array<OptionCategoryType>|Array<0>
    // response: {
    //     id: number,
    //     title: string,
    // }
}

export type OptionCategoryType = {
    readonly id: number,
    readonly title: string,
}

export type CategoryResponseType = {
    error:boolean,
    response: CategoryType|Array<CategoryType> | Array<0>
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

