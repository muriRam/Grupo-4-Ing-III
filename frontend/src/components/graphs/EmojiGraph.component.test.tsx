import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("chart.js", () => ({
  Chart: class {
    constructor() {}
    destroy() {}
    static register() {}
  },
  registerables: [],
}));

import { EmojiGraph } from "./EmojiGraph.component";

const mockData = [
  { emoji: "�", count: 10 },
  { emoji: "😊", count: 7 },
];

describe("EmojiGraph", () => {
  it("renderiza un canvas donde se dibuja el gráfico", () => {
    const { container } = render(<EmojiGraph data={mockData} />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("al desmontarse limpia el gráfico sin lanzar errores", () => {
    const { unmount } = render(<EmojiGraph data={mockData} />);
    expect(() => unmount()).not.toThrow();
  });
});
