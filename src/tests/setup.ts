// Mock ResizeObserver for Recharts
const MockResizeObserver = class {
    observe() { }
    unobserve() { }
    disconnect() { }
};

window.ResizeObserver = MockResizeObserver; 