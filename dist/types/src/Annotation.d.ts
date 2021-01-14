import { IShapeData } from "Shape";
export interface IAnnotation<T = IShapeData> {
    comment?: string;
    order?: number;
    id: string;
    mark: T;
}
