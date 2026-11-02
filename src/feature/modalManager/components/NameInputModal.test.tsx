import { fireEvent, render, screen } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NameInputModal } from "./NameInputModal";
import { useEditorStore } from "@/feature/ide/state/ide.store";
import { EditorFile } from "@/feature/ide/state/ide.types";

const makeFile = (id: string, name: string): EditorFile => ({
  id,
  name,
  path: `file://${name}`,
  type: "json",
  language: "json",
  lastModified: 1,
  cursor: null,
  cursorOffset: 0,
  content: "{}",
  isClosed: true,
});

const renderModal = (modal: React.ReactElement) =>
  render(modal, {
    wrapper: ({ children }) => (
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    ),
  });

describe("NameInputModal", () => {
  beforeEach(() => {
    useEditorStore.setState({
      files: { current: makeFile("current", "one.json") },
    });
  });

  it("prefills the current name and submits it from the keyboard as a no-op candidate", () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    renderModal(
      <NameInputModal
        isOpen
        initialName="one.json"
        excludedFileId="current"
        onSubmit={onSubmit}
        onClose={onClose}
      />,
    );

    const input = screen.getByPlaceholderText("Enter file name...");
    expect(input).toHaveValue("one.json");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSubmit).toHaveBeenCalledWith("one.json");
    expect(onClose).toHaveBeenCalled();
  });

  it("rejects a collision with a closed workspace file", () => {
    const onSubmit = vi.fn();
    renderModal(
      <NameInputModal isOpen onSubmit={onSubmit} onClose={vi.fn()} />,
    );

    const input = screen.getByPlaceholderText("Enter file name...");
    fireEvent.change(input, { target: { value: " one.json " } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText('A file with the name "one.json" already exists'),
    ).toBeInTheDocument();
  });

  it("rejects an empty filename", () => {
    const onSubmit = vi.fn();
    renderModal(
      <NameInputModal isOpen onSubmit={onSubmit} onClose={vi.fn()} />,
    );

    fireEvent.keyDown(screen.getByPlaceholderText("Enter file name..."), {
      key: "Enter",
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Name cannot be empty")).toBeInTheDocument();
  });

  it("cancels from Escape without submitting", () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    renderModal(
      <NameInputModal isOpen onSubmit={onSubmit} onClose={onClose} />,
    );

    fireEvent.keyDown(screen.getByPlaceholderText("Enter file name..."), {
      key: "Escape",
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
