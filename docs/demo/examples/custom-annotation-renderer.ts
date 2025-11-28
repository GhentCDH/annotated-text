import {
  AnnotationRender,
  AnnotationRenderParams,
  clearAnnotatedTextCache,
  createAnnotatedText,
  createTextAnnotationRender,
  DefaultUnderlineAnnotationRenderStyle,
  getColorsUnderline,
  GutterAnnotationRender,
  HighlightAnnotationRender,
  TextAnnotation,
  UnderLineAnnotationRender,
} from "@ghentcdh/annotated-text";
import { annotationColors } from "../data/const";
import { DemoAnnotation, DemoAnnotationConfig } from "../data/data.types";
import {
  createAnnotationFill,
  createAnnotationPathFn,
  PathParams,
} from "../../../libs/core/src/lib/compute/utils/create-path";

const annotations = [
  {
    start: 11,
    end: 20,
    color: annotationColors["2"],
    target: "underline",
    label: "gts",
    id: "1",
  },
  {
    start: 42,
    end: 51,
    color: annotationColors["3"],
    target: "highlight",
    label: "gts",
    id: "2",
  },
  {
    start: 63,
    end: 90,
    color: annotationColors["7"],
    target: "gutter",
    label: "gts",
    id: "3",
  },
] as DemoAnnotation[];

const text = `This is an underline annotation
this is a highlight annotation
this is a gutter annotation`;

const createUnderlineWithCaps: createAnnotationPathFn = (
  params: PathParams,
) => {
  const fill = createAnnotationFill(params);
  const { x, y, height, width, leftBorder, rightBorder } = params;

  const path = [];
  const capHeight = 10;
  const baseline = y + height;

  if (leftBorder) {
    path.push(`M ${x} ${baseline - capHeight} v ${capHeight}`);
  }

  path.push(`M ${x} ${baseline} h ${width}`);

  if (rightBorder) {
    path.push(`M ${x + width} ${baseline - capHeight} v ${capHeight}`);
  }

  return {
    border: path.join(" "),
    fill,
  };
};

// Create the custom renderer class
export class MyUnderLineAnnotationRenderer extends AnnotationRender<any> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = false;

  static instance = "my-underline-renderer";
  readonly name = MyUnderLineAnnotationRenderer.instance;

  constructor() {
    super(DefaultUnderlineAnnotationRenderStyle);
  }

  createDraws(
    params: AnnotationRenderParams,
    parentDimensions: { x: number; y: number },
    annotation: TextAnnotation,
  ) {
    return createTextAnnotationRender(
      params,
      this.style,
      parentDimensions,
      annotation,
      createUnderlineWithCaps,
      getColorsUnderline,
    );
  }
}

const createWavesPath: createAnnotationPathFn = (params: PathParams) => {
  const { x, y: baseY, width, height } = params;
  const waveCount = 4;
  const amplitude = 4;
  const y = baseY + height;
  const waveWidth = width / waveCount;
  const path: string[] = [`M ${x} ${y}`];

  for (let i = 0; i < waveCount; i++) {
    const direction = i % 2 === 0 ? -1 : 1;
    const startX = x + i * waveWidth;
    const x1 = startX + waveWidth * 0.25;
    const y1 = y + amplitude * direction;
    const x2 = startX + waveWidth * 0.75;
    const y2 = y + amplitude * direction;
    const endX = startX + waveWidth;

    path.push(`C ${x1} ${y1}, ${x2} ${y2}, ${endX} ${y}`);
  }

  return {
    border: path.join(" "),
    fill: null,
  };
};

// Create the custom renderer class
export class WavesAnnotationRenderer extends AnnotationRender<any> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = false;

  static instance = "my-waves-renderer";
  readonly name = WavesAnnotationRenderer.instance;

  constructor() {
    super(DefaultUnderlineAnnotationRenderStyle);
  }

  createDraws(
    params: AnnotationRenderParams,
    parentDimensions: { x: number; y: number },
    annotation: TextAnnotation,
  ) {
    return createTextAnnotationRender(
      params,
      this.style,
      parentDimensions,
      annotation,
      createWavesPath,
      getColorsUnderline,
    );
  }
}

export const customAnnotationRender = (id_default: string, waves?: boolean) => {
  clearAnnotatedTextCache();

  createAnnotatedText<DemoAnnotation>(id_default, {
    annotation: {
      ...DemoAnnotationConfig,
      render: {
        defaultRenderer: waves
          ? WavesAnnotationRenderer.instance
          : MyUnderLineAnnotationRenderer.instance,
      },
    },
  })
    .registerRenders(
      new MyUnderLineAnnotationRenderer(),
      new WavesAnnotationRenderer(),
    )
    .setText(text)
    .setAnnotations(
      [
        annotations,
        {
          id: "multi line",
          start: 21,
          end: 40,
        } as DemoAnnotation,
        { id: "next to last", start: 51, end: 55 } as DemoAnnotation,
      ].flat(),
    );
};

export const annotationRender = (id_default: string) => {
  clearAnnotatedTextCache();

  createAnnotatedText<DemoAnnotation>(id_default, {
    annotation: {
      ...DemoAnnotationConfig,
      render: {
        renderFn: (a) => a.target,
      },
    },
  })
    .registerRender(new HighlightAnnotationRender())
    .registerRenders(
      new GutterAnnotationRender(),
      new UnderLineAnnotationRender(),
    )
    .setText(text)
    .setAnnotations(annotations);
};
