import { ReactPictureAnnotation } from "index";
import { IAnnotationState } from "./AnnotationState";
import { DefaultAnnotationState } from "./DefaultAnnotationState";

export default class DraggingAnnotationState implements IAnnotationState {
  private readonly context: ReactPictureAnnotation;
  constructor(context: ReactPictureAnnotation, positionX: number, positionY: number) {
    this.context = context;
    this.startX = positionX;
    this.startY = positionY;
  }
  public startX: number
  public startY: number
  public onMouseDown = () => undefined;
  public onMouseMove = (positionX: number, positionY: number) => {
    document.body.style.cursor = 'move';
    const scale = this.context.scaleState.scale;
    const dX = (positionX - this.startX) * scale;
    const dY = (positionY - this.startY) * scale;
    this.context.onImageMove(dX, dY)
  };

  public onMouseUp = () => {
    const { setAnnotationState, onShapeChange } = this.context;
    document.body.style.cursor = 'default';
    setAnnotationState(new DefaultAnnotationState(this.context));
    onShapeChange()
  };

  public onMouseLeave = () => this.onMouseUp();
}
