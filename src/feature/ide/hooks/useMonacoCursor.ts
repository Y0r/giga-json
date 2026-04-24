import * as monaco from "monaco-editor";

export const useMonacoCursor = () => {
  /**
   * Get the offset of a position in a model.
   *
   * @param model - The model to get the offset from.
   * @param position - The position to get the offset for.
   */
  function getOffsetFromPosition(
    model: monaco.editor.ITextModel,
    position: monaco.editor.IPosition | null,
  ): number {
    if (!position) {
      return 0;
    }
    return model.getOffsetAt(position);
  }

  /**
   * Get the position of an offset in a model.
   *
   * @param model - The model to get the position from.
   * @param offset - The offset to get the position for.
   */
  function getPositionFromOffset(
    model: monaco.editor.ITextModel,
    offset: number,
  ): monaco.IPosition {
    return model.getPositionAt(offset);
  }

  return { getOffsetFromPosition, getPositionFromOffset };
};

export default useMonacoCursor;
