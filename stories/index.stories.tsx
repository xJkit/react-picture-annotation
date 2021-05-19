import { withA11y } from '@storybook/addon-a11y';
import { addDecorator, storiesOf } from '@storybook/react';
import React, { useEffect, useState, useCallback, useRef } from 'react';

import {
  DefaultInputSection,
  defaultShapeStyle,
  ReactPictureAnnotation,
} from '../src';
import { IAnnotation, ToolState } from '../src/Annotation';
import { IShapeData } from '../src/Shape';

addDecorator((storyFn) => <div>{storyFn()}</div>);

storiesOf('Hello World', module)
  .addDecorator(withA11y)
  .add('with text', () => {
    const AnnotationComponent = () => {
      const [size, setSize] = useState({
        width: window.innerWidth - 16,
        height: window.innerHeight - 16,
      });

      const [annotationData, setAnnotationData] = useState<
        IAnnotation<IShapeData>[]
      >([
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
      ]);

      const componentRef = useRef<ReactPictureAnnotation>(null);
      const [selectedId, setSelectedId] = useState<string | null>('a');
      const [toolState, setToolState] = useState('normal');
      const [isDragTextBox, setIsDragTextBox] = useState('1');

      const onResize = () => {
        setSize({
          width: window.innerWidth - 16,
          height: window.innerHeight - 16,
        });
      };

      const onChangeToolState = useCallback(
        (e) => setToolState(e.target.name),
        [setToolState]
      );

      const onZoomIn = useCallback(() => {
        if (componentRef.current) {
          componentRef.current.zoomIn();
        }
      }, [componentRef]);

      const onZoomOut = useCallback(() => {
        if (componentRef.current) {
          componentRef.current.zoomOut();
        }
      }, [componentRef]);

      const onZoomReset = useCallback(() => {
        if (componentRef.current) {
          componentRef.current.zoomReset();
        }
      }, [componentRef]);

      useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => {
          window.removeEventListener('resize', onResize);
        };
      }, []);

      return (
        <>
          <label style={{ marginRight: 16 }}>
            <input
              type="radio"
              name={ToolState.Normal}
              checked={toolState === ToolState.Normal}
              onChange={onChangeToolState}
            />
            <span>Normal</span>
          </label>
          <label style={{ marginRight: 16 }}>
            <input
              type="radio"
              name={ToolState.Drag}
              checked={toolState === ToolState.Drag}
              onChange={onChangeToolState}
            />
            <span>Drag</span>
          </label>
          <div style={{ display: 'inline-block', marginRight: 24 }}>
            <button onClick={onZoomIn}>zoom in</button>
            <button onClick={onZoomOut}>zoom out</button>
            <button onClick={onZoomReset}>reset zoom</button>
          </div>
          <div style={{ display: 'inline-block' }}>
            <span>Should Drag With Text Box? </span>
            <select
              value={isDragTextBox}
              onChange={(e) => setIsDragTextBox(e.target.value)}
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          <ReactPictureAnnotation
            ref={componentRef}
            width={size.width}
            height={size.height}
            toolState={toolState}
            isDraggingTextBox={!!parseInt(isDragTextBox, 10)}
            annotationData={annotationData}
            onChange={(data) => setAnnotationData(data)}
            selectedId={selectedId}
            onSelect={(e) => setSelectedId(e)}
            annotationStyle={{
              ...defaultShapeStyle,
              shapeStrokeStyle: '#2193ff',
              transformerBackground: 'black',
            }}
            image="https://source.unsplash.com/random/2000x600"
            inputElement={(value, onChange, onDelete) => (
              <DefaultInputSection
                placeholder={'Hello world'}
                {...{ value, onChange, onDelete }}
              />
            )}
          />
        </>
      );
    };

    return <AnnotationComponent />;
  });
