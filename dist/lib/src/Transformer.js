var Transformer = /** @class */ (function () {
    function Transformer(shape, scale) {
        var _this = this;
        this.checkBoundary = function (positionX, positionY) {
            var currentCenterIndex = _this.getCenterIndexByCursor(positionX, positionY);
            return currentCenterIndex >= 0;
        };
        this.startTransformation = function (positionX, positionY) {
            _this.currentNodeCenterIndex = _this.getCenterIndexByCursor(positionX, positionY);
        };
        this.onTransformation = function (positionX, positionY) {
            var currentCentersTable = _this.getAllCentersTable();
            currentCentersTable[_this.currentNodeCenterIndex].adjust(positionX, positionY);
        };
        this.paint = function (canvas2D, calculateTruePosition, scale) {
            _this.scale = scale;
            var allCentersTable = _this.getAllCentersTable();
            canvas2D.save();
            canvas2D.fillStyle = _this.shape.shapeStyle.transformerBackground;
            for (var _i = 0, allCentersTable_1 = allCentersTable; _i < allCentersTable_1.length; _i++) {
                var item = allCentersTable_1[_i];
                var _a = calculateTruePosition({
                    x: item.x - _this.nodeWidth / 2,
                    y: item.y - _this.nodeWidth / 2,
                    width: _this.nodeWidth,
                    height: _this.nodeWidth,
                }), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                canvas2D.fillRect(x, y, width, height);
            }
            canvas2D.restore();
        };
        this.getCenterIndexByCursor = function (positionX, positionY) {
            var allCentersTable = _this.getAllCentersTable();
            return allCentersTable.findIndex(function (item) {
                return _this.checkEachRectBoundary(item.x, item.y, positionX, positionY);
            });
        };
        this.checkEachRectBoundary = function (rectCenterX, rectCenterY, positionX, positionY) {
            return (Math.abs(positionX - rectCenterX) <= _this.nodeWidth / 2 &&
                Math.abs(positionY - rectCenterY) <= _this.nodeWidth / 2);
        };
        this.getAllCentersTable = function () {
            var shape = _this.shape;
            var _a = shape.getAnnotationData().mark, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            return [
                {
                    x: x,
                    y: y,
                    adjust: function (positionX, positionY) {
                        shape.adjustMark({
                            x: positionX,
                            y: positionY,
                            width: width + x - positionX,
                            height: height + y - positionY,
                        });
                    },
                },
                {
                    x: x + width / 2,
                    y: y,
                    adjust: function (_, positionY) {
                        shape.adjustMark({
                            y: positionY,
                            height: height + y - positionY,
                        });
                    },
                },
                {
                    x: x + width,
                    y: y,
                    adjust: function (positionX, positionY) {
                        shape.adjustMark({
                            x: x,
                            y: positionY,
                            width: positionX - x,
                            height: y + height - positionY,
                        });
                    },
                },
                {
                    x: x,
                    y: y + height / 2,
                    adjust: function (positionX) {
                        shape.adjustMark({
                            x: positionX,
                            width: width + x - positionX,
                        });
                    },
                },
                {
                    x: x + width,
                    y: y + height / 2,
                    adjust: function (positionX) {
                        shape.adjustMark({ width: positionX - x });
                    },
                },
                {
                    x: x,
                    y: y + height,
                    adjust: function (positionX, positionY) {
                        shape.adjustMark({
                            x: positionX,
                            width: width + x - positionX,
                            height: positionY - y,
                        });
                    },
                },
                {
                    x: x + width / 2,
                    y: y + height,
                    adjust: function (_, positionY) {
                        shape.adjustMark({
                            height: positionY - y,
                        });
                    },
                },
                {
                    x: x + width,
                    y: y + height,
                    adjust: function (positionX, positionY) {
                        shape.adjustMark({
                            width: positionX - x,
                            height: positionY - y,
                        });
                    },
                },
            ];
        };
        this.shape = shape;
        this.scale = scale;
    }
    Object.defineProperty(Transformer.prototype, "nodeWidth", {
        get: function () {
            return this.shape.shapeStyle.transformerSize / this.scale;
        },
        enumerable: false,
        configurable: true
    });
    return Transformer;
}());
export default Transformer;
//# sourceMappingURL=Transformer.js.map