import { IShape, IShapeBase } from "Shape";
export interface ITransformer {
    checkBoundary: (positionX: number, positionY: number) => boolean;
    startTransformation: (positionX: number, positionY: number) => void;
    onTransformation: (positionX: number, positionY: number) => void;
    paint: (canvas2D: CanvasRenderingContext2D, calculateTruePosition: (shapeData: IShapeBase) => IShapeBase, scale: number) => void;
}
export default class Transformer implements ITransformer {
    private readonly shape;
    private currentNodeCenterIndex;
    private scale;
    private get nodeWidth();
    constructor(shape: IShape, scale: number);
    checkBoundary: (positionX: number, positionY: number) => boolean;
    startTransformation: (positionX: number, positionY: number) => void;
    onTransformation: (positionX: number, positionY: number) => void;
    paint: (canvas2D: CanvasRenderingContext2D, calculateTruePosition: (shapeData: IShapeBase) => IShapeBase, scale: number) => void;
    private getCenterIndexByCursor;
    private checkEachRectBoundary;
    private getAllCentersTable;
}
