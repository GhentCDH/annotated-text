import RBush from 'rbush';
import {
  AnnotationId,
  type TextAnnotation as _TextAnnotation,
} from '../../model';

export type TextAnnotation = Pick<_TextAnnotation, 'id' | 'start' | 'end'>;

interface RBushItem<TEXT_ANNOTATION> {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  annotation: TEXT_ANNOTATION;
}

export class AnnotationOverlap<TEXT_ANNOTATION extends TextAnnotation> {
  private readonly tree: RBush<RBushItem<TEXT_ANNOTATION>>;
  private readonly annotationById: Map<AnnotationId, TextAnnotation>;

  static init<TEXT_ANNOTATION extends TextAnnotation = TextAnnotation>(
    annotations: TEXT_ANNOTATION[],
  ): AnnotationOverlap<TEXT_ANNOTATION> {
    return new AnnotationOverlap(annotations);
  }

  private constructor(annotations: TEXT_ANNOTATION[]) {
    this.tree = new RBush<RBushItem<TEXT_ANNOTATION>>();
    this.annotationById = new Map();

    // Bulk load for better performance
    const items: RBushItem<TEXT_ANNOTATION>[] = annotations.map(
      (annotation) => {
        this.annotationById.set(annotation.id, annotation);
        return this.toRBushItem(annotation);
      },
    );

    this.tree.load(items);
  }

  /**
   * Convert annotation to RBush item.
   * We use a 1D approach: minX=start, maxX=end, minY=0, maxY=0
   *
   * Important: RBush uses inclusive bounds, but our overlap logic is:
   * a.start < b.end && b.start < a.end (exclusive at boundaries)
   *
   * To handle this, we shrink the search box slightly to exclude exact boundary matches.
   */
  private toRBushItem(annotation: TEXT_ANNOTATION): RBushItem<TEXT_ANNOTATION> {
    return {
      minX: annotation.start,
      maxX: annotation.end,
      minY: 0,
      maxY: 0,
      annotation,
    };
  }

  /**
   * Check if two annotations truly overlap (exclusive boundaries).
   * a.start < b.end && b.start < a.end
   */
  private overlaps(a: TextAnnotation, b: TEXT_ANNOTATION): boolean {
    return a.start < b.end && b.start < a.end;
  }

  private findCandidates(query: TEXT_ANNOTATION): RBushItem<TEXT_ANNOTATION>[] {
    if (query.start === query.end) {
      return [];
    }
    // Search for candidates using RBush
    // We need items where: item.start < query.end && query.start < item.end
    return this.tree.search({
      minX: query.start,
      maxX: query.end,
      minY: 0,
      maxY: 0,
    });
  }

  private isMatchingCandidate(
    item: RBushItem<TEXT_ANNOTATION>,
    query: TEXT_ANNOTATION,
  ): boolean {
    return (
      item.annotation.id !== query.id && this.overlaps(query, item.annotation)
    );
  }

  /**
   * Get all annotations that overlap with the given annotation.
   * Excludes the annotation itself (by id).
   * Time complexity: O(log n + k) where k is the number of results
   */
  getOverlaps(query: TEXT_ANNOTATION): TEXT_ANNOTATION[] {
    // Filter: exclude self and verify true overlap (RBush uses inclusive bounds)
    return this.findCandidates(query)
      .filter((item) => this.isMatchingCandidate(item, query))
      .map((item) => item.annotation);
  }

  /**
   * Check if a query annotation overlaps with any stored annotation.
   * Excludes the annotation itself (by id).
   */
  hasOverlap(query: TEXT_ANNOTATION): boolean {
    return this.findCandidates(query).some((item) =>
      this.isMatchingCandidate(item, query),
    );
  }
}
