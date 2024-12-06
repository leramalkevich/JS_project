export type RouteType = {
        route: string,
        title?: string,
        template?: string,
        load(): void,
        styles?: Array<string> |undefined,
        scripts?: Array<string>|undefined,
}