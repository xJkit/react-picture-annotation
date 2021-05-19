import React, { MouseEventHandler } from 'react';
import { IAnnotation, ToolState } from './Annotation';
import { IAnnotationState } from './annotation/AnnotationState';
import { DefaultAnnotationState } from './annotation/DefaultAnnotationState';
import DefaultInputSection from './DefaultInputSection';
// import DeleteButton from "./DeleteButton";
import {
  defaultShapeStyle,
  IShape,
  IShapeBase,
  IShapeStyle,
  RectShape,
} from './Shape';
import Transformer, { ITransformer } from './Transformer';

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
  isDraggingTextBox: boolean;
  inputElement: (
    value: string,
    onChange: (value: string) => void,
    onDelete: () => void
  ) => React.ReactElement;
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

const defaultState: IStageState = {
  scale: 1,
  originX: 0,
  originY: 0,
};

const initialScaleState: IInitialStageState = {
  initialScale: 1,
  initialX: 0,
  initialY: 0,
};

export default class ReactPictureAnnotation extends React.Component<
  IReactPictureAnnotationProps
> {
  public static defaultProps = {
    marginWithInput: 10,
    scrollSpeed: 0.0005,
    toolState: ToolState.Normal,
    isDraggingTextBox: true,
    annotationStyle: defaultShapeStyle,
    inputElement: (
      value: string,
      onChange: (value: string) => void,
      onDelete: () => void
    ) => (
      <DefaultInputSection
        value={value}
        onChange={onChange}
        onDelete={onDelete}
      />
    ),
  };

  public state = {
    inputPosition: {
      left: 0,
      top: 0,
    },
    showInput: false,
    inputComment: '',
  };

  set selectedId(value: string | null) {
    const { onSelect } = this.props;
    this.selectedIdTrueValue = value;
    onSelect(value);
  }

  get selectedId() {
    return this.selectedIdTrueValue;
  }

  get annotationStyle() {
    return this.props.annotationStyle;
  }
  public shapes: IShape[] = [];
  public scaleState = defaultState;
  public initialScaleState = initialScaleState;
  public currentTransformer: ITransformer;

  private currentAnnotationData: IAnnotation[] = [];
  private selectedIdTrueValue: string | null;
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private canvas2D?: CanvasRenderingContext2D | null;
  private imageCanvasRef = React.createRef<HTMLCanvasElement>();
  private imageCanvas2D?: CanvasRenderingContext2D | null;
  private currentImageElement?: HTMLImageElement;
  private currentAnnotationState: IAnnotationState = new DefaultAnnotationState(
    this
  );

  public componentDidMount = () => {
    const currentCanvas = this.canvasRef.current;
    const currentImageCanvas = this.imageCanvasRef.current;
    if (currentCanvas && currentImageCanvas) {
      this.setCanvasDPI();

      this.canvas2D = currentCanvas.getContext('2d');
      this.imageCanvas2D = currentImageCanvas.getContext('2d');
      this.onImageChange();
    }

    this.syncAnnotationData();
    this.syncSelectedId();
  };

  public componentDidUpdate = (preProps: IReactPictureAnnotationProps) => {
    const { width, height, image } = this.props;
    if (preProps.width !== width || preProps.height !== height) {
      this.setCanvasDPI();
      this.onShapeChange();
      this.onImageChange();
    }
    if (preProps.image !== image) {
      this.cleanImage();
      if (this.currentImageElement) {
        this.currentImageElement.src = image;
      } else {
        this.onImageChange();
      }
    }

    this.syncAnnotationData();
    this.syncSelectedId();
  };

  public calculateMousePosition = (positionX: number, positionY: number) => {
    const { originX, originY, scale } = this.scaleState;
    return {
      positionX: (positionX - originX) / scale,
      positionY: (positionY - originY) / scale,
    };
  };

  public calculateShapePosition = (shapeData: IShapeBase): IShapeBase => {
    const { originX, originY, scale } = this.scaleState;
    const { x, y, width, height } = shapeData;
    return {
      x: x * scale + originX,
      y: y * scale + originY,
      width: width * scale,
      height: height * scale,
    };
  };

  public render() {
    const { width, height, inputElement } = this.props;
    const { showInput, inputPosition, inputComment } = this.state;
    return (
      <div className="rp-stage">
        <canvas
          style={{ width, height }}
          className="rp-image"
          ref={this.imageCanvasRef}
          width={width * 2}
          height={height * 2}
        />
        <canvas
          className="rp-shapes"
          style={{ width, height }}
          ref={this.canvasRef}
          width={width * 2}
          height={height * 2}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseLeave}
          onWheel={this.onWheel}
        />
        {showInput && (
          <div className="rp-selected-input" style={inputPosition}>
            {inputElement(
              inputComment,
              this.onInputCommentChange,
              this.onDelete
            )}
          </div>
        )}
      </div>
    );
  }

  public setAnnotationState = (annotationState: IAnnotationState) => {
    this.currentAnnotationState = annotationState;
  };

  public onShapeChange = () => {
    // 新增框框
    if (this.canvas2D && this.canvasRef.current) {
      this.canvas2D.clearRect(
        0,
        0,
        this.canvasRef.current.width,
        this.canvasRef.current.height
      );

      let hasSelectedItem = false;

      for (const item of this.shapes) {
        const isSelected = item.getAnnotationData().id === this.selectedId;
        const { x, y, height } = item.paint(
          this.canvas2D,
          this.calculateShapePosition,
          isSelected
        );

        if (isSelected) {
          if (!this.currentTransformer) {
            this.currentTransformer = new Transformer(
              item,
              this.scaleState.scale
            );
          }

          hasSelectedItem = true;

          this.currentTransformer.paint(
            this.canvas2D,
            this.calculateShapePosition,
            this.scaleState.scale
          );

          this.setState({
            showInput: true,
            inputPosition: {
              left: x,
              top: y + height + this.props.marginWithInput,
            },
            inputComment: item.getAnnotationData().comment || '',
          });
        }
      }

      if (!hasSelectedItem) {
        this.setState({
          showInput: false,
          inputComment: '',
        });
      }
    }

    this.currentAnnotationData = this.shapes.map((item) =>
      item.getAnnotationData()
    );
    const { onChange } = this.props;
    onChange(this.currentAnnotationData);
  };

  private syncAnnotationData = () => {
    const { annotationData } = this.props;
    if (annotationData) {
      const refreshShapesWithAnnotationData = () => {
        this.selectedId = null;
        this.shapes = annotationData.map(
          (eachAnnotationData) =>
            new RectShape(
              eachAnnotationData,
              this.onShapeChange,
              this.annotationStyle
            )
        );
        this.onShapeChange();
      };

      if (annotationData.length !== this.shapes.length) {
        refreshShapesWithAnnotationData();
      } else {
        for (const annotationDataItem of annotationData) {
          const targetShape = this.shapes.find(
            (item) => item.getAnnotationData().id === annotationDataItem.id
          );
          if (targetShape && targetShape.equal(annotationDataItem)) {
            continue;
          } else {
            refreshShapesWithAnnotationData();
            break;
          }
        }
      }
    }
  };

  private syncSelectedId = () => {
    const { selectedId } = this.props;

    if (selectedId && selectedId !== this.selectedId) {
      this.selectedId = selectedId;
      this.onShapeChange();
    }
  };

  private onDelete = () => {
    const deleteTarget = this.shapes.findIndex(
      (shape) => shape.getAnnotationData().id === this.selectedId
    );
    if (deleteTarget >= 0) {
      this.shapes.splice(deleteTarget, 1);
      this.onShapeChange();
    }
  };

  private setCanvasDPI = () => {
    const currentCanvas = this.canvasRef.current;
    const currentImageCanvas = this.imageCanvasRef.current;
    if (currentCanvas && currentImageCanvas) {
      const currentCanvas2D = currentCanvas.getContext('2d');
      const currentImageCanvas2D = currentImageCanvas.getContext('2d');
      if (currentCanvas2D && currentImageCanvas2D) {
        currentCanvas2D.scale(2, 2);
        currentImageCanvas2D.scale(2, 2);
      }
    }
  };

  private onInputCommentChange = (comment: string) => {
    const selectedShapeIndex = this.shapes.findIndex(
      (item) => item.getAnnotationData().id === this.selectedId
    );
    this.shapes[selectedShapeIndex].setComment(comment);
    this.setState({ inputComment: comment });
  };

  private cleanImage = () => {
    if (this.imageCanvas2D && this.imageCanvasRef.current) {
      this.imageCanvas2D.clearRect(
        0,
        0,
        this.imageCanvasRef.current.width,
        this.imageCanvasRef.current.height
      );
    }
  };

  private onImageChange = () => {
    this.cleanImage();
    if (this.imageCanvas2D && this.imageCanvasRef.current) {
      if (this.currentImageElement) {
        const { originX, originY, scale } = this.scaleState;
        this.imageCanvas2D.drawImage(
          this.currentImageElement,
          originX,
          originY,
          this.currentImageElement.width * scale,
          this.currentImageElement.height * scale
        );
      } else {
        const nextImageNode = document.createElement('img');
        nextImageNode.addEventListener('load', () => {
          this.currentImageElement = nextImageNode;
          const { width, height } = nextImageNode;
          const imageNodeRatio = height / width;
          const { width: canvasWidth, height: canvasHeight } = this.props;
          const canvasNodeRatio = canvasHeight / canvasWidth;
          if (!isNaN(imageNodeRatio) && !isNaN(canvasNodeRatio)) {
            /** 初始圖片會先填滿寬度 */
            const scale = canvasWidth / width;
            this.scaleState = {
              originX: 0,
              originY: 0,
              scale,
            };

            // if (imageNodeRatio < canvasNodeRatio) {
            //   const scale = canvasHeight / height;
            //   this.scaleState = {
            //     originX: (canvasWidth - scale * width) / 2,
            //     originY: 0,
            //     scale,
            //   };
            // } else {
            //   const scale = canvasWidth / width;
            //   this.scaleState = {
            //     originX: 0,
            //     originY: (canvasHeight - scale * height) / 2,
            //     scale,
            //   };
            // }

            // cache to initial values
            const {
              scale: initialScale,
              originX: initialX,
              originY: initialY,
            } = this.scaleState;
            this.initialScaleState = { initialScale, initialX, initialY };
          }
          this.onImageChange();
          this.onShapeChange();
        });
        nextImageNode.alt = '';
        nextImageNode.src = this.props.image;
      }
    }
  };

  public onImageMove = (dX: number = 0, dY: number = 0) => {
    this.cleanImage();
    if (this.imageCanvas2D && this.imageCanvasRef.current) {
      if (this.currentImageElement) {
        const { originX, originY, scale } = this.scaleState;
        this.scaleState.originX = this.scaleState.originX + dX;
        this.scaleState.originY = this.scaleState.originY + dY;
        this.imageCanvas2D.drawImage(
          this.currentImageElement,
          originX,
          originY,
          this.currentImageElement.width * scale,
          this.currentImageElement.height * scale
        );

        // this.setState({ imageScale: this.scaleState });
        requestAnimationFrame(this.dragImage);
      }
    }
  };

  private dragImage = () => {
    const { isDraggingTextBox } = this.props;
    // 移動中 框框不會跟著移動：效能提升
    if (isDraggingTextBox) {
      this.onShapeChange();
    } else {
      this.onImageMove();
    }
  };

  private onMouseDown: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const { positionX, positionY } = this.calculateMousePosition(
      offsetX,
      offsetY
    );
    this.currentAnnotationState.onMouseDown(positionX, positionY);
  };

  private onMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const { positionX, positionY } = this.calculateMousePosition(
      offsetX,
      offsetY
    );
    this.currentAnnotationState.onMouseMove(positionX, positionY);
  };

  private onMouseUp: MouseEventHandler<HTMLCanvasElement> = () => {
    this.currentAnnotationState.onMouseUp();
  };

  private onMouseLeave: MouseEventHandler<HTMLCanvasElement> = () => {
    this.currentAnnotationState.onMouseLeave();
  };

  public zoomIn = () => {
    const currentCanvas = this.canvasRef.current;
    // const { scale: prevScale } = this.scaleState;
    if (this.currentImageElement && currentCanvas) {
      // this.scaleState.originX = this.imageCanvasRef.current.width / 2;
      // const offsetX = currentCanvas.width / 2;
      // const offsetY = currentCanvas.height / 2;

      /** 放大程度由圖片大小比例決定 */
      const zoomScale = this.getZoomingScaleByImageDimension(
        this.currentImageElement.width,
        this.currentImageElement.height
      );
      this.scaleState.scale =
        this.scaleState.scale > 10 ? 10 : this.scaleState.scale + zoomScale;

      // const { scale: currentScale, originX, originY } = this.scaleState;
      // this.scaleState.originX =
      //   offsetX - ((offsetX - originX) / prevScale) * currentScale;
      // this.scaleState.originY =
      //   offsetY - ((offsetY - originY) / prevScale) * currentScale;
    }
    this.setState({ imageScale: this.scaleState });

    requestAnimationFrame(() => {
      this.onShapeChange();
      this.onImageChange();
    });
  };

  public zoomOut = () => {
    const currentCanvas = this.canvasRef.current;
    // const { scale: prevScale } = this.scaleState;
    if (this.currentImageElement && currentCanvas) {
      // this.scaleState.originX = this.imageCanvasRef.current.width / 2;
      // const offsetX = currentCanvas.width / 2;
      // const offsetY = currentCanvas.height / 2;

      /** 縮小程度由圖片大小比例決定 */
      const zoomScale = this.getZoomingScaleByImageDimension(
        this.currentImageElement.width,
        this.currentImageElement.height
      );
      this.scaleState.scale =
        this.scaleState.scale < 0.1 ? 0.1 : this.scaleState.scale - zoomScale;

      // const { scale: currentScale, originX, originY } = this.scaleState;

      // this.scaleState.originX =
      //   offsetX - ((offsetX - originX) / prevScale) * currentScale;
      // this.scaleState.originY =
      //   offsetY - ((offsetY - originY) / prevScale) * currentScale;
    }
    this.setState({ imageScale: this.scaleState });

    requestAnimationFrame(() => {
      this.onShapeChange();
      this.onImageChange();
    });
  };

  public zoomReset = () => {
    this.scaleState.scale = this.initialScaleState.initialScale;
    this.scaleState.originX = this.initialScaleState.initialX;
    this.scaleState.originY = this.initialScaleState.initialY;

    this.setState({ imageScale: this.scaleState });
    requestAnimationFrame(() => {
      this.onShapeChange();
      this.onImageChange();
    });
  };

  public getZoomingScaleByImageDimension = (width: number, height: number) => {
    const scale = 1 / Math.round((width + height) / 2 / 100);
    return scale;
  };

  private onWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    // https://stackoverflow.com/a/31133823/9071503
    const { clientHeight, scrollTop, scrollHeight } = event.currentTarget;
    if (clientHeight + scrollTop + event.deltaY > scrollHeight) {
      // event.preventDefault();
      event.currentTarget.scrollTop = scrollHeight;
    } else if (scrollTop + event.deltaY < 0) {
      // event.preventDefault();
      event.currentTarget.scrollTop = 0;
    }

    const { scale: preScale } = this.scaleState;
    const zoomScale = event.deltaY * this.props.scrollSpeed;
    this.scaleState.scale += zoomScale;
    if (this.scaleState.scale > 10) {
      this.scaleState.scale = 10;
    }
    if (this.scaleState.scale < 0.1) {
      this.scaleState.scale = 0.1;
    }

    const { originX, originY, scale } = this.scaleState;
    const { offsetX, offsetY } = event.nativeEvent;
    this.scaleState.originX =
      offsetX - ((offsetX - originX) / preScale) * scale;
    this.scaleState.originY =
      offsetY - ((offsetY - originY) / preScale) * scale;

    this.setState({ imageScale: this.scaleState });

    requestAnimationFrame(() => {
      this.onShapeChange();
      this.onImageChange();
    });
  };
}
