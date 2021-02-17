import { DefaultAnnotationState } from "./DefaultAnnotationState";
var DraggingAnnotationState = /** @class */ (function () {
    function DraggingAnnotationState(context, positionX, positionY) {
        var _this = this;
        this.onMouseDown = function () { return undefined; };
        this.onMouseMove = function (positionX, positionY) {
            document.body.style.cursor = 'move';
            _this.context.onImageMove(positionX - _this.startX, positionY - _this.startY);
        };
        this.onMouseUp = function () {
            var setAnnotationState = _this.context.setAnnotationState;
            document.body.style.cursor = 'default';
            setAnnotationState(new DefaultAnnotationState(_this.context));
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