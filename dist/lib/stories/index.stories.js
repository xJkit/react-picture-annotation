var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { withA11y } from '@storybook/addon-a11y';
import { addDecorator, storiesOf } from '@storybook/react';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { DefaultInputSection, defaultShapeStyle, ReactPictureAnnotation, } from '../src';
import { ToolState } from '../src/Annotation';
addDecorator(function (storyFn) { return React.createElement("div", null, storyFn()); });
storiesOf('Hello World', module)
    .addDecorator(withA11y)
    .add('with text', function () {
    var AnnotationComponent = function () {
        var _a = useState({
            width: window.innerWidth - 16,
            height: window.innerHeight - 16,
        }), size = _a[0], setSize = _a[1];
        var _b = useState([
            {
                id: 'a',
                comment: 'HA HA HA',
                mark: {
                    type: 'RECT',
                    width: 161,
                    height: 165,
                    x: 229,
                    y: 92,
                },
            },
        ]), annotationData = _b[0], setAnnotationData = _b[1];
        var componentRef = useRef(null);
        var _c = useState('a'), selectedId = _c[0], setSelectedId = _c[1];
        var _d = useState('normal'), toolState = _d[0], setToolState = _d[1];
        var onResize = function () {
            setSize({
                width: window.innerWidth - 16,
                height: window.innerHeight - 16,
            });
        };
        var onChangeToolState = useCallback(function (e) { return setToolState(e.target.name); }, [setToolState]);
        var onZoomIn = useCallback(function () {
            if (componentRef.current) {
                componentRef.current.zoomIn();
            }
        }, [componentRef]);
        var onZoomOut = useCallback(function () {
            if (componentRef.current) {
                componentRef.current.zoomOut();
            }
        }, [componentRef]);
        var onZoomReset = useCallback(function () {
            if (componentRef.current) {
                componentRef.current.zoomReset();
            }
        }, [componentRef]);
        useEffect(function () {
            window.addEventListener('resize', onResize);
            return function () {
                window.removeEventListener('resize', onResize);
            };
        }, []);
        return (React.createElement(React.Fragment, null,
            React.createElement("label", { style: { marginRight: 16 } },
                React.createElement("input", { type: "radio", name: ToolState.Normal, checked: toolState === ToolState.Normal, onChange: onChangeToolState }),
                React.createElement("span", null, "Normal")),
            React.createElement("label", null,
                React.createElement("input", { type: "radio", name: ToolState.Drag, checked: toolState === ToolState.Drag, onChange: onChangeToolState }),
                React.createElement("span", null, "Drag")),
            React.createElement("button", { onClick: onZoomIn }, "zoom in"),
            React.createElement("button", { onClick: onZoomOut }, "zoom out"),
            React.createElement("button", { onClick: onZoomReset }, "reset zoom"),
            React.createElement(ReactPictureAnnotation, { ref: componentRef, width: size.width, height: size.height, toolState: toolState, annotationData: annotationData, onChange: function (data) { return setAnnotationData(data); }, selectedId: selectedId, onSelect: function (e) { return setSelectedId(e); }, annotationStyle: __assign(__assign({}, defaultShapeStyle), { shapeStrokeStyle: '#2193ff', transformerBackground: 'black' }), image: "https://bequank.oss-cn-beijing.aliyuncs.com/landpage/large/60682895_p0_master1200.jpg", inputElement: function (value, onChange, onDelete) { return (React.createElement(DefaultInputSection, __assign({ placeholder: 'Hello world' }, { value: value, onChange: onChange, onDelete: onDelete }))); } })));
    };
    return React.createElement(AnnotationComponent, null);
});
//# sourceMappingURL=index.stories.js.map