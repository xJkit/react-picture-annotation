import { withA11y } from "@storybook/addon-a11y";
import { addDecorator, storiesOf } from "@storybook/react";
import React, { useEffect, useState } from "react";

import {
  DefaultInputSection,
  defaultShapeStyle,
  ReactPictureAnnotation,
} from "../src";
import { IAnnotation } from "../src/Annotation";
import { IShapeData } from "../src/Shape";

addDecorator((storyFn) => <div>{storyFn()}</div>);

const fakedata = {
  imageId: 62,
  labels: [
    {
      id: 326,
      startX: 18,
      startY: 50,
      width: 90,
      height: 24,
      labelText: "SimpleLife"
    },
    {
      id: 327,
      startX: 19,
      startY: 71,
      width: 88,
      height: 20,
      labelText: "ORIGINAL"
    },
    {
      id: 328,
      startX: 78,
      startY: 460,
      width: 34,
      height: 30,
      labelText: "內"
    },
    {
      id: 329,
      startX: 29,
      startY: 475,
      width: 46,
      height: 10,
      labelText: "Lets"
    },
    {
      id: 330,
      startX: 72,
      startY: 489,
      width: 42,
      height: 24,
      labelText: "0`]"
    },
    {
      id: 331,
      startX: 111,
      startY: 497,
      width: 336,
      height: 68,
      labelText: "華山1/21213;"
    },
    {
      id: 332,
      startX: 62,
      startY: 528,
      width: 52,
      height: 32,
      labelText: "台北"
    },
    {
      id: 333,
      startX: 30,
      startY: 553,
      width: 417,
      height: 74,
      labelText: "2020簡單生活節"
    }
  ]
};

const origFake = [
{
  id: "a",
  comment: "HA HA HA",
  mark: {
    type: "RECT",
    width: 161,
    height: 165,
    x: 229,
    y: 92,
  },
},
{
  id: "b",
  comment: "GG",
  mark: {
    type: "RECT",
    width: 161,
    height: 165,
    x: 100,
    y: 92,
  },
},
{
  id: "c",
  comment: "XDDDDDDD",
  mark: {
    type: "RECT",
    width: 161,
    height: 165,
    x:20,
    y: 92,
  },
},
]

storiesOf("Hello World", module)
  .addDecorator(withA11y)
  .add("with text", () => {
    const AnnotationComponent = () => {
      const [size, setSize] = useState({
        width: window.innerWidth - 16,
        height: window.innerHeight - 16,
      });

      const [annotationData, setAnnotationData] = useState(fakedata.labels.map((d, idx) => {
          const {id, labelText: comment, ...restProps} = d;
          const { startX: x, startY: y, ...otherProps } = restProps;
          return {
            idx: idx + 1,
            id, comment, mark: {
              type: 'RECT',
              x, y,
              ...otherProps,
            }
          }
        }));

      const [selectedId, setSelectedId] = useState<string | null>("a");

      const onResize = () => {
        setSize({
          width: window.innerWidth - 16,
          height: window.innerHeight - 16,
        });
      };

      useEffect(() => {
        window.addEventListener("resize", onResize);
        return () => {
          window.removeEventListener("resize", onResize);
        };
      }, []);

      console.log('annotationData: ', annotationData)

      return (
        <ReactPictureAnnotation
          width={size.width}
          height={size.height}
          annotationData={annotationData}
          onChange={setAnnotationData}
          selectedId={selectedId}
          onSelect={(e) => setSelectedId(e)}
          annotationStyle={{
            ...defaultShapeStyle,
            shapeStrokeStyle: "#2193ff",
            transformerBackground: "black",
          }}
          image="https://bequank.oss-cn-beijing.aliyuncs.com/landpage/large/60682895_p0_master1200.jpg"
          inputElement={(value, onChange, onDelete) => (
            <DefaultInputSection
              placeholder={"Hello world"}
              {...{ value, onChange, onDelete }}
            />
          )}
        />
      );
    };

    return <AnnotationComponent />;
  });
