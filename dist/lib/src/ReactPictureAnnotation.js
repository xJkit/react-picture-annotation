var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from 'react';
import { ToolState } from './Annotation';
import { DefaultAnnotationState } from './annotation/DefaultAnnotationState';
import DefaultInputSection from './DefaultInputSection';
// import DeleteButton from "./DeleteButton";
import { defaultShapeStyle, RectShape, } from './Shape';
import Transformer from './Transformer';
var defaultState = {
    scale: 1,
    originX: 0,
    originY: 0,
};
var initialScaleState = {
    initialScale: 1,
    initialX: 0,
    initialY: 0,
};
var ReactPictureAnnotation = /** @class */ (function (_super) {
    __extends(ReactPictureAnnotation, _super);
    function ReactPictureAnnotation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            inputPosition: {
                left: 0,
                top: 0,
            },
            showInput: false,
            inputComment: '',
        };
        _this.shapes = [];
        _this.scaleState = defaultState;
        _this.initialScaleState = initialScaleState;
        _this.currentAnnotationData = [];
        _this.canvasRef = React.createRef();
        _this.imageCanvasRef = React.createRef();
        _this.currentAnnotationState = new DefaultAnnotationState(_this);
        _this.componentDidMount = function () {
            var currentCanvas = _this.canvasRef.current;
            var currentImageCanvas = _this.imageCanvasRef.current;
            if (currentCanvas && currentImageCanvas) {
                _this.setCanvasDPI();
                _this.canvas2D = currentCanvas.getContext('2d');
                _this.imageCanvas2D = currentImageCanvas.getContext('2d');
                _this.onImageChange();
            }
            _this.syncAnnotationData();
            _this.syncSelectedId();
        };
        _this.componentDidUpdate = function (preProps) {
            var _a = _this.props, width = _a.width, height = _a.height, image = _a.image;
            if (preProps.width !== width || preProps.height !== height) {
                _this.setCanvasDPI();
                _this.onShapeChange();
                _this.onImageChange();
            }
            if (preProps.image !== image) {
                _this.cleanImage();
                if (_this.currentImageElement) {
                    _this.currentImageElement.src = image;
                }
                else {
                    _this.onImageChange();
                }
            }
            _this.syncAnnotationData();
            _this.syncSelectedId();
        };
        _this.calculateMousePosition = function (positionX, positionY) {
            var _a = _this.scaleState, originX = _a.originX, originY = _a.originY, scale = _a.scale;
            return {
                positionX: (positionX - originX) / scale,
                positionY: (positionY - originY) / scale,
            };
        };
        _this.calculateShapePosition = function (shapeData) {
            var _a = _this.scaleState, originX = _a.originX, originY = _a.originY, scale = _a.scale;
            var x = shapeData.x, y = shapeData.y, width = shapeData.width, height = shapeData.height;
            return {
                x: x * scale + originX,
                y: y * scale + originY,
                width: width * scale,
                height: height * scale,
            };
        };
        _this.setAnnotationState = function (annotationState) {
            _this.currentAnnotationState = annotationState;
        };
        _this.onShapeChange = function () {
            // 新增框框
            if (_this.canvas2D && _this.canvasRef.current) {
                _this.canvas2D.clearRect(0, 0, _this.canvasRef.current.width, _this.canvasRef.current.height);
                var hasSelectedItem = false;
                for (var _i = 0, _a = _this.shapes; _i < _a.length; _i++) {
                    var item = _a[_i];
                    var isSelected = item.getAnnotationData().id === _this.selectedId;
                    var _b = item.paint(_this.canvas2D, _this.calculateShapePosition, isSelected), x = _b.x, y = _b.y, height = _b.height;
                    if (isSelected) {
                        if (!_this.currentTransformer) {
                            _this.currentTransformer = new Transformer(item, _this.scaleState.scale);
                        }
                        hasSelectedItem = true;
                        _this.currentTransformer.paint(_this.canvas2D, _this.calculateShapePosition, _this.scaleState.scale);
                        _this.setState({
                            showInput: true,
                            inputPosition: {
                                left: x,
                                top: y + height + _this.props.marginWithInput,
                            },
                            inputComment: item.getAnnotationData().comment || '',
                        });
                    }
                }
                if (!hasSelectedItem) {
                    _this.setState({
                        showInput: false,
                        inputComment: '',
                    });
                }
            }
            _this.currentAnnotationData = _this.shapes.map(function (item) {
                return item.getAnnotationData();
            });
            var onChange = _this.props.onChange;
            onChange(_this.currentAnnotationData);
        };
        _this.syncAnnotationData = function () {
            var annotationData = _this.props.annotationData;
            if (annotationData) {
                var refreshShapesWithAnnotationData = function () {
                    _this.selectedId = null;
                    _this.shapes = annotationData.map(function (eachAnnotationData) {
                        return new RectShape(eachAnnotationData, _this.onShapeChange, _this.annotationStyle);
                    });
                    _this.onShapeChange();
                };
                if (annotationData.length !== _this.shapes.length) {
                    refreshShapesWithAnnotationData();
                }
                else {
                    var _loop_1 = function (annotationDataItem) {
                        var targetShape = _this.shapes.find(function (item) { return item.getAnnotationData().id === annotationDataItem.id; });
                        if (targetShape && targetShape.equal(annotationDataItem)) {
                            return "continue";
                        }
                        else {
                            refreshShapesWithAnnotationData();
                            return "break";
                        }
                    };
                    for (var _i = 0, annotationData_1 = annotationData; _i < annotationData_1.length; _i++) {
                        var annotationDataItem = annotationData_1[_i];
                        var state_1 = _loop_1(annotationDataItem);
                        if (state_1 === "break")
                            break;
                    }
                }
            }
        };
        _this.syncSelectedId = function () {
            var selectedId = _this.props.selectedId;
            if (selectedId && selectedId !== _this.selectedId) {
                _this.selectedId = selectedId;
                _this.onShapeChange();
            }
        };
        _this.onDelete = function () {
            var deleteTarget = _this.shapes.findIndex(function (shape) { return shape.getAnnotationData().id === _this.selectedId; });
            if (deleteTarget >= 0) {
                _this.shapes.splice(deleteTarget, 1);
                _this.onShapeChange();
            }
        };
        _this.setCanvasDPI = function () {
            var currentCanvas = _this.canvasRef.current;
            var currentImageCanvas = _this.imageCanvasRef.current;
            if (currentCanvas && currentImageCanvas) {
                var currentCanvas2D = currentCanvas.getContext('2d');
                var currentImageCanvas2D = currentImageCanvas.getContext('2d');
                if (currentCanvas2D && currentImageCanvas2D) {
                    currentCanvas2D.scale(2, 2);
                    currentImageCanvas2D.scale(2, 2);
                }
            }
        };
        _this.onInputCommentChange = function (comment) {
            var selectedShapeIndex = _this.shapes.findIndex(function (item) { return item.getAnnotationData().id === _this.selectedId; });
            _this.shapes[selectedShapeIndex].setComment(comment);
            _this.setState({ inputComment: comment });
        };
        _this.cleanImage = function () {
            if (_this.imageCanvas2D && _this.imageCanvasRef.current) {
                _this.imageCanvas2D.clearRect(0, 0, _this.imageCanvasRef.current.width, _this.imageCanvasRef.current.height);
            }
        };
        _this.onImageChange = function () {
            _this.cleanImage();
            if (_this.imageCanvas2D && _this.imageCanvasRef.current) {
                if (_this.currentImageElement) {
                    var _a = _this.scaleState, originX = _a.originX, originY = _a.originY, scale = _a.scale;
                    _this.imageCanvas2D.drawImage(_this.currentImageElement, originX, originY, _this.currentImageElement.width * scale, _this.currentImageElement.height * scale);
                }
                else {
                    var nextImageNode_1 = document.createElement('img');
                    nextImageNode_1.addEventListener('load', function () {
                        _this.currentImageElement = nextImageNode_1;
                        var width = nextImageNode_1.width, height = nextImageNode_1.height;
                        var imageNodeRatio = height / width;
                        var _a = _this.props, canvasWidth = _a.width, canvasHeight = _a.height;
                        var canvasNodeRatio = canvasHeight / canvasWidth;
                        if (!isNaN(imageNodeRatio) && !isNaN(canvasNodeRatio)) {
                            if (imageNodeRatio < canvasNodeRatio) {
                                var scale = canvasHeight / height;
                                _this.scaleState = {
                                    originX: (canvasWidth - scale * width) / 2,
                                    originY: 0,
                                    scale: scale,
                                };
                            }
                            else {
                                var scale = canvasWidth / width;
                                _this.scaleState = {
                                    originX: 0,
                                    originY: (canvasHeight - scale * height) / 2,
                                    scale: scale,
                                };
                            }
                            // cache to initial values
                            var _b = _this.scaleState, initialScale = _b.scale, initialX = _b.originX, initialY = _b.originY;
                            _this.initialScaleState = { initialScale: initialScale, initialX: initialX, initialY: initialY };
                        }
                        _this.onImageChange();
                        _this.onShapeChange();
                    });
                    nextImageNode_1.alt = '';
                    nextImageNode_1.src = _this.props.image;
                }
            }
        };
        _this.onImageMove = function (dX, dY) {
            if (dX === void 0) { dX = 0; }
            if (dY === void 0) { dY = 0; }
            _this.cleanImage();
            if (_this.imageCanvas2D && _this.imageCanvasRef.current) {
                if (_this.currentImageElement) {
                    var _a = _this.scaleState, originX = _a.originX, originY = _a.originY, scale = _a.scale;
                    _this.scaleState.originX = _this.scaleState.originX + dX;
                    _this.scaleState.originY = _this.scaleState.originY + dY;
                    _this.imageCanvas2D.drawImage(_this.currentImageElement, originX, originY, _this.currentImageElement.width * scale, _this.currentImageElement.height * scale);
                    // this.setState({ imageScale: this.scaleState });
                    requestAnimationFrame(_this.dragImage);
                }
            }
        };
        _this.dragImage = function () {
            var isDraggingTextBox = _this.props.isDraggingTextBox;
            // 移動中 框框不會跟著移動：效能提升
            if (isDraggingTextBox) {
                _this.onShapeChange();
            }
            else {
                _this.onImageMove();
            }
        };
        _this.onMouseDown = function (event) {
            var _a = event.nativeEvent, offsetX = _a.offsetX, offsetY = _a.offsetY;
            var _b = _this.calculateMousePosition(offsetX, offsetY), positionX = _b.positionX, positionY = _b.positionY;
            _this.currentAnnotationState.onMouseDown(positionX, positionY);
        };
        _this.onMouseMove = function (event) {
            var _a = event.nativeEvent, offsetX = _a.offsetX, offsetY = _a.offsetY;
            var _b = _this.calculateMousePosition(offsetX, offsetY), positionX = _b.positionX, positionY = _b.positionY;
            _this.currentAnnotationState.onMouseMove(positionX, positionY);
        };
        _this.onMouseUp = function () {
            _this.currentAnnotationState.onMouseUp();
        };
        _this.onMouseLeave = function () {
            _this.currentAnnotationState.onMouseLeave();
        };
        _this.zoomIn = function () {
            var prevScale = _this.scaleState.scale;
            if (_this.currentImageElement) {
                // this.scaleState.originX = this.imageCanvasRef.current.width / 2;
                var offsetX = _this.currentImageElement.width / 2;
                var offsetY = _this.currentImageElement.height / 2;
                /** 放大程度由圖片大小比例決定 */
                var zoomScale = _this.getZoomingScaleByImageDimension(_this.currentImageElement.width, _this.currentImageElement.height);
                _this.scaleState.scale =
                    _this.scaleState.scale > 10 ? 10 : _this.scaleState.scale + zoomScale;
                var _a = _this.scaleState, currentScale = _a.scale, originX = _a.originX, originY = _a.originY;
                _this.scaleState.originX =
                    offsetX - ((offsetX - originX) / prevScale) * currentScale;
                _this.scaleState.originY =
                    offsetY - ((offsetY - originY) / prevScale) * currentScale;
            }
            _this.setState({ imageScale: _this.scaleState });
            requestAnimationFrame(function () {
                _this.onShapeChange();
                _this.onImageChange();
            });
        };
        _this.zoomOut = function () {
            var prevScale = _this.scaleState.scale;
            if (_this.currentImageElement) {
                // this.scaleState.originX = this.imageCanvasRef.current.width / 2;
                var offsetX = _this.currentImageElement.width / 2;
                var offsetY = _this.currentImageElement.height / 2;
                /** 縮小程度由圖片大小比例決定 */
                var zoomScale = _this.getZoomingScaleByImageDimension(_this.currentImageElement.width, _this.currentImageElement.height);
                _this.scaleState.scale =
                    _this.scaleState.scale < 0.1 ? 0.1 : _this.scaleState.scale - zoomScale;
                var _a = _this.scaleState, currentScale = _a.scale, originX = _a.originX, originY = _a.originY;
                _this.scaleState.originX =
                    offsetX - ((offsetX - originX) / prevScale) * currentScale;
                _this.scaleState.originY =
                    offsetY - ((offsetY - originY) / prevScale) * currentScale;
            }
            _this.setState({ imageScale: _this.scaleState });
            requestAnimationFrame(function () {
                _this.onShapeChange();
                _this.onImageChange();
            });
        };
        _this.zoomReset = function () {
            _this.scaleState.scale = _this.initialScaleState.initialScale;
            _this.scaleState.originX = _this.initialScaleState.initialX;
            _this.scaleState.originY = _this.initialScaleState.initialY;
            _this.setState({ imageScale: _this.scaleState });
            requestAnimationFrame(function () {
                _this.onShapeChange();
                _this.onImageChange();
            });
        };
        _this.getZoomingScaleByImageDimension = function (width, height) {
            var scale = 1 / Math.round((width + height) / 2 / 100);
            return scale;
        };
        _this.onWheel = function (event) {
            // https://stackoverflow.com/a/31133823/9071503
            var _a = event.currentTarget, clientHeight = _a.clientHeight, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight;
            if (clientHeight + scrollTop + event.deltaY > scrollHeight) {
                // event.preventDefault();
                event.currentTarget.scrollTop = scrollHeight;
            }
            else if (scrollTop + event.deltaY < 0) {
                // event.preventDefault();
                event.currentTarget.scrollTop = 0;
            }
            var preScale = _this.scaleState.scale;
            var zoomScale = event.deltaY * _this.props.scrollSpeed;
            _this.scaleState.scale += zoomScale;
            if (_this.scaleState.scale > 10) {
                _this.scaleState.scale = 10;
            }
            if (_this.scaleState.scale < 0.1) {
                _this.scaleState.scale = 0.1;
            }
            var _b = _this.scaleState, originX = _b.originX, originY = _b.originY, scale = _b.scale;
            var _c = event.nativeEvent, offsetX = _c.offsetX, offsetY = _c.offsetY;
            _this.scaleState.originX =
                offsetX - ((offsetX - originX) / preScale) * scale;
            _this.scaleState.originY =
                offsetY - ((offsetY - originY) / preScale) * scale;
            _this.setState({ imageScale: _this.scaleState });
            requestAnimationFrame(function () {
                _this.onShapeChange();
                _this.onImageChange();
            });
        };
        return _this;
    }
    Object.defineProperty(ReactPictureAnnotation.prototype, "selectedId", {
        get: function () {
            return this.selectedIdTrueValue;
        },
        set: function (value) {
            var onSelect = this.props.onSelect;
            this.selectedIdTrueValue = value;
            onSelect(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReactPictureAnnotation.prototype, "annotationStyle", {
        get: function () {
            return this.props.annotationStyle;
        },
        enumerable: false,
        configurable: true
    });
    ReactPictureAnnotation.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, inputElement = _a.inputElement;
        var _b = this.state, showInput = _b.showInput, inputPosition = _b.inputPosition, inputComment = _b.inputComment;
        return (React.createElement("div", { className: "rp-stage" },
            React.createElement("canvas", { style: { width: width, height: height }, className: "rp-image", ref: this.imageCanvasRef, width: width * 2, height: height * 2 }),
            React.createElement("canvas", { className: "rp-shapes", style: { width: width, height: height }, ref: this.canvasRef, width: width * 2, height: height * 2, onMouseDown: this.onMouseDown, onMouseMove: this.onMouseMove, onMouseUp: this.onMouseUp, onMouseLeave: this.onMouseLeave, onWheel: this.onWheel }),
            showInput && (React.createElement("div", { className: "rp-selected-input", style: inputPosition }, inputElement(inputComment, this.onInputCommentChange, this.onDelete)))));
    };
    ReactPictureAnnotation.defaultProps = {
        marginWithInput: 10,
        scrollSpeed: 0.0005,
        toolState: ToolState.Normal,
        isDraggingTextBox: true,
        annotationStyle: defaultShapeStyle,
        inputElement: function (value, onChange, onDelete) { return (React.createElement(DefaultInputSection, { value: value, onChange: onChange, onDelete: onDelete })); },
    };
    return ReactPictureAnnotation;
}(React.Component));
export default ReactPictureAnnotation;
//# sourceMappingURL=ReactPictureAnnotation.js.map