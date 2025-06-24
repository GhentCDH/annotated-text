import { SvgModel } from "./svg.types";
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
    svg: SvgModel,
    annotations: AnnotationDraw[],
    ignoreIds: string[],
  ): void {
    const removeIds = this.ids
      .keys()
      .filter(
        (id) =>
          !annotations.some(
            (a) =>
              a?.annotationUuid === id && !ignoreIds.includes(a.annotationUuid),
          ),
      );
    removeIds.forEach((uuid) => {
      const color = this.ids.get(uuid);
      svg.colorAnnotation(uuid, color.default);
    });
    this.ids.clear();
    annotations.forEach((a) => {
      if (!a) return;
      const color = a.color[this.color];
      this.ids.set(a.annotationUuid, {
        selected: a.color[this.color],
        default: a.color.default,
      });
      svg.colorAnnotation(a.annotationUuid, color);
    });
  }

  public colorIds(svg: SvgModel) {
    this.ids.forEach((color, annotationUuid) => {
      svg.colorAnnotation(annotationUuid, color.selected);
    });
  }
}
