import { AnnotationSvg } from "./svg.types";
import { colorAnnotation } from "../draw/annotations";
import { AnnotationDraw, AnnotationDrawColor } from "../annotation.model";

export class IdCollection {
  private ids = new Map<
    string,
    { selected: AnnotationDrawColor; default: AnnotationDrawColor }
  >();

  constructor(private readonly color: "active" | "hover") {}

  public removeId(ids: string[]) {
    ids?.forEach((id) => this.ids?.delete(id));
  }

  public changeIds(
    svgElement: AnnotationSvg,
    annotations: AnnotationDraw[],
    ignoreIds: string[],
  ): void {
    const removeIds = this.ids
      .keys()
      .filter(
        (id) =>
          !annotations.some(
            (a) =>
              a.annotationUuid === id && !ignoreIds.includes(a.annotationUuid),
          ),
      );
    removeIds.forEach((uuid) => {
      const color = this.ids.get(uuid);
      colorAnnotation(svgElement, uuid, color.default);
    });
    this.ids.clear();
    annotations.forEach((a) => {
      if (!a) return;
      const color = a.color[this.color];
      this.ids.set(a.annotationUuid, {
        selected: a.color[this.color],
        default: a.color.default,
      });
      colorAnnotation(svgElement, a.annotationUuid, color);
    });
  }

  public colorIds(svgElement: AnnotationSvg) {
    this.ids.forEach((color, annotationUuid) => {
      colorAnnotation(svgElement, annotationUuid, color.selected);
    });
  }
}
