// intersect.js
export const IntersectDirective = {
  mounted(el, binding) {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: binding.arg ? parseFloat(binding.arg) : 0.1,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          binding.value(entry);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(el);

    el._observer = observer; // store it for later
  },

  unmounted(el) {
    if (el._observer) {
      el._observer.disconnect();
      delete el._observer;
    }
  },
};
