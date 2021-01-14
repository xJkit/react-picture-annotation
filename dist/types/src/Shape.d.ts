import { IAnnotation } from "./Annotation";
export declare const defaultShapeStyle: IShapeStyle;
export interface IShapeStyle {
    padding: number;
    lineWidth: number;
    shadowBlur: number;
    fontSize: number;
    fontColor: string;
    fontBackground: string;
    fontFamily: string;
    shapeBackground: string;
    shapeStrokeStyle: string;
    shapeShadowStyle: string;
    transformerBackground: string;
    transformerSize: number;
}
export interface IShapeBase {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface IShapeAdjustBase {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}
export interface IShapeData extends IShapeBase {
    type: string;
}
export interface IRectShapeData extends IShapeData {
    type: "RECT";
}
export interface IShape {
    shapeStyle: IShapeStyle;
    onDragStart: (positionX: number, positionY: number) => void;
    onDrag: (positionX: number, positionY: number) => void;
    checkBoundary: (positionX: number, positionY: number) => boolean;
    paint: (canvas2D: CanvasRenderingContext2D, calculateTruePosition: (shapeData: IShapeBase) => IShapeBase, selected: boolean) => IShapeBase;
    getAnnotationData: () => IAnnotation;
    adjustMark: (adjustBase: IShapeAdjustBase) => void;
    setComment: (comment: string) => void;
    equal: (data: IAnnotation) => boolean;
}
export declare class RectShape implements IShape {
    private readonly annotationData;
    private readonly onChangeCallBack;
    private dragStartOffset;
    readonly shapeStyle: IShapeStyle;
    constructor(data: IAnnotation<IShapeData>, onChange: () => void, shapeStyle?: IShapeStyle);
    onDragStart: (positionX: number, positionY: number) => void;
    onDrag: (positionX: number, positionY: number) => void;
    checkBoundary: (positionX: number, positionY: number) => boolean;
    paint: (canvas2D: CanvasRenderingContext2D, calculateTruePosition: (shapeData: IShapeBase) => IShapeBase, selected: boolean) => {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    adjustMark: ({ x, y, width, height, }: {
        x?: number | undefined;
        y?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }) => void;
    getAnnotationData: () => IAnnotation<IShapeData>;
    setComment: (comment: string) => void;
    equal: (data: IAnnotation) => boolean;
}
