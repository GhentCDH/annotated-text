import { UserActionState } from "../types/UserActionState.enum";
import type { MouseEventPayload } from "@/types/props";

/**
 * Holds the current user state in the component.
 */
export class UserState {
  state: UserActionState;
  payload: MouseEventPayload;

  constructor() {
    this.state = UserActionState.IDLE;
    this.payload = null;
  }

  reset() {
    this.state = UserActionState.IDLE;
    this.payload = null;
  }
}
