export var defaultShapeStyle = {
    padding: 5,
    lineWidth: 2,
    shadowBlur: 10,
    fontSize: 12,
    fontColor: "#212529",
    fontBackground: "#f8f9fa",
    secondaryFontColor: "#212529",
    secondaryFontBackground: "#f8f9fa",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    shapeBackground: "hsla(210, 16%, 93%, 0.2)",
    shapeStrokeStyle: "#f8f9fa",
    shapeShadowStyle: "hsla(210, 9%, 31%, 0.35)",
    transformerBackground: "#5c7cfa",
    transformerSize: 10,
};
var RectShape = /** @class */ (function () {
    function RectShape(data, onChange, shapeStyle) {
        var _this = this;
        if (shapeStyle === void 0) { shapeStyle = defaultShapeStyle; }
        this.onDragStart = function (positionX, positionY) {
            var _a = _this.annotationData.mark, x = _a.x, y = _a.y;
            _this.dragStartOffset = {
                offsetX: positionX - x,
                offsetY: positionY - y,
            };
        };
        this.onDrag = function (positionX, positionY) {
            _this.annotationData.mark.x = positionX - _this.dragStartOffset.offsetX;
            _this.annotationData.mark.y = positionY - _this.dragStartOffset.offsetY;
            _this.onChangeCallBack();
        };
        this.checkBoundary = function (positionX, positionY) {
            var _a = _this.annotationData.mark, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            return (((positionX > x && positionX < x + width) ||
                (positionX < x && positionX > x + width)) &&
                ((positionY > y && positionY < y + height) ||
                    (positionY < y && positionY > y + height)));
        };
        this.paint = function (canvas2D, calculateTruePosition, selected) {
            var _a = calculateTruePosition(_this.annotationData.mark), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            canvas2D.save();
            var _b = _this.shapeStyle, padding = _b.padding, lineWidth = _b.lineWidth, shadowBlur = _b.shadowBlur, fontSize = _b.fontSize, fontColor = _b.fontColor, fontBackground = _b.fontBackground, secondaryFontColor = _b.secondaryFontColor, secondaryFontBackground = _b.secondaryFontBackground, fontFamily = _b.fontFamily, shapeBackground = _b.shapeBackground, shapeStrokeStyle = _b.shapeStrokeStyle, shapeShadowStyle = _b.shapeShadowStyle;
            canvas2D.shadowBlur = shadowBlur;
            canvas2D.shadowColor = shapeShadowStyle;
            canvas2D.strokeStyle = shapeStrokeStyle;
            canvas2D.lineWidth = lineWidth;
            canvas2D.strokeRect(x, y, width, height);
            canvas2D.restore();
            if (selected) {
                canvas2D.fillStyle = shapeBackground;
                canvas2D.fillRect(x, y, width, height);
            }
            else {
                var _c = _this.annotationData, comment = _c.comment, order = _c.order;
                var orderText = typeof order === "number" ? order.toString() : "";
                var labelText = orderText || comment;
                if (labelText) {
                    canvas2D.font = fontSize + "px " + fontFamily;
                    var metrics = canvas2D.measureText(labelText);
                    canvas2D.save();
                    canvas2D.fillStyle = orderText
                        ? fontBackground
                        : secondaryFontBackground;
                    canvas2D.fillRect(x, y, metrics.width + padding * 2, fontSize + padding * 2);
                    canvas2D.textBaseline = "top";
                    canvas2D.fillStyle = orderText ? fontColor : secondaryFontColor;
                    canvas2D.fillText(labelText, x + padding, y + padding);
                }
            }
            canvas2D.restore();
            return { x: x, y: y, width: width, height: height };
        };
        this.adjustMark = function (_a) {
            var _b = _a.x, x = _b === void 0 ? _this.annotationData.mark.x : _b, _c = _a.y, y = _c === void 0 ? _this.annotationData.mark.y : _c, _d = _a.width, width = _d === void 0 ? _this.annotationData.mark.width : _d, _e = _a.height, height = _e === void 0 ? _this.annotationData.mark.height : _e;
            _this.annotationData.mark.x = x;
            _this.annotationData.mark.y = y;
            _this.annotationData.mark.width = width;
            _this.annotationData.mark.height = height;
            _this.onChangeCallBack();
        };
        this.getAnnotationData = function () {
            return _this.annotationData;
        };
        this.setComment = function (comment) {
            _this.annotationData.comment = comment;
        };
        this.equal = function (data) {
            return (data.id === _this.annotationData.id &&
                data.comment === _this.annotationData.comment &&
                data.mark.x === _this.annotationData.mark.x &&
                data.mark.y === _this.annotationData.mark.y &&
                data.mark.width === _this.annotationData.mark.width &&
                data.mark.height === _this.annotationData.mark.height);
        };
        this.annotationData = data;
        this.onChangeCallBack = onChange;
        this.shapeStyle = shapeStyle;
    }
    return RectShape;
}());
export { RectShape };
//# sourceMappingURL=Shape.js.map