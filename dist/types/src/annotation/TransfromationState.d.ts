import { ReactPictureAnnotation } from "index";
import { IAnnotationState } from "./AnnotationState";
export default class TransformationState implements IAnnotationState {
    private readonly context;
    constructor(context: ReactPictureAnnotation);
    onMouseDown: () => undefined;
    onMouseMove: (positionX: number, positionY: number) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
}
