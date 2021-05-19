import { DefaultAnnotationState } from "./DefaultAnnotationState";
var DraggingAnnotationState = /** @class */ (function () {
    function DraggingAnnotationState(context, positionX, positionY) {
        var _this = this;
        this.onMouseDown = function () { return undefined; };
        this.onMouseMove = function (positionX, positionY) {
            document.body.style.cursor = 'move';
            var scale = _this.context.scaleState.scale;
            var dX = (positionX - _this.startX) * scale;
            var dY = (positionY - _this.startY) * scale;
            _this.context.onImageMove(dX, dY);
        };
        this.onMouseUp = function () {
            var _a = _this.context, setAnnotationState = _a.setAnnotationState, onShapeChange = _a.onShapeChange;
            document.body.style.cursor = 'default';
            setAnnotationState(new DefaultAnnotationState(_this.context));
            onShapeChange();
        };
        this.onMouseLeave = function () { return _this.onMouseUp(); };
        this.context = context;
        this.startX = positionX;
        this.startY = positionY;
    }
    return DraggingAnnotationState;
}());
export default DraggingAnnotationState;
//# sourceMappingURL=MoveCanvasState.js.map