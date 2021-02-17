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
    this.context.onImageMove(positionX - this.startX, positionY - this.startY)
  };

  public onMouseUp = () => {
    const { setAnnotationState } = this.context;
    document.body.style.cursor = 'default';
    setAnnotationState(new DefaultAnnotationState(this.context));
  };

  public onMouseLeave = () => this.onMouseUp();
}
