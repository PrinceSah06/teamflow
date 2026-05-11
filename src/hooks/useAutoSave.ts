import { useEffect, useRef } from "react";

type AutoSavePayload = {
  title: string;
  content: string;
};

export const useAutoSave = (
  noteId: string | null,
  payload: AutoSavePayload,
  onSave: (noteId: string, payload: AutoSavePayload) => Promise<void>,
) => {
  const hasMounted = useRef(false);
  const lastNoteId = useRef<string | null>(null);

  useEffect(() => {
    if (!noteId) {
      return;
    }

    if (!hasMounted.current || lastNoteId.current !== noteId) {
      hasMounted.current = true;
      lastNoteId.current = noteId;
      return;
    }

    const timer = window.setTimeout(() => {
      void onSave(noteId, payload);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [noteId, payload.title, payload.content, onSave]);
};
