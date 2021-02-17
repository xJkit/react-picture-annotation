import React from 'react';
import { IAnnotation, ToolState } from './Annotation';
import { IAnnotationState } from './annotation/AnnotationState';
import { IShape, IShapeBase, IShapeStyle } from './Shape';
import { ITransformer } from './Transformer';
interface IReactPictureAnnotationProps {
    annotationData?: IAnnotation[];
    selectedId?: string | null;
    scrollSpeed: number;
    marginWithInput: number;
    onChange: (annotationData: IAnnotation[]) => void;
    onSelect: (id: string | null) => void;
    width: number;
    height: number;
    image: string;
    annotationStyle: IShapeStyle;
    toolState: string;
    inputElement: (value: string, onChange: (value: string) => void, onDelete: () => void) => React.ReactElement;
}
interface IStageState {
    scale: number;
    originX: number;
    originY: number;
}
interface IInitialStageState {
    initialScale: number;
    initialX: number;
    initialY: number;
}
export default class ReactPictureAnnotation extends React.Component<IReactPictureAnnotationProps> {
    static defaultProps: {
        marginWithInput: number;
        scrollSpeed: number;
        toolState: ToolState;
        annotationStyle: IShapeStyle;
        inputElement: (value: string, onChange: (value: string) => void, onDelete: () => void) => JSX.Element;
    };
    state: {
        inputPosition: {
            left: number;
            top: number;
        };
        showInput: boolean;
        inputComment: string;
    };
    set selectedId(value: string | null);
    get selectedId(): string | null;
    get annotationStyle(): IShapeStyle;
    shapes: IShape[];
    scaleState: IStageState;
    initialScaleState: IInitialStageState;
    currentTransformer: ITransformer;
    private currentAnnotationData;
    private selectedIdTrueValue;
    private canvasRef;
    private canvas2D?;
    private imageCanvasRef;
    private imageCanvas2D?;
    private currentImageElement?;
    private currentAnnotationState;
    componentDidMount: () => void;
    componentDidUpdate: (preProps: IReactPictureAnnotationProps) => void;
    calculateMousePosition: (positionX: number, positionY: number) => {
        positionX: number;
        positionY: number;
    };
    calculateShapePosition: (shapeData: IShapeBase) => IShapeBase;
    render(): JSX.Element;
    setAnnotationState: (annotationState: IAnnotationState) => void;
    onShapeChange: () => void;
    private syncAnnotationData;
    private syncSelectedId;
    private onDelete;
    private setCanvasDPI;
    private onInputCommentChange;
    private cleanImage;
    private onImageChange;
    onImageMove: (dX?: number, dY?: number) => void;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    private onMouseLeave;
    zoomIn: () => void;
    zoomOut: () => void;
    zoomReset: () => void;
    private onWheel;
}
export {};
