const STORAGE_KEY = "vanilla-list-app-state-v1";
const HISTORY_LIMIT = 25;

const defaultItems = ["Item 1", "Item 2", "Item 3", "Item 4"].map((text) => ({
  id: createId(),
  text,
}));

const state = loadState();
const refs = getRefs();

render();
bindEvents();

function getRefs() {
  return {
    itemsList: document.querySelector("#items-list"),
    openAddModalBtn: document.querySelector("#open-add-modal-btn"),
    deleteBtn: document.querySelector("#delete-btn"),
    undoBtn: document.querySelector("#undo-btn"),
    modalRoot: document.querySelector("#modal-root"),
    modalBackdrop: document.querySelector("#modal-backdrop"),
    addForm: document.querySelector("#add-form"),
    itemInput: document.querySelector("#item-input"),
    cancelAddBtn: document.querySelector("#cancel-add-btn"),
    submitAddBtn: document.querySelector("#submit-add-btn"),
  };
}

function bindEvents() {
  refs.openAddModalBtn.addEventListener("click", openModal);
  refs.cancelAddBtn.addEventListener("click", closeModal);
  refs.modalBackdrop.addEventListener("click", closeModal);

  refs.addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addItem(refs.itemInput.value);
  });

  refs.itemInput.addEventListener("input", () => {
    refs.submitAddBtn.disabled = refs.itemInput.value.trim().length === 0;
  });

  refs.deleteBtn.addEventListener("click", deleteSelectedItems);
  refs.undoBtn.addEventListener("click", undoLastChange);

  refs.itemsList.addEventListener("click", (event) => {
    const itemButton = event.target.closest("button[data-id]");

    if (!itemButton) {
      return;
    }

    const id = itemButton.dataset.id;

    if (event.ctrlKey || event.metaKey) {
      toggleSelection(id);
      return;
    }

    if (state.selectedIds.length === 1 && state.selectedIds[0] === id) {
      clearSelection();
      return;
    }

    state.selectedIds = [id];
    saveState();
    render();
  });

  refs.itemsList.addEventListener("dblclick", (event) => {
    const itemButton = event.target.closest("button[data-id]");

    if (!itemButton) {
      return;
    }

    deleteById(itemButton.dataset.id);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isModalOpen()) {
      closeModal();
    }
  });
}

function loadState() {
  const fallback = {
    items: defaultItems,
    selectedIds: [],
    history: [],
  };

  try {
    const serialized = localStorage.getItem(STORAGE_KEY);

    if (!serialized) {
      return fallback;
    }

    const parsed = JSON.parse(serialized);

    if (!Array.isArray(parsed.items) || !Array.isArray(parsed.selectedIds) || !Array.isArray(parsed.history)) {
      return fallback;
    }

    return {
      items: parsed.items.filter(isValidItem),
      selectedIds: parsed.selectedIds.filter((id) => parsed.items.some((item) => item.id === id)),
      history: parsed.history
        .filter((entry) => Array.isArray(entry))
        .map((entry) => entry.filter(isValidItem))
        .slice(-HISTORY_LIMIT),
    };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      items: state.items,
      selectedIds: state.selectedIds,
      history: state.history,
    }),
  );
}

function render() {
  refs.itemsList.innerHTML = "";

  if (state.items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "emptyState";
    empty.textContent = "No items yet. Add one to start.";
    refs.itemsList.append(empty);
  } else {
    const fragment = document.createDocumentFragment();

    state.items.forEach((item) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      const isSelected = state.selectedIds.includes(item.id);

      button.type = "button";
      button.dataset.id = item.id;
      button.className = isSelected ? "item itemSelected" : "item";
      button.textContent = item.text;

      li.append(button);
      fragment.append(li);
    });

    refs.itemsList.append(fragment);
  }

  refs.deleteBtn.disabled = state.selectedIds.length === 0;
  refs.undoBtn.disabled = state.history.length === 0;
  refs.submitAddBtn.disabled = refs.itemInput.value.trim().length === 0;
}

function openModal() {
  refs.modalRoot.classList.remove("hidden");
  refs.modalRoot.setAttribute("aria-hidden", "false");
  refs.itemInput.value = "";
  refs.submitAddBtn.disabled = true;
  refs.itemInput.focus();
}

function closeModal() {
  refs.modalRoot.classList.add("hidden");
  refs.modalRoot.setAttribute("aria-hidden", "true");
  refs.itemInput.value = "";
  refs.submitAddBtn.disabled = true;
}

function isModalOpen() {
  return !refs.modalRoot.classList.contains("hidden");
}

function addItem(rawText) {
  const text = rawText.trim();

  if (!text) {
    return;
  }

  pushHistory();
  state.items.push({ id: createId(), text });
  state.selectedIds = [];
  saveState();
  render();
  closeModal();
}

function deleteSelectedItems() {
  if (state.selectedIds.length === 0) {
    return;
  }

  pushHistory();
  const selectedSet = new Set(state.selectedIds);
  state.items = state.items.filter((item) => !selectedSet.has(item.id));
  state.selectedIds = [];
  saveState();
  render();
}

function deleteById(id) {
  const exists = state.items.some((item) => item.id === id);

  if (!exists) {
    return;
  }

  pushHistory();
  state.items = state.items.filter((item) => item.id !== id);
  state.selectedIds = state.selectedIds.filter((selectedId) => selectedId !== id);
  saveState();
  render();
}

function undoLastChange() {
  const previousItems = state.history.pop();

  if (!previousItems) {
    return;
  }

  state.items = previousItems;
  state.selectedIds = [];
  saveState();
  render();
}

function toggleSelection(id) {
  if (state.selectedIds.includes(id)) {
    state.selectedIds = state.selectedIds.filter((selectedId) => selectedId !== id);
  } else {
    state.selectedIds = [...state.selectedIds, id];
  }

  saveState();
  render();
}

function clearSelection() {
  state.selectedIds = [];
  saveState();
  render();
}

function pushHistory() {
  state.history.push(state.items.map((item) => ({ ...item })));

  if (state.history.length > HISTORY_LIMIT) {
    state.history = state.history.slice(-HISTORY_LIMIT);
  }
}

function isValidItem(item) {
  return item && typeof item.id === "string" && typeof item.text === "string";
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
