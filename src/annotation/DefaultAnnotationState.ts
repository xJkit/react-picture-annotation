import ReactPictureAnnotation from "../ReactPictureAnnotation";
import { RectShape } from "../Shape";
import Transformer from "../Transformer";
import randomId from "../utils/randomId";
import { ToolState } from '../Annotation';
import { IAnnotationState } from "./AnnotationState";
import CreatingAnnotationState from "./CreatingAnnotationState";
import DraggingAnnotationState from "./DraggingAnnotationState";
import TransformationState from "./TransfromationState";
import MoveCanvasState from './MoveCanvasState';

export class DefaultAnnotationState implements IAnnotationState {
  private readonly context: ReactPictureAnnotation;
  constructor(context: ReactPictureAnnotation) {
    this.context = context;
  }

  public onMouseMove = () => undefined;
  public onMouseUp = () => undefined;
  public onMouseLeave = () => undefined;

  public onMouseDown = (positionX: number, positionY: number) => {
    const {
      shapes,
      currentTransformer,
      onShapeChange,
      setAnnotationState: setState,
      props,
    } = this.context;

    // 點選框變形
    if (
      currentTransformer &&
      currentTransformer.checkBoundary(positionX, positionY)
    ) {
      currentTransformer.startTransformation(positionX, positionY);
      setState(new TransformationState(this.context));
      return;
    }

    for (let i = shapes.length - 1; i >= 0; i--) {
      if (shapes[i].checkBoundary(positionX, positionY)) {
        // 移動圈選框
        this.context.selectedId = shapes[i].getAnnotationData().id;
        this.context.currentTransformer = new Transformer(
          shapes[i],
          this.context.scaleState.scale
        );
        const [selectedShape] = shapes.splice(i, 1);
        shapes.push(selectedShape);
        selectedShape.onDragStart(positionX, positionY);
        onShapeChange();
        setState(new DraggingAnnotationState(this.context));
        return;
      }
    }

    // [NEW] 移動 Canvas
    if (props.toolState === ToolState.Drag) {
      // 如果框框被選，就取消點選
      if (this.context.selectedId) {
        this.context.selectedId = null;
        onShapeChange();
      }
      setState(new MoveCanvasState(this.context, positionX, positionY));
      return;
    }

    // 新增框框
    this.context.shapes.push(
      new RectShape(
        {
          id: randomId(),
          mark: {
            x: positionX,
            y: positionY,
            width: 0,
            height: 0,
            type: "RECT",
          },
        },
        onShapeChange,
        this.context.annotationStyle
      )
    );
    setState(new CreatingAnnotationState(this.context));
  };
}
