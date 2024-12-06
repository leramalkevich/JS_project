import config from "../../config/config";

export class CommonUtils {
    public static getOperationType(type:string): string {
        let typeHtml: string | null;
        switch (type) {
            case config.operationType.expense:
                typeHtml = '<span class="text-danger">расход</span>';
                break;
            case config.operationType.income:
                typeHtml = '<span class="text-success">доход</span>';
                break;
            default:
                typeHtml = '<span class="text-secondary">Неизвестно</span>';
        }

        return typeHtml;
    }
}