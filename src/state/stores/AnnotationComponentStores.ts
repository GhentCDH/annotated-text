import { ref } from "vue";
import { CreateAnnotationState } from "../states/CreateAnnotationState";
import { UpdateAnnotationState } from "../states/UpdateAnnotationState";
import { UserState } from "../states/UserState";
import { HoverAnnotationsState } from "../states/HoverAnnotationsState";

export const useStateObjectsStore = () => {
  const userState = ref(new UserState());
  const updateState = ref(new UpdateAnnotationState(userState.value));
  const createState = ref(new CreateAnnotationState(userState.value));
  const hoverState = ref(new HoverAnnotationsState());

  return { updateState, createState, hoverState, userState };
};
