import { RectShape } from "../Shape";
import Transformer from "../Transformer";
import randomId from "../utils/randomId";
import CreatingAnnotationState from "./CreatingAnnotationState";
import DraggingAnnotationState from "./DraggingAnnotationState";
import TransformationState from "./TransfromationState";
var DefaultAnnotationState = /** @class */ (function () {
    function DefaultAnnotationState(context) {
        var _this = this;
        this.onMouseMove = function () { return undefined; };
        this.onMouseUp = function () { return undefined; };
        this.onMouseLeave = function () { return undefined; };
        this.onMouseDown = function (positionX, positionY) {
            var _a = _this.context, shapes = _a.shapes, currentTransformer = _a.currentTransformer, onShapeChange = _a.onShapeChange, setState = _a.setAnnotationState;
            if (currentTransformer &&
                currentTransformer.checkBoundary(positionX, positionY)) {
                currentTransformer.startTransformation(positionX, positionY);
                setState(new TransformationState(_this.context));
                return;
            }
            for (var i = shapes.length - 1; i >= 0; i--) {
                if (shapes[i].checkBoundary(positionX, positionY)) {
                    _this.context.selectedId = shapes[i].getAnnotationData().id;
                    _this.context.currentTransformer = new Transformer(shapes[i], _this.context.scaleState.scale);
                    var selectedShape = shapes.splice(i, 1)[0];
                    shapes.push(selectedShape);
                    selectedShape.onDragStart(positionX, positionY);
                    onShapeChange();
                    setState(new DraggingAnnotationState(_this.context));
                    return;
                }
            }
            _this.context.shapes.push(new RectShape({
                id: randomId(),
                mark: {
                    x: positionX,
                    y: positionY,
                    width: 0,
                    height: 0,
                    type: "RECT",
                },
            }, onShapeChange, _this.context.annotationStyle));
            setState(new CreatingAnnotationState(_this.context));
        };
        this.context = context;
    }
    return DefaultAnnotationState;
}());
export { DefaultAnnotationState };
//# sourceMappingURL=DefaultAnnotationState.js.map