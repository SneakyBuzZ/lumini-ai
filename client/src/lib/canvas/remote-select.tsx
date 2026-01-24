type SelectUpdateEvent = {
  type: "selection:update";
  userId: string;
  shapeIds: string[];
};

type SelectClearEvent = {
  type: "selection:clear";
  userId: string;
};

const selections = new Map<string, string[]>();

export function handleSelectionEvent(
  event: SelectUpdateEvent | SelectClearEvent,
) {
  if (event.type === "selection:update") {
    selections.set(event.userId, event.shapeIds);
  }

  if (event.type === "selection:clear") {
    selections.delete(event.userId);
  }
}

export function getSelectionSnapshot() {
  return new Map(selections);
}
