import { DefaultAnnotationState } from "./DefaultAnnotationState";
var TransformationState = /** @class */ (function () {
    function TransformationState(context) {
        var _this = this;
        this.onMouseDown = function () { return undefined; };
        this.onMouseMove = function (positionX, positionY) {
            var currentTransformer = _this.context.currentTransformer;
            if (currentTransformer) {
                currentTransformer.onTransformation(positionX, positionY);
            }
        };
        this.onMouseUp = function () {
            var setAnnotationState = _this.context.setAnnotationState;
            setAnnotationState(new DefaultAnnotationState(_this.context));
        };
        this.onMouseLeave = function () { return _this.onMouseUp(); };
        this.context = context;
    }
    return TransformationState;
}());
export default TransformationState;
//# sourceMappingURL=TransfromationState.js.map