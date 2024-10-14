[**@ghentcdh/vue-component-annotated-text**](../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../modules.md) / [state](../README.md) / useStateObjectsStore

# Function: useStateObjectsStore()

> **useStateObjectsStore**(): `object`

## Returns

`object`

### createState

> **createState**: `Ref`\<`object`, [`CreateAnnotationState`](../classes/CreateAnnotationState.md) \| `object`\>

#### Type declaration

##### annotation

> **annotation**: `object`

##### annotation.class?

> `optional` **class**: `string`

##### annotation.color?

> `optional` **color**: `any`

##### annotation.end

> **end**: `number`

##### annotation.id

> **id**: `string`

##### annotation.label?

> `optional` **label**: `string`

##### annotation.start

> **start**: `number`

##### annotation.target

> **target**: [`AnnotationTarget`](../../types/Annotation/type-aliases/AnnotationTarget.md)

##### annotation.weight?

> `optional` **weight**: `number`

##### creating

> **creating**: `boolean`

##### newEnd

> **newEnd**: `number`

##### newStart

> **newStart**: `number`

##### userState

> **userState**: `object`

##### userState.payload

> **payload**: `object`

##### userState.payload.action?

> `optional` **action**: [`ActionType`](../../types/AnnotatedText/type-aliases/ActionType.md)

##### userState.payload.annotation?

> `optional` **annotation**: `object`

##### userState.payload.annotation.class?

> `optional` **class**: `string`

##### userState.payload.annotation.color?

> `optional` **color**: `any`

##### userState.payload.annotation.end

> **end**: `number`

##### userState.payload.annotation.id

> **id**: `string`

##### userState.payload.annotation.label?

> `optional` **label**: `string`

##### userState.payload.annotation.start

> **start**: `number`

##### userState.payload.annotation.target

> **target**: [`AnnotationTarget`](../../types/Annotation/type-aliases/AnnotationTarget.md)

##### userState.payload.annotation.weight?

> `optional` **weight**: `number`

##### userState.payload.startOffset

> **startOffset**: `number`

##### userState.state

> **state**: [`UserActionState`](../enumerations/UserActionState.md)

##### userState.reset()

###### Returns

`void`

##### initAnnotation()

Initialise the annotation to be created.

###### Parameters

• **annotation**: [`Annotation`](../../types/Annotation/interfaces/Annotation.md)

annotation object that the application can pass to use
as default init value.

###### Returns

`void`

##### resetCreating()

resets to the initial state

###### Returns

`void`

##### startCreating()

start creating an annotation

###### Parameters

• **start**: `number`

position where the creation starts. The end position will not
be able to be before this starting position.

###### Returns

`void`

##### updateCreating()

Has to be called every time the mouse moves a character when creating an
annotation. If the application does not listen to onMove updates the
component will do this automatically.

###### Returns

`void`

### hoverState

> **hoverState**: `Ref`\<`object`, [`HoverAnnotationsState`](../classes/HoverAnnotationsState.md) \| `object`\>

#### Type declaration

##### hoveredAnnotations

> **hoveredAnnotations**: `object`[]

##### mouseEvent

> **mouseEvent**: `object`

##### mouseEvent.altKey

> `readonly` **altKey**: `boolean`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/altKey)

##### mouseEvent.AT\_TARGET

> `readonly` **AT\_TARGET**: `2`

##### mouseEvent.bubbles

> `readonly` **bubbles**: `boolean`

Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/bubbles)

##### mouseEvent.BUBBLING\_PHASE

> `readonly` **BUBBLING\_PHASE**: `3`

##### mouseEvent.button

> `readonly` **button**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)

##### mouseEvent.buttons

> `readonly` **buttons**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/buttons)

##### mouseEvent.cancelable

> `readonly` **cancelable**: `boolean`

Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/cancelable)

##### mouseEvent.cancelBubble

> **cancelBubble**: `boolean`

###### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/cancelBubble)

##### mouseEvent.CAPTURING\_PHASE

> `readonly` **CAPTURING\_PHASE**: `1`

##### mouseEvent.clientX

> `readonly` **clientX**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/clientX)

##### mouseEvent.clientY

> `readonly` **clientY**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/clientY)

##### mouseEvent.composed

> `readonly` **composed**: `boolean`

Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/composed)

##### mouseEvent.ctrlKey

> `readonly` **ctrlKey**: `boolean`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/ctrlKey)

##### mouseEvent.currentTarget

> `readonly` **currentTarget**: `object`

Returns the object whose event listener's callback is currently being invoked.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/currentTarget)

##### mouseEvent.currentTarget.addEventListener()

Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.

The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.

When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.

When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.

When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.

If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.

The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

###### Parameters

• **type**: `string`

• **callback**: `EventListenerOrEventListenerObject`

• **options?**: `boolean` \| `AddEventListenerOptions`

###### Returns

`void`

##### mouseEvent.currentTarget.dispatchEvent()

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

###### Parameters

• **event**: `Event`

###### Returns

`boolean`

##### mouseEvent.currentTarget.removeEventListener()

Removes the event listener in target's event listener list with the same type, callback, and options.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener)

###### Parameters

• **type**: `string`

• **callback**: `EventListenerOrEventListenerObject`

• **options?**: `boolean` \| `EventListenerOptions`

###### Returns

`void`

##### mouseEvent.defaultPrevented

> `readonly` **defaultPrevented**: `boolean`

Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/defaultPrevented)

##### mouseEvent.detail

> `readonly` **detail**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/UIEvent/detail)

##### mouseEvent.eventPhase

> `readonly` **eventPhase**: `number`

Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/eventPhase)

##### mouseEvent.isTrusted

> `readonly` **isTrusted**: `boolean`

Returns true if event was dispatched by the user agent, and false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/isTrusted)

##### mouseEvent.layerX

> `readonly` **layerX**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/layerX)

##### mouseEvent.layerY

> `readonly` **layerY**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/layerY)

##### mouseEvent.metaKey

> `readonly` **metaKey**: `boolean`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/metaKey)

##### mouseEvent.movementX

> `readonly` **movementX**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/movementX)

##### mouseEvent.movementY

> `readonly` **movementY**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/movementY)

##### mouseEvent.NONE

> `readonly` **NONE**: `0`

##### mouseEvent.offsetX

> `readonly` **offsetX**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/offsetX)

##### mouseEvent.offsetY

> `readonly` **offsetY**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/offsetY)

##### mouseEvent.pageX

> `readonly` **pageX**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/pageX)

##### mouseEvent.pageY

> `readonly` **pageY**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/pageY)

##### mouseEvent.relatedTarget

> `readonly` **relatedTarget**: `object`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/relatedTarget)

##### mouseEvent.relatedTarget.addEventListener()

Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.

The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.

When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.

When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.

When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.

If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.

The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

###### Parameters

• **type**: `string`

• **callback**: `EventListenerOrEventListenerObject`

• **options?**: `boolean` \| `AddEventListenerOptions`

###### Returns

`void`

##### mouseEvent.relatedTarget.dispatchEvent()

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

###### Parameters

• **event**: `Event`

###### Returns

`boolean`

##### mouseEvent.relatedTarget.removeEventListener()

Removes the event listener in target's event listener list with the same type, callback, and options.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener)

###### Parameters

• **type**: `string`

• **callback**: `EventListenerOrEventListenerObject`

• **options?**: `boolean` \| `EventListenerOptions`

###### Returns

`void`

##### mouseEvent.returnValue

> **returnValue**: `boolean`

###### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/returnValue)

##### mouseEvent.screenX

> `readonly` **screenX**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/screenX)

##### mouseEvent.screenY

> `readonly` **screenY**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/screenY)

##### mouseEvent.shiftKey

> `readonly` **shiftKey**: `boolean`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/shiftKey)

##### mouseEvent.srcElement

> `readonly` **srcElement**: `object`

###### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/srcElement)

##### mouseEvent.srcElement.addEventListener()

Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.

The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.

When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.

When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.

When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.

If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.

The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

###### Parameters

• **type**: `string`

• **callback**: `EventListenerOrEventListenerObject`

• **options?**: `boolean` \| `AddEventListenerOptions`

###### Returns

`void`

##### mouseEvent.srcElement.dispatchEvent()

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

###### Parameters

• **event**: `Event`

###### Returns

`boolean`

##### mouseEvent.srcElement.removeEventListener()

Removes the event listener in target's event listener list with the same type, callback, and options.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener)

###### Parameters

• **type**: `string`

• **callback**: `EventListenerOrEventListenerObject`

• **options?**: `boolean` \| `EventListenerOptions`

###### Returns

`void`

##### mouseEvent.target

> `readonly` **target**: `object`

Returns the object to which event is dispatched (its target).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/target)

##### mouseEvent.target.addEventListener()

Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.

The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.

When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.

When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.

When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.

If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.

The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

###### Parameters

• **type**: `string`

• **callback**: `EventListenerOrEventListenerObject`

• **options?**: `boolean` \| `AddEventListenerOptions`

###### Returns

`void`

##### mouseEvent.target.dispatchEvent()

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

###### Parameters

• **event**: `Event`

###### Returns

`boolean`

##### mouseEvent.target.removeEventListener()

Removes the event listener in target's event listener list with the same type, callback, and options.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener)

###### Parameters

• **type**: `string`

• **callback**: `EventListenerOrEventListenerObject`

• **options?**: `boolean` \| `EventListenerOptions`

###### Returns

`void`

##### mouseEvent.timeStamp

> `readonly` **timeStamp**: `number`

Returns the event's timestamp as the number of milliseconds measured relative to the time origin.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/timeStamp)

##### mouseEvent.type

> `readonly` **type**: `string`

Returns the type of event, e.g. "click", "hashchange", or "submit".

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/type)

##### mouseEvent.view

> `readonly` **view**: `Window`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/UIEvent/view)

##### mouseEvent.which

> `readonly` **which**: `number`

###### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/UIEvent/which)

##### mouseEvent.x

> `readonly` **x**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/x)

##### mouseEvent.y

> `readonly` **y**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/y)

##### mouseEvent.composedPath()

Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/composedPath)

###### Returns

`EventTarget`[]

##### mouseEvent.getModifierState()

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/getModifierState)

###### Parameters

• **keyArg**: `string`

###### Returns

`boolean`

##### mouseEvent.initEvent()

###### Parameters

• **type**: `string`

• **bubbles?**: `boolean`

• **cancelable?**: `boolean`

###### Returns

`void`

###### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/initEvent)

##### mouseEvent.initMouseEvent()

###### Parameters

• **typeArg**: `string`

• **canBubbleArg**: `boolean`

• **cancelableArg**: `boolean`

• **viewArg**: `Window`

• **detailArg**: `number`

• **screenXArg**: `number`

• **screenYArg**: `number`

• **clientXArg**: `number`

• **clientYArg**: `number`

• **ctrlKeyArg**: `boolean`

• **altKeyArg**: `boolean`

• **shiftKeyArg**: `boolean`

• **metaKeyArg**: `boolean`

• **buttonArg**: `number`

• **relatedTargetArg**: `EventTarget`

###### Returns

`void`

###### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MouseEvent/initMouseEvent)

##### mouseEvent.initUIEvent()

###### Parameters

• **typeArg**: `string`

• **bubblesArg?**: `boolean`

• **cancelableArg?**: `boolean`

• **viewArg?**: `Window`

• **detailArg?**: `number`

###### Returns

`void`

###### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/UIEvent/initUIEvent)

##### mouseEvent.preventDefault()

If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/preventDefault)

###### Returns

`void`

##### mouseEvent.stopImmediatePropagation()

Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/stopImmediatePropagation)

###### Returns

`void`

##### mouseEvent.stopPropagation()

When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation)

###### Returns

`void`

### updateState

> **updateState**: `Ref`\<`object`, [`UpdateAnnotationState`](../classes/UpdateAnnotationState.md) \| `object`\>

#### Type declaration

##### action

> **action**: [`ActionType`](../../types/AnnotatedText/type-aliases/ActionType.md)

##### annotation

> **annotation**: `object`

##### annotation.class?

> `optional` **class**: `string`

##### annotation.color?

> `optional` **color**: `any`

##### annotation.end

> **end**: `number`

##### annotation.id

> **id**: `string`

##### annotation.label?

> `optional` **label**: `string`

##### annotation.start

> **start**: `number`

##### annotation.target

> **target**: [`AnnotationTarget`](../../types/Annotation/type-aliases/AnnotationTarget.md)

##### annotation.weight?

> `optional` **weight**: `number`

##### handlePosition

> **handlePosition**: `number`

##### newEnd

> **newEnd**: `number`

##### newStart

> **newStart**: `number`

##### origAnnotation

> **origAnnotation**: `object`

##### origAnnotation.class?

> `optional` **class**: `string`

##### origAnnotation.color?

> `optional` **color**: `any`

##### origAnnotation.end

> **end**: `number`

##### origAnnotation.id

> **id**: `string`

##### origAnnotation.label?

> `optional` **label**: `string`

##### origAnnotation.start

> **start**: `number`

##### origAnnotation.target

> **target**: [`AnnotationTarget`](../../types/Annotation/type-aliases/AnnotationTarget.md)

##### origAnnotation.weight?

> `optional` **weight**: `number`

##### origEnd?

> `optional` **origEnd**: `number`

##### origStart?

> `optional` **origStart**: `number`

##### updating

> **updating**: `boolean` = `false`

##### userState

> **userState**: `object`

##### userState.payload

> **payload**: `object`

##### userState.payload.action?

> `optional` **action**: [`ActionType`](../../types/AnnotatedText/type-aliases/ActionType.md)

##### userState.payload.annotation?

> `optional` **annotation**: `object`

##### userState.payload.annotation.class?

> `optional` **class**: `string`

##### userState.payload.annotation.color?

> `optional` **color**: `any`

##### userState.payload.annotation.end

> **end**: `number`

##### userState.payload.annotation.id

> **id**: `string`

##### userState.payload.annotation.label?

> `optional` **label**: `string`

##### userState.payload.annotation.start

> **start**: `number`

##### userState.payload.annotation.target

> **target**: [`AnnotationTarget`](../../types/Annotation/type-aliases/AnnotationTarget.md)

##### userState.payload.annotation.weight?

> `optional` **weight**: `number`

##### userState.payload.startOffset

> **startOffset**: `number`

##### userState.state

> **state**: [`UserActionState`](../enumerations/UserActionState.md)

##### userState.reset()

###### Returns

`void`

##### confirmStartUpdating()

Should get called in order to confirm the initial state of the update.

###### Returns

`void`

##### confirmUpdate()

Needs to be called by the parent component every time annotation-edit-moved
is emitted in order to confirm that edit. newStart and newEnd can be
edited before calling this in order to manipulate on what annotations have
to wrap.

###### Returns

`void`

##### resetUpdate()

has to get called after an edit has been confirmed or denied.

###### Returns

`void`

##### startUpdating()

Gets called by the component when an edit it started. Should generally not
be called by the parent component.

###### Parameters

• **action**: [`ActionType`](../../types/AnnotatedText/type-aliases/ActionType.md)

• **handlePosition**: `number`

• **annotation**: [`Annotation`](../../types/Annotation/interfaces/Annotation.md)

• **origEnd**: `number` = `null`

• **origStart**: `number` = `null`

• **newEnd**: `number`

• **newStart**: `number`

###### Returns

`void`

### userState

> **userState**: `Ref`\<`object`, [`UserState`](../classes/UserState.md) \| `object`\>

#### Type declaration

##### payload

> **payload**: `object`

##### payload.action?

> `optional` **action**: [`ActionType`](../../types/AnnotatedText/type-aliases/ActionType.md)

##### payload.annotation?

> `optional` **annotation**: `object`

##### payload.annotation.class?

> `optional` **class**: `string`

##### payload.annotation.color?

> `optional` **color**: `any`

##### payload.annotation.end

> **end**: `number`

##### payload.annotation.id

> **id**: `string`

##### payload.annotation.label?

> `optional` **label**: `string`

##### payload.annotation.start

> **start**: `number`

##### payload.annotation.target

> **target**: [`AnnotationTarget`](../../types/Annotation/type-aliases/AnnotationTarget.md)

##### payload.annotation.weight?

> `optional` **weight**: `number`

##### payload.startOffset

> **startOffset**: `number`

##### state

> **state**: [`UserActionState`](../enumerations/UserActionState.md)

##### reset()

###### Returns

`void`

## Defined in

[src/state/stores/AnnotationComponentStores.ts:7](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/state/stores/AnnotationComponentStores.ts#L7)
