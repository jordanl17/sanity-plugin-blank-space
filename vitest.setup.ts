// sanity@5.17.1 uses `"CSS" in globalThis && typeof CSS.supports == "function"`.
// In vitest's jsdom environment, `CSS` is defined as undefined (key exists, value undefined),
// which causes `CSS.supports` to throw. Provide a minimal CSS stub to avoid this.
if (!globalThis.CSS) {
  Object.defineProperty(globalThis, 'CSS', {
    value: {supports: () => false},
    writable: true,
    configurable: true,
  })
}
