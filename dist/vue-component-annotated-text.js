var Vt = Object.defineProperty;
var It = (s, t, n) => t in s ? Vt(s, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : s[t] = n;
var v = (s, t, n) => (It(s, typeof t != "symbol" ? t + "" : t, n), n);
import { defineComponent as Et, resolveComponent as Ut, openBlock as w, createElementBlock as y, Fragment as I, unref as S, renderSlot as x, createCommentVNode as k, normalizeClass as F, withModifiers as st, createVNode as Ot, withCtx as B, toDisplayString as $, renderList as tt, createElementVNode as ht, createBlock as xt, ref as ot, watch as $t } from "vue";
import { computed as P, isVue2 as T, toRefs as gt, toRaw as Dt, isRef as G, isReactive as ut, toRef as it, hasInjectionContext as Lt, inject as jt, getCurrentInstance as Ht, set as M, ref as Tt, watch as Wt, reactive as wt, markRaw as Y, effectScope as Ft, del as dt, nextTick as yt, getCurrentScope as Bt, onScopeDispose as Gt } from "vue-demi";
const at = (s, t) => {
  if (document.caretPositionFromPoint) {
    const n = document.caretPositionFromPoint(s, t);
    return n ? {
      offsetNode: n.offsetNode,
      offset: n.offset,
      getClientRect() {
        return n.getClientRect();
      }
    } : null;
  } else {
    const n = document.caretRangeFromPoint(s, t);
    return n ? {
      offsetNode: n.startContainer,
      offset: n.startOffset,
      getClientRect() {
        return n.getClientRects()[0];
      }
    } : null;
  }
}, Jt = function(s, t) {
  return s.start <= t.start && s.end >= t.start;
}, zt = function(s, t) {
  return s.start <= t.end && s.end >= t.end;
};
class qt {
  constructor(t, n) {
    v(this, "props");
    v(this, "editAnnotationState");
    v(this, "componentClasses", P(() => [
      "annotated-text",
      "theme-" + this.props.theme,
      "annotated-text--render-" + this.props.render,
      this.editAnnotationState.action ? "action--active action--" + this.editAnnotationState.action : null,
      this.props.showLabels ? "annotated-text--show-labels" : null
    ].filter((n) => n)));
    v(this, "wordPartClasses", (t) => [
      "token-segment",
      "token-segment--m" + this.maxAnnotationWeight(t.annotations)
    ]);
    v(this, "annotationGutterClasses", (t, n) => {
      const e = [
        (t == null ? void 0 : t.class) ?? "",
        this.props.style.weightClass + ((t == null ? void 0 : t.weight) ?? 0)
      ];
      return Jt(n, t) && e.push(this.props.style.startClass), zt(n, t) && e.push(this.props.style.endClass), e;
    });
    v(this, "annotationClasses", (t, n, e, r) => {
      const o = [
        (t == null ? void 0 : t.class) ?? "",
        (t == null ? void 0 : t.tmpClass) ?? "",
        this.props.style.weightClass + ((t == null ? void 0 : t.weight) ?? 0)
      ];
      return (t == null ? void 0 : t.start) === n && o.push(this.props.style.startClass), (t == null ? void 0 : t.end) === e && o.push(this.props.style.endClass), this.editAnnotationState.annotation && t.id === this.editAnnotationState.annotation.id && t !== this.editAnnotationState.annotation && o.push(this.props.style.transitioningClass), this.editAnnotationState.annotation && t === this.editAnnotationState.annotation && o.push(this.props.style.shadowClass), this.props.hoveredAnnotations.includes(t.id) && o.push(this.props.style.hoveredClass), this.props.selectedAnnotations.includes(t.id) && o.push(this.props.style.activeClass), r && o.push("create-anno-text"), o;
    });
    v(this, "maxAnnotationWeight", function(t) {
      return t.reduce(
        (n, e) => Math.max(n, Number((e == null ? void 0 : e.weight) ?? 0)),
        0
      );
    });
    this.props = t, this.editAnnotationState = n;
  }
}
const Qt = {
  key: 0,
  class: "annotation-slot annotation-slot--before"
}, Xt = { key: 1 }, Yt = {
  key: 2,
  class: "text"
}, Zt = {
  key: 3,
  class: "annotation-slot annotation-slot--after"
}, Kt = /* @__PURE__ */ Et({
  __name: "RecursiveAnnotatedTokenPartText",
  props: {
    componentId: {},
    text: {},
    start: {},
    end: {},
    annotations: { default: () => [] },
    annotationClassHandler: { type: Function, default: () => [] },
    wordPartStart: {},
    allowEdit: { type: Boolean },
    allowCreate: { type: Boolean },
    mouseDownHandler: {},
    mouseMoveHandler: {}
  },
  setup(s) {
    const t = s, n = P(() => t.annotations[0]);
    return (e, r) => {
      var c, u, h, d;
      const o = Ut("RecursiveAnnotatedTokenPartText", !0);
      return w(), y(I, null, [
        e.start === ((c = S(n)) == null ? void 0 : c.start) ? (w(), y("span", Qt, [
          x(e.$slots, "annotation-before", { annotation: S(n) })
        ])) : k("", !0),
        e.annotations.length ? (w(), y("span", {
          key: 1,
          class: F(
            t.annotationClassHandler(S(n), e.start, e.end, t.allowCreate)
          ),
          onMousedown: r[2] || (r[2] = st((p) => t.mouseDownHandler(p, {
            startOffset: e.wordPartStart,
            annotation: S(n),
            action: "move"
          }), ["stop"])),
          onMousemove: r[3] || (r[3] = st((p) => t.mouseMoveHandler(p, {
            startOffset: e.wordPartStart,
            annotation: S(n)
          }), ["stop"]))
        }, [
          e.start === ((u = S(n)) == null ? void 0 : u.start) ? (w(), y("span", {
            key: 0,
            class: "handle handle--start",
            onMousedown: r[0] || (r[0] = st((p) => t.mouseDownHandler(p, {
              startOffset: e.wordPartStart,
              annotation: S(n),
              action: "moveStart"
            }), ["stop"]))
          }, null, 32)) : k("", !0),
          Ot(o, {
            "component-id": e.componentId,
            annotations: e.annotations.slice(1),
            text: e.text,
            start: e.start,
            end: e.end,
            "allow-edit": e.allowEdit,
            "word-part-start": e.wordPartStart,
            "annotation-class-handler": t.annotationClassHandler,
            "mouse-down-handler": t.mouseDownHandler,
            "mouse-move-handler": t.mouseMoveHandler
          }, {
            "annotation-before": B((p) => [
              x(e.$slots, "annotation-before", {
                annotation: p.annotation
              })
            ]),
            "annotation-after": B((p) => [
              x(e.$slots, "annotation-after", {
                annotation: p.annotation
              })
            ]),
            _: 3
          }, 8, ["component-id", "annotations", "text", "start", "end", "allow-edit", "word-part-start", "annotation-class-handler", "mouse-down-handler", "mouse-move-handler"]),
          e.annotations[0].label ? (w(), y("label", Xt, $(e.annotations[0].label), 1)) : k("", !0),
          e.end === ((h = e.annotations[0]) == null ? void 0 : h.end) ? (w(), y("span", {
            key: 2,
            class: "handle handle--end",
            onMousedown: r[1] || (r[1] = st((p) => t.mouseDownHandler(p, {
              startOffset: e.wordPartStart,
              annotation: S(n),
              action: "moveEnd"
            }), ["stop"]))
          }, null, 32)) : k("", !0)
        ], 34)) : (w(), y("span", Yt, $(e.text), 1)),
        e.end === ((d = S(n)) == null ? void 0 : d.end) ? (w(), y("span", Zt, [
          x(e.$slots, "annotation-after", { annotation: S(n) })
        ])) : k("", !0)
      ], 64);
    };
  }
}), te = ["onMousemove"], ee = { class: "text" }, ne = ["onMousedown", "onMousemove"], se = { key: 0 }, oe = ["onMousedown"], ae = /* @__PURE__ */ Et({
  __name: "AnnotatedLine",
  props: {
    componentId: {},
    line: {},
    wordPartClasses: { type: Function, default: () => [] },
    render: { default: "nested" },
    annotationClasses: { type: Function, default: () => [] },
    allowEdit: { type: Boolean },
    allowCreate: { type: Boolean },
    mouseDownHandler: {},
    mouseMoveHandler: {}
  },
  setup(s) {
    const t = s, n = P(() => t.render === "nested"), e = P(() => t.render === "flat");
    function r() {
      const o = ["text"];
      return t.allowCreate && o.push("create-anno-text"), o;
    }
    return (o, c) => (w(!0), y(I, null, tt(o.line.words, (u) => (w(), y("span", {
      key: u.text,
      class: "token"
    }, [
      (w(!0), y(I, null, tt(u.parts, (h) => (w(), y("span", {
        key: h.text,
        class: F(o.wordPartClasses(h)),
        onMousemove: (d) => t.mouseMoveHandler(d, {
          startOffset: h.start
        })
      }, [
        S(e) ? (w(), y(I, { key: 0 }, [
          ht("span", ee, $(h.text), 1),
          (w(!0), y(I, null, tt(h.annotations, (d) => (w(), y("span", {
            key: d.id,
            class: F(
              o.annotationClasses(
                d,
                h.start,
                h.end,
                t.allowCreate
              )
            ),
            onMousedown: (p) => t.mouseDownHandler(p, {
              startOffset: h.start,
              annotation: d,
              action: "move"
            }),
            onMousemove: (p) => t.mouseMoveHandler(p, {
              startOffset: h.start,
              annotation: d
            })
          }, [
            d.label ? (w(), y("label", se, $(d.label), 1)) : k("", !0)
          ], 42, ne))), 128))
        ], 64)) : k("", !0),
        S(n) ? (w(), y(I, { key: 1 }, [
          h.annotations.length ? (w(), xt(Kt, {
            key: 0,
            "component-id": t.componentId,
            text: h.text,
            start: h.start,
            end: h.end,
            "allow-edit": o.allowEdit,
            "allow-create": o.allowCreate,
            "word-part-start": h.start,
            annotations: h.annotations.sort((d, p) => p.weight - d.weight),
            "annotation-class-handler": o.annotationClasses,
            "mouse-down-handler": t.mouseDownHandler,
            "mouse-move-handler": t.mouseMoveHandler
          }, {
            "annotation-before": B((d) => [
              x(o.$slots, "annotation-before", {
                annotation: d.annotation
              })
            ]),
            "annotation-after": B((d) => [
              x(o.$slots, "annotation-after", {
                annotation: d.annotation
              })
            ]),
            _: 2
          }, 1032, ["component-id", "text", "start", "end", "allow-edit", "allow-create", "word-part-start", "annotations", "annotation-class-handler", "mouse-down-handler", "mouse-move-handler"])) : (w(), y("span", {
            key: 1,
            class: F(r()),
            onMousedown: (d) => t.mouseDownHandler(d, { startOffset: h.start })
          }, $(h.text), 43, oe))
        ], 64)) : k("", !0)
      ], 42, te))), 128))
    ]))), 128));
  }
});
/*!
 * pinia v2.2.2
 * (c) 2024 Eduardo San Martin Morote
 * @license MIT
 */
let Z;
const lt = (s) => Z = s, re = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function L(s) {
  return s && typeof s == "object" && Object.prototype.toString.call(s) === "[object Object]" && typeof s.toJSON != "function";
}
var et;
(function(s) {
  s.direct = "direct", s.patchObject = "patch object", s.patchFunction = "patch function";
})(et || (et = {}));
const K = typeof window < "u";
function kt(s, t) {
  for (const n in t) {
    const e = t[n];
    if (!(n in s))
      continue;
    const r = s[n];
    L(r) && L(e) && !G(e) && !ut(e) ? s[n] = kt(r, e) : T ? M(s, n, e) : s[n] = e;
  }
  return s;
}
const Pt = () => {
};
function St(s, t, n, e = Pt) {
  s.push(t);
  const r = () => {
    const o = s.indexOf(t);
    o > -1 && (s.splice(o, 1), e());
  };
  return !n && Bt() && Gt(r), r;
}
function W(s, ...t) {
  s.slice().forEach((n) => {
    n(...t);
  });
}
const ie = (s) => s(), bt = Symbol(), pt = Symbol();
function vt(s, t) {
  s instanceof Map && t instanceof Map ? t.forEach((n, e) => s.set(e, n)) : s instanceof Set && t instanceof Set && t.forEach(s.add, s);
  for (const n in t) {
    if (!t.hasOwnProperty(n))
      continue;
    const e = t[n], r = s[n];
    L(r) && L(e) && s.hasOwnProperty(n) && !G(e) && !ut(e) ? s[n] = vt(r, e) : s[n] = e;
  }
  return s;
}
const le = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
), ue = /* @__PURE__ */ new WeakMap();
function ce(s) {
  return T ? (
    /* istanbul ignore next */
    !ue.has(s)
  ) : !L(s) || !s.hasOwnProperty(le);
}
const { assign: D } = Object;
function Ct(s) {
  return !!(G(s) && s.effect);
}
function Nt(s, t, n, e) {
  const { state: r, actions: o, getters: c } = t, u = n.state.value[s];
  let h;
  function d() {
    !u && (process.env.NODE_ENV === "production" || !e) && (T ? M(n.state.value, s, r ? r() : {}) : n.state.value[s] = r ? r() : {});
    const p = process.env.NODE_ENV !== "production" && e ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      gt(Tt(r ? r() : {}).value)
    ) : gt(n.state.value[s]);
    return D(p, o, Object.keys(c || {}).reduce((E, C) => (process.env.NODE_ENV !== "production" && C in p && console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${C}" in store "${s}".`), E[C] = Y(P(() => {
      lt(n);
      const N = n._s.get(s);
      if (!(T && !N._r))
        return c[C].call(N, N);
    })), E), {}));
  }
  return h = mt(s, d, t, n, e, !0), h;
}
function mt(s, t, n = {}, e, r, o) {
  let c;
  const u = D({ actions: {} }, n);
  if (process.env.NODE_ENV !== "production" && !e._e.active)
    throw new Error("Pinia destroyed");
  const h = { deep: !0 };
  process.env.NODE_ENV !== "production" && !T && (h.onTrigger = (l) => {
    d ? N = l : d == !1 && !a._hotUpdating && (Array.isArray(N) ? N.push(l) : console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."));
  });
  let d, p, E = [], C = [], N;
  const U = e.state.value[s];
  !o && !U && (process.env.NODE_ENV === "production" || !r) && (T ? M(e.state.value, s, {}) : e.state.value[s] = {});
  const J = Tt({});
  let j;
  function R(l) {
    let i;
    d = p = !1, process.env.NODE_ENV !== "production" && (N = []), typeof l == "function" ? (l(e.state.value[s]), i = {
      type: et.patchFunction,
      storeId: s,
      events: N
    }) : (vt(e.state.value[s], l), i = {
      type: et.patchObject,
      payload: l,
      storeId: s,
      events: N
    });
    const m = j = Symbol();
    yt().then(() => {
      j === m && (d = !0);
    }), p = !0, W(E, i, e.state.value[s]);
  }
  const V = o ? function() {
    const { state: i } = n, m = i ? i() : {};
    this.$patch((A) => {
      D(A, m);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${s}" is built using the setup syntax and does not implement $reset().`);
    } : Pt
  );
  function nt() {
    c.stop(), E = [], C = [], e._s.delete(s);
  }
  const z = (l, i = "") => {
    if (bt in l)
      return l[pt] = i, l;
    const m = function() {
      lt(e);
      const A = Array.from(arguments), Q = [], ct = [];
      function Mt(O) {
        Q.push(O);
      }
      function Rt(O) {
        ct.push(O);
      }
      W(C, {
        args: A,
        name: m[pt],
        store: a,
        after: Mt,
        onError: Rt
      });
      let X;
      try {
        X = l.apply(this && this.$id === s ? this : a, A);
      } catch (O) {
        throw W(ct, O), O;
      }
      return X instanceof Promise ? X.then((O) => (W(Q, O), O)).catch((O) => (W(ct, O), Promise.reject(O))) : (W(Q, X), X);
    };
    return m[bt] = !0, m[pt] = i, m;
  }, H = /* @__PURE__ */ Y({
    actions: {},
    getters: {},
    state: [],
    hotState: J
  }), q = {
    _p: e,
    // _s: scope,
    $id: s,
    $onAction: St.bind(null, C),
    $patch: R,
    $reset: V,
    $subscribe(l, i = {}) {
      const m = St(E, l, i.detached, () => A()), A = c.run(() => Wt(() => e.state.value[s], (Q) => {
        (i.flush === "sync" ? p : d) && l({
          storeId: s,
          type: et.direct,
          events: N
        }, Q);
      }, D({}, h, i)));
      return m;
    },
    $dispose: nt
  };
  T && (q._r = !1);
  const a = wt(process.env.NODE_ENV !== "production" || process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && K ? D(
    {
      _hmrPayload: H,
      _customProperties: Y(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    q
    // must be added later
    // setupStore
  ) : q);
  e._s.set(s, a);
  const f = (e._a && e._a.runWithContext || ie)(() => e._e.run(() => (c = Ft()).run(() => t({ action: z }))));
  for (const l in f) {
    const i = f[l];
    if (G(i) && !Ct(i) || ut(i))
      process.env.NODE_ENV !== "production" && r ? M(J.value, l, it(f, l)) : o || (U && ce(i) && (G(i) ? i.value = U[l] : vt(i, U[l])), T ? M(e.state.value[s], l, i) : e.state.value[s][l] = i), process.env.NODE_ENV !== "production" && H.state.push(l);
    else if (typeof i == "function") {
      const m = process.env.NODE_ENV !== "production" && r ? i : z(i, l);
      T ? M(f, l, m) : f[l] = m, process.env.NODE_ENV !== "production" && (H.actions[l] = i), u.actions[l] = i;
    } else
      process.env.NODE_ENV !== "production" && Ct(i) && (H.getters[l] = o ? (
        // @ts-expect-error
        n.getters[l]
      ) : i, K && (f._getters || // @ts-expect-error: same
      (f._getters = Y([]))).push(l));
  }
  if (T ? Object.keys(f).forEach((l) => {
    M(a, l, f[l]);
  }) : (D(a, f), D(Dt(a), f)), Object.defineProperty(a, "$state", {
    get: () => process.env.NODE_ENV !== "production" && r ? J.value : e.state.value[s],
    set: (l) => {
      if (process.env.NODE_ENV !== "production" && r)
        throw new Error("cannot set hotState");
      R((i) => {
        D(i, l);
      });
    }
  }), process.env.NODE_ENV !== "production" && (a._hotUpdate = Y((l) => {
    a._hotUpdating = !0, l._hmrPayload.state.forEach((i) => {
      if (i in a.$state) {
        const m = l.$state[i], A = a.$state[i];
        typeof m == "object" && L(m) && L(A) ? kt(m, A) : l.$state[i] = A;
      }
      M(a, i, it(l.$state, i));
    }), Object.keys(a.$state).forEach((i) => {
      i in l.$state || dt(a, i);
    }), d = !1, p = !1, e.state.value[s] = it(l._hmrPayload, "hotState"), p = !0, yt().then(() => {
      d = !0;
    });
    for (const i in l._hmrPayload.actions) {
      const m = l[i];
      M(a, i, z(m, i));
    }
    for (const i in l._hmrPayload.getters) {
      const m = l._hmrPayload.getters[i], A = o ? (
        // special handling of options api
        P(() => (lt(e), m.call(a, a)))
      ) : m;
      M(a, i, A);
    }
    Object.keys(a._hmrPayload.getters).forEach((i) => {
      i in l._hmrPayload.getters || dt(a, i);
    }), Object.keys(a._hmrPayload.actions).forEach((i) => {
      i in l._hmrPayload.actions || dt(a, i);
    }), a._hmrPayload = l._hmrPayload, a._getters = l._getters, a._hotUpdating = !1;
  })), process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && K) {
    const l = {
      writable: !0,
      configurable: !0,
      // avoid warning on devtools trying to display this property
      enumerable: !1
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((i) => {
      Object.defineProperty(a, i, D({ value: a[i] }, l));
    });
  }
  return T && (a._r = !0), e._p.forEach((l) => {
    if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && K) {
      const i = c.run(() => l({
        store: a,
        app: e._a,
        pinia: e,
        options: u
      }));
      Object.keys(i || {}).forEach((m) => a._customProperties.add(m)), D(a, i);
    } else
      D(a, c.run(() => l({
        store: a,
        app: e._a,
        pinia: e,
        options: u
      })));
  }), process.env.NODE_ENV !== "production" && a.$state && typeof a.$state == "object" && typeof a.$state.constructor == "function" && !a.$state.constructor.toString().includes("[native code]") && console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${a.$id}".`), U && o && n.hydrate && n.hydrate(a.$state, U), d = !0, p = !0, a;
}
// @__NO_SIDE_EFFECTS__
function de(s, t, n) {
  let e, r;
  const o = typeof t == "function";
  if (typeof s == "string")
    e = s, r = o ? n : t;
  else if (r = s, e = s.id, process.env.NODE_ENV !== "production" && typeof e != "string")
    throw new Error('[🍍]: "defineStore()" must be passed a store id as its first argument.');
  function c(u, h) {
    const d = Lt();
    if (u = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && Z && Z._testing ? null : u) || (d ? jt(re, null) : null), u && lt(u), process.env.NODE_ENV !== "production" && !Z)
      throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
    u = Z, u._s.has(e) || (o ? mt(e, t, r, u) : Nt(e, r, u), process.env.NODE_ENV !== "production" && (c._pinia = u));
    const p = u._s.get(e);
    if (process.env.NODE_ENV !== "production" && h) {
      const E = "__hot:" + e, C = o ? mt(E, t, r, u, !0) : Nt(E, D({}, r), u, !0);
      h._hotUpdate(C), delete u.state.value[E], u._s.delete(E);
    }
    if (process.env.NODE_ENV !== "production" && K) {
      const E = Ht();
      if (E && E.proxy && // avoid adding stores that are just built for hot module replacement
      !h) {
        const C = E.proxy, N = "_pStores" in C ? C._pStores : C._pStores = {};
        N[e] = p;
      }
    }
    return p;
  }
  return c.$id = e, c;
}
function pe(s) {
  if (T)
    return gt(s);
  {
    s = Dt(s);
    const t = {};
    for (const n in s) {
      const e = s[n];
      (G(e) || ut(e)) && (t[n] = // ---
      it(s, n));
    }
    return t;
  }
}
var _ = /* @__PURE__ */ ((s) => (s.IDLE = "idle", s.SELECTING = "selecting", s.UPDATING = "updating", s.CREATING = "creating", s.START_SELECT = "start-selecting", s.START_CREATE = "start-creating", s))(_ || {});
class fe {
  constructor() {
    v(this, "state");
    v(this, "payload");
    this.state = "idle", this.payload = null;
  }
  reset() {
    this.state = "idle", this.payload = null;
  }
}
class he {
  constructor(t) {
    v(this, "action");
    v(this, "handlePosition");
    v(this, "annotation");
    v(this, "origAnnotation");
    v(this, "origEnd");
    v(this, "origStart");
    v(this, "newEnd");
    v(this, "newStart");
    v(this, "updating", !1);
    v(this, "userState");
    this.userState = t, this.resetUpdate();
  }
  /**
   * has to get called after an edit has been confirmed or denied.
   */
  resetUpdate() {
    this.action = null, this.handlePosition = null, this.annotation = null, this.origAnnotation = null, this.origEnd = null, this.origStart = null, this.newEnd = null, this.newStart = null, this.updating = !1, this.userState.state = "idle", this.updating = !1;
  }
  /**
   * Gets called by the component when an edit it started. Should generally not
   * be called by the parent component.
   * @param action
   * @param handlePosition
   * @param annotation
   * @param origEnd
   * @param origStart
   * @param newEnd
   * @param newStart
   */
  startUpdating(t, n, e, r = null, o = null, c, u) {
    this.action = t, this.handlePosition = n, this.origAnnotation = e, this.annotation = JSON.parse(JSON.stringify(e)), this.annotation.tmpClass = "", this.origEnd = r, this.origStart = o, this.newEnd = c, this.newStart = u;
  }
  /**
   * Should get called in order to confirm the initial state of the update.
   */
  confirmStartUpdating() {
    this.userState.state = "updating", this.updating = !0, this.confirmUpdate();
  }
  /**
   * Needs to be called by the parent component every time annotation-edit-moved
   * is emitted in order to confirm that edit. newStart and newEnd can be
   * edited before calling this in order to manipulate on what annotations have
   * to wrap.
   */
  confirmUpdate() {
    this.updating && (this.annotation.start = this.newStart, this.annotation.end = this.newEnd);
  }
}
class ge {
  constructor() {
    v(this, "hoveredAnnotations");
    v(this, "mouseEvent");
    this.hoveredAnnotations = [], this.mouseEvent = null;
  }
}
class ve {
  constructor(t) {
    v(this, "newEnd");
    v(this, "newStart");
    v(this, "annotation");
    v(this, "creating");
    v(this, "userState");
    this.userState = t, this.resetCreating();
  }
  /**
   * resets to the initial state
   */
  resetCreating() {
    this.creating = !1, this.annotation = null, this.newEnd = null, this.newStart = null, this.creating = !1, this.userState.state = "idle";
  }
  /**
   * start creating an annotation
   * @param start position where the creation starts. The end position will not
   * be able to be before this starting position.
   */
  startCreating(t) {
    this.creating = !0, this.newStart = t, this.newEnd = t;
  }
  /**
   * Initialise the annotation to be created.
   * @param annotation annotation object that the application can pass to use
   * as default init value.
   */
  initAnnotation(t) {
    this.annotation = t, this.annotation.start = this.newStart, this.annotation.end = this.newEnd;
  }
  /**
   * Has to be called every time the mouse moves a character when creating an
   * annotation. If the application does not listen to onMove updates the
   * component will do this automatically.
   */
  updateCreating() {
    this.annotation.start = this.newStart, this.annotation.end = this.newEnd;
  }
}
const me = (s) => /* @__PURE__ */ de(`stateObjects-${s}`, () => {
  const t = ot(new fe()), n = ot(new he(t.value)), e = ot(new ve(t.value)), r = ot(new ge());
  return { updateState: n, createState: e, hoverState: r, userState: t };
});
function Ee(s) {
  const t = [[0, []]];
  for (const e of s) {
    let r = t.length - 1;
    for (; r >= 0; --r) {
      const c = t[r];
      if (c[0] <= e[0]) {
        c[0] < e[0] && (t.splice(r + 1, 0, [e[0], t[r][1].slice()]), r += 1);
        break;
      }
    }
    let o = t.length - 1;
    for (; o >= 0; --o) {
      const c = t[o];
      if (c[0] <= e[1]) {
        c[0] < e[1] && (t.splice(o + 1, 0, [e[1], c[1].slice()]), o += 1);
        break;
      }
    }
    for (let c = r; c < o; ++c)
      t[c][1].push(e[2]);
  }
  const n = [];
  for (let e = 0; e < t.length - 1; ++e)
    t[e][1].length > 0 && n.push([t[e][0], t[e + 1][0], t[e][1]]);
  return n;
}
const we = 1, _t = (s, t) => {
  const n = s[0] < t[0] ? s : t, e = n == s ? t : s;
  return n[1] < e[0] ? null : [e[0], n[1] < e[1] ? n[1] : e[1]];
};
class ye {
  constructor(t, n, e) {
    v(this, "props");
    v(this, "editState");
    v(this, "createState");
    v(this, "allAnnotations", P(() => {
      this.props.debug && console.log("** refresh annotations");
      let t = JSON.parse(JSON.stringify(this.props.annotations));
      return this.editState.annotation && t.push(this.editState.annotation), this.createState.annotation && t.push(this.createState.annotation), t = wt(t), t = t.filter(
        (n) => (n == null ? void 0 : n.visible) !== !1
      ), t;
    }));
    v(this, "gutterAnnotations", P(() => {
      this.props.debug && console.log("** refresh gutterAnnotations **");
      const t = this.allAnnotations.value.filter(
        (n) => n.target === "gutter"
      );
      return this.props.debug && console.log(t), t;
    }));
    // prepare annotations for Etali.FlattenRanges
    // etali end position = position of next char not included in range
    // ex: in "abcdef", span [0,2] is "ab"
    v(this, "prepareRanges", (t) => {
      this.props.debug && console.log("** prepare ranges for_annotations **"), this.props.debug && console.log(t);
      const n = t.filter((e) => e.target === "span");
      return this.props.autoAnnotationWeights && (this.calculateAnnotationWeights(n), this.calculateGutterAnnotationWeights(this.gutterAnnotations.value)), this.props.debug && console.log("** weighted span annotations **"), this.props.debug && console.log(n), this.props.debug && console.log("** weighted gutter annotations **"), this.props.debug && console.log(this.gutterAnnotations.value), t.map(
        (e) => [
          Math.max(0, e.start - this.props.annotationOffset),
          e.end + we - this.props.annotationOffset,
          e
        ]
      );
    });
    // give a certain weight to each annotation based on their position
    v(this, "calculateAnnotationWeights", function(t) {
      const n = function(r, o) {
        return r.start - o.start === 0 ? o.end - r.end : r.start - o.start;
      };
      t = t.sort(n);
      const e = [];
      t.forEach((r) => {
        let o = 0;
        for (; ; ) {
          if (!(e != null && e[o])) {
            r.weight = o, e[o] = r;
            return;
          }
          if (r.start > e[o].end) {
            r.weight = o, e[o] = r;
            return;
          }
          o++;
        }
      });
    });
    //this function is similar to the weights for span annotations but there is one difference
    //two annotations can start on the same line and 'overlap' even if they are not overlapping based on
    //character indexes.
    v(this, "calculateGutterAnnotationWeights", (t) => {
      const n = function(o, c) {
        const u = o.end - o.start, h = c.end - c.start;
        return u - h;
      };
      t = t.sort(n);
      let e = 0;
      t.forEach(function(o) {
        o.weight = e, e++;
      });
      const r = Math.max(
        ...this.gutterAnnotations.value.map((o) => o.weight)
      );
      t.forEach(function(o) {
        o.weight = r - o.weight;
      });
    });
    // flatten overlapping ranges
    v(this, "flattenedRanges", P(() => {
      let t = this.prepareRanges(this.allAnnotations.value);
      return this.props.lines.forEach((n) => {
        t.push([n.start, n.end + 1, null]);
        const e = n.text.split(" ");
        let r = 0;
        e.forEach((o, c) => {
          const u = n.start + r, h = c < e.length - 1 ? u + o.length + 1 : u + o.length;
          t.push([u, h + 1, null]), r += o.length + 1;
        });
      }), t = t.sort(
        (n, e) => Number(n[0]) - Number(e[0]) === 0 ? Number(n[1]) - Number(e[1]) : Number(n[0]) - Number(e[0])
      ), Ee(t);
    }));
    v(this, "createAnnotatedWord", (t) => {
      let n = this.flattenedRanges.value.filter(
        (o) => _t([o[0], o[1] - 1], [t.start, t.end])
      );
      const e = this.props.display;
      n = n.map(function(o) {
        return o[2] = o[2].filter((c) => c).filter((c) => (c == null ? void 0 : c.target) === e).sort((c, u) => Number(c == null ? void 0 : c.start) > Number(u == null ? void 0 : u.start) ? 1 : -1), o;
      });
      const r = n.map(
        (o) => ({
          start: o[0],
          end: o[1] - 1,
          text: typeof t.text == "string" ? t.text.substring(
            o[0] - t.start,
            o[1] - t.start
          ) : "",
          annotations: o[2]
        })
      );
      return {
        start: t.start,
        end: t.end,
        text: t.text,
        parts: r
      };
    });
    v(this, "createAnnotatedLine", (t) => {
      let n = [];
      const e = this.flattenedRanges.value.filter(
        (d) => _t([d[0], d[1] - 1], [t.start, t.end])
      );
      for (const d of e)
        d[2].filter((p) => p).filter((p) => (p == null ? void 0 : p.target) === "gutter").sort((p, E) => Number(p == null ? void 0 : p.weight) < Number(E == null ? void 0 : E.weight) ? -1 : 1).forEach((p) => n.push(p));
      n = [...new Set(n)];
      const r = Math.max(
        ...this.gutterAnnotations.value.map((d) => d.weight)
      );
      for (let d = 0; d <= r; d++)
        if (!(n.filter((E) => E.weight === d).length != 0)) {
          const E = {
            start: t.start,
            end: t.start,
            target: "gutter",
            class: "annotation annotation--gutter-spacer",
            weight: d
          };
          n.push(E);
        }
      n.sort(
        (d, p) => Number(d == null ? void 0 : d.weight) < Number(p == null ? void 0 : p.weight) ? -1 : 1
      );
      const o = [];
      let c = 0;
      const u = t.text.split(" ");
      u.forEach((d, p) => {
        o.push({
          start: t.start + c,
          end: t.start + c + d.length,
          text: p < u.length - 1 ? d + " " : d
        }), c += p < u.length - 1 ? d.length + 1 : d.length;
      });
      const h = [];
      return o.forEach((d) => {
        h.push(this.createAnnotatedWord(d));
      }), {
        start: t.start,
        end: t.end,
        words: h,
        gutter: {
          text: t.gutter,
          annotations: n
        }
      };
    });
    // Map every line to an annotated line
    v(this, "annotatedLines", P(() => {
      const t = this.props.lines.map(
        (n) => this.createAnnotatedLine(n)
      );
      return this.props.debug && console.log(
        `** annotated lines (component ${this.props.componentId}) **`
      ), this.props.debug && console.log(t), t;
    }));
    this.props = t, this.editState = n, this.createState = e;
  }
}
var b = [];
for (var ft = 0; ft < 256; ++ft)
  b.push((ft + 256).toString(16).slice(1));
function Se(s, t = 0) {
  return (b[s[t + 0]] + b[s[t + 1]] + b[s[t + 2]] + b[s[t + 3]] + "-" + b[s[t + 4]] + b[s[t + 5]] + "-" + b[s[t + 6]] + b[s[t + 7]] + "-" + b[s[t + 8]] + b[s[t + 9]] + "-" + b[s[t + 10]] + b[s[t + 11]] + b[s[t + 12]] + b[s[t + 13]] + b[s[t + 14]] + b[s[t + 15]]).toLowerCase();
}
var rt, be = new Uint8Array(16);
function Ce() {
  if (!rt && (rt = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !rt))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return rt(be);
}
var Ne = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const At = {
  randomUUID: Ne
};
function _e(s, t, n) {
  if (At.randomUUID && !t && !s)
    return At.randomUUID();
  s = s || {};
  var e = s.random || (s.rng || Ce)();
  if (e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128, t) {
    n = n || 0;
    for (var r = 0; r < 16; ++r)
      t[n + r] = e[r];
    return t;
  }
  return Se(e);
}
const Ae = { class: "gutter-annotations" }, Oe = ["onClick"], De = { key: 0 }, Te = {
  key: 0,
  class: "gutter text"
}, ke = { class: "content" }, Ve = /* @__PURE__ */ Et({
  __name: "AnnotatedText",
  props: {
    componentId: {},
    text: {},
    annotations: { default: () => [] },
    selectedAnnotations: { default: () => [] },
    hoveredAnnotations: { default: () => [] },
    lines: { default: () => [] },
    annotationOffset: { default: 0 },
    debug: { type: Boolean, default: !1 },
    verbose: { type: Boolean, default: !1 },
    theme: { default: "default" },
    render: { default: "nested" },
    display: { default: "span" },
    showLabels: { type: Boolean, default: !1 },
    autoAnnotationWeights: { type: Boolean, default: !0 },
    style: { default: () => ({
      activeClass: "annotation--active",
      startClass: "annotation--start",
      endClass: "annotation--end",
      weightClass: "annotation--weight-",
      transitioningClass: "annotation--transitioning",
      shadowClass: "annotation--shadow",
      hoveredClass: "annotation--hover"
    }) },
    allowEdit: { type: Boolean, default: !0 },
    allowCreate: { type: Boolean, default: !0 },
    listenToOnUpdateStart: { type: Boolean, default: !1 },
    listenToOnUpdating: { type: Boolean, default: !1 },
    listenToOnKeyPressed: { type: Boolean, default: !1 },
    listenToOnCreateStart: { type: Boolean, default: !1 },
    listenToOnCreating: { type: Boolean, default: !1 }
  },
  emits: ["annotation-select", "annotation-update-begin", "annotation-updating", "annotation-update-end", "annotation-create-begin", "annotation-creating", "annotation-create-end", "key-pressed", "annotation-mouse-over", "annotation-mouse-leave", "user-action-state-change"],
  setup(s, { emit: t }) {
    let n = s;
    n = wt(n);
    const e = t, r = me(n.componentId), { updateState: o, createState: c, userState: u, hoverState: h } = pe(
      r()
    ), d = P(() => u.value.state), p = new ye(
      n,
      o.value,
      c.value
    ), E = new qt(n, o.value), C = E.annotationGutterClasses, N = E.annotationClasses, U = E.componentClasses, J = E.wordPartClasses;
    $t(d, (a, g) => {
      n.verbose && console.log("user-action-state-change", g, a), e("user-action-state-change", g, a);
    }), window.addEventListener("keyup", (a) => {
      if (n.listenToOnKeyPressed)
        n.verbose && console.log("key-pressed", a.key, o.value, c.value), e(
          "key-pressed",
          a,
          o.value,
          c.value,
          u.value
        );
      else
        switch (a.key) {
          case "Escape":
            o.value.resetUpdate();
        }
    });
    const j = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map();
    function nt(a, g) {
      n.verbose && console.log("@onMouseDown", "userState:", u.value.state, g), j.get(u.value.state) && j.get(u.value.state)(a, g);
    }
    function z(a, g) {
      var f;
      n.verbose && console.log("@onMouseMove", "userState:", a, u.value.state, g, (f = g == null ? void 0 : g.annotation) == null ? void 0 : f.id), V.get(u.value.state) && V.get(u.value.state)(a, g);
    }
    function H(a) {
      n.verbose && console.log("@onMouseUp", "userState:", u.value.state), R.get(u.value.state) && R.get(u.value.state)(a);
    }
    function q(a, g) {
      n.verbose && console.log("@onMouseLeave", "userState:", u.value.state), o.value.updating && o.value.resetUpdate(), c.value.creating && c.value.resetCreating();
    }
    return j.set(
      _.IDLE,
      (a, g) => {
        if (g != null && g.annotation) {
          u.value.state = _.START_SELECT, u.value.payload = g;
          return;
        }
        if (g != null && g.startOffset) {
          u.value.state = _.START_CREATE, u.value.payload = g;
          return;
        }
      }
    ), R.set(_.START_SELECT, (a) => {
      n.verbose && console.log("annotation-select", u.value.payload.annotation), e("annotation-select", u.value.payload.annotation, a), u.value.reset();
    }), R.set(_.START_CREATE, (a) => {
      u.value.reset();
    }), V.set(
      _.START_CREATE,
      (a, g) => {
        if (n.allowCreate) {
          const f = g.startOffset + at(a.x, a.y).offset;
          if (c.value.startCreating(f), n.listenToOnCreateStart)
            n.verbose && console.log("*emit annotation-create-begin", c.value), e("annotation-create-begin", c.value);
          else {
            const l = {
              id: _e(),
              start: c.value.newStart,
              end: c.value.newStart,
              class: "annotation annotation--color-1",
              target: "span",
              active: !0,
              visible: !0
            };
            c.value.initAnnotation(l);
          }
          u.value.state = _.CREATING;
        }
      }
    ), V.set(
      _.CREATING,
      (a, g) => {
        const f = at(a.x, a.y);
        if (f) {
          const l = g.startOffset + f.offset;
          c.value.newStart <= l && (c.value.newEnd = l, n.listenToOnCreating ? (n.verbose && console.log("*emit annotation-creating", c.value), e("annotation-creating", c.value)) : c.value.updateCreating());
        }
      }
    ), R.set(_.CREATING, (a) => {
      n.verbose && console.log("*emit annotation-create-end", c.value), e("annotation-create-end", c.value), c.value.resetCreating();
    }), V.set(
      _.START_SELECT,
      (a, g) => {
        if (!n.allowEdit)
          return;
        const f = at(a.x, a.y);
        f && (o.value.startUpdating(
          u.value.payload.action,
          u.value.payload.startOffset + f.offset,
          u.value.payload.annotation,
          u.value.payload.annotation.end,
          u.value.payload.annotation.start,
          u.value.payload.annotation.end,
          u.value.payload.annotation.start
        ), n.listenToOnUpdateStart ? (n.verbose && console.log("*emit annotation-update-begin", o.value), e("annotation-update-begin", o.value)) : o.value.confirmStartUpdating());
      }
    ), V.set(
      _.UPDATING,
      (a, g) => {
        const f = at(a.x, a.y);
        let l = !1;
        if (f) {
          const i = g.startOffset + f.offset, m = i - o.value.handlePosition;
          switch (o.value.newStart = o.value.annotation.start, o.value.newEnd = o.value.annotation.end, o.value.action) {
            case "moveEnd":
              i >= o.value.annotation.start && (o.value.newEnd = i, l = !0);
              break;
            case "moveStart":
              i <= o.value.annotation.end && (o.value.newStart = i, l = !0);
              break;
            default:
            case "move":
              o.value.newStart != o.value.origStart + m && (o.value.newStart = o.value.origStart + m, o.value.newEnd = o.value.origEnd + m, l = !0);
              break;
          }
          l && (n.listenToOnUpdating ? (n.verbose && console.log("*emit annotation-updating", o.value), e("annotation-updating", o.value)) : o.value.confirmUpdate());
        }
      }
    ), R.set(_.UPDATING, (a) => {
      n.verbose && console.log("*emit annotation-update-end", o.value), e("annotation-update-end", o.value), o.value.resetUpdate();
    }), V.set(
      _.IDLE,
      (a, g) => {
        if (g != null && g.annotation) {
          const f = g.annotation;
          h.value.hoveredAnnotations.some((l) => l.id === f.id) || (h.value.hoveredAnnotations.push(f), n.verbose && console.log("annotation-mouse-over", f.id), e("annotation-mouse-over", f, a));
        } else
          h.value.hoveredAnnotations.map((f) => {
            n.verbose && console.log("annotation-mouse-leave", f.id), e("annotation-mouse-leave", f, a);
          }), h.value.hoveredAnnotations = [];
      }
    ), (a, g) => S(p).annotatedLines ? (w(), y("div", {
      key: 0,
      class: F(S(U)),
      onMouseleave: g[0] || (g[0] = (f) => q()),
      onMouseup: g[1] || (g[1] = (f) => H(f))
    }, [
      (w(!0), y(I, null, tt(S(p).annotatedLines.value, (f) => {
        var l;
        return w(), y(I, { key: f }, [
          ht("div", Ae, [
            (w(!0), y(I, null, tt(f.gutter.annotations, (i) => (w(), y("span", {
              key: i,
              class: F(S(C)(i, f)),
              onClick: (m) => nt(m, { startOffset: 0, annotation: i })
            }, [
              i.label ? (w(), y("label", De, $(i.label), 1)) : k("", !0)
            ], 10, Oe))), 128))
          ]),
          f != null && f.gutter ? (w(), y("div", Te, $((l = f == null ? void 0 : f.gutter) == null ? void 0 : l.text), 1)) : k("", !0),
          ht("div", ke, [
            Ot(ae, {
              "component-id": S(n).componentId,
              line: f,
              "allow-edit": a.allowEdit,
              "allow-create": a.allowCreate,
              "annotation-classes": S(N),
              "word-part-classes": S(J),
              render: a.render,
              "mouse-down-handler": nt,
              "mouse-move-handler": z
            }, {
              "annotation-before": B((i) => [
                x(a.$slots, "annotation-before", {
                  annotation: i.annotation
                })
              ]),
              "annotation-after": B((i) => [
                x(a.$slots, "annotation-after", {
                  annotation: i.annotation
                })
              ]),
              _: 2
            }, 1032, ["component-id", "line", "allow-edit", "allow-create", "annotation-classes", "word-part-classes", "render"])
          ])
        ], 64);
      }), 128))
    ], 34)) : k("", !0);
  }
});
export {
  Ve as AnnotatedText
};
