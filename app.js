/*
 * Последняя батарея
 * Чистый JavaScript, без сборки и внешних зависимостей.
 *
 * В начале файла находятся все данные игры.
 * Логику ниже можно менять, не переписывая сюжет и координаты.
 */

// ============================================================
// 1. ДАННЫЕ ИГРЫ
// ============================================================

const GAME_DATA = {
  canvas: {
    width: 1280,
    height: 720
  },

  locations: {
    shelter: {
      id: "shelter",
      name: "Убежище",
      description: "Бетонная коробка, тусклая лампа, на полу — фляга; на восток — выход, других выходов нет.",
      background: "assets/locations/shelter.png",
      entities: ["flask", "exit_east"]
    },

    market: {
      id: "market",
      name: "Рынок",
      description: "Ржавые контейнеры, у стены раненый, за прилавком торговец, на земле фильтр и сломанный фонарь; на запад — обратно в убежище, на север — тяжёлая дверь с кодовым замком.",
      background: "assets/locations/market.png",
      entities: ["wounded", "trader", "filter", "lamp", "exit_west", "bunker_door", "exit_north"]
    },

    bunker: {
      id: "bunker",
      name: "Бункер",
      description: "Тяжёлая дверь позади, впереди — темнота; на юг — выход.",
      background: "assets/locations/bunker.png",
      entities: ["exit_south"]
    }
  },

  items: {
    flask: {
      id: "flask",
      name: "Фляга воды",
      description: "Фляга с водой, оставленная в убежище.",
      icon: "assets/items/flask.png",
      canTake: true,
      canDrop: true,
      usableTargets: ["wounded"]
    },

    filter: {
      id: "filter",
      name: "Фильтр",
      description: "Сменный фильтр. Нужен торговцу.",
      icon: "assets/items/filter.png",
      canTake: true,
      canDrop: true,
      usableTargets: []
    },

    lamp: {
      id: "lamp",
      name: "Сломанный фонарь",
      description: "Старый фонарь. Он не работает.",
      icon: "assets/items/lamp.png",
      canTake: true,
      canDrop: true,
      usableTargets: []
    },

    code: {
      id: "code",
      name: "Код",
      description: "Код от двери старого бункера.",
      icon: "assets/items/code.png",
      canTake: false,
      canDrop: false,
      usableTargets: ["bunker_door"]
    }
  },

  entities: {
    flask: {
      id: "flask",
      kind: "item",
      itemId: "flask",
      position: { x: 560, y: 540, w: 56, h: 56 },
      label: "Фляга"
    },

    filter: {
      id: "filter",
      kind: "item",
      itemId: "filter",
      position: { x: 510, y: 560, w: 56, h: 56 },
      label: "Фильтр"
    },

    lamp: {
      id: "lamp",
      kind: "item",
      itemId: "lamp",
      position: { x: 960, y: 580, w: 60, h: 60 },
      label: "Фонарь",
      atmosphereOnly: true
    },

    wounded: {
      id: "wounded",
      kind: "npc",
      position: { x: 200, y: 340, w: 170, h: 300 },
      label: "Раненый"
    },

    trader: {
      id: "trader",
      kind: "npc",
      position: { x: 800, y: 320, w: 190, h: 320 },
      label: "Торговец"
    },

    exit_east: {
      id: "exit_east",
      kind: "exit",
      target: "market",
      position: { x: 1160, y: 340, w: 200, h: 280 },
      label: "На восток → Рынок",
      sprite: "assets/sprites/exit_east.png"
    },

    exit_north: {
      id: "exit_north",
      kind: "exit",
      target: "bunker",
      position: { x: 555, y: 40, w: 170, h: 80 },
      label: "На север → Бункер",
      sprite: "assets/sprites/exit_north.png"
    },

    exit_west: {
      id: "exit_west",
      kind: "exit",
      target: "shelter",
      position: { x: 30, y: 340, w: 200, h: 280 },
      label: "На запад → Убежище",
      sprite: "assets/sprites/exit_west.png"
    },

    exit_south: {
      id: "exit_south",
      kind: "exit",
      target: "market",
      position: { x: 560, y: 620, w: 160, h: 100 },
      label: "На юг → Рынок",
      sprite: "assets/sprites/exit_south.png"
    },

    bunker_door: {
      id: "bunker_door",
      kind: "door",
      position: { x: 570, y: 50, w: 140, h: 240 },
      label: "Дверь в бункер",
      spriteLocked: "assets/sprites/door_locked.png",
      spriteOpen: "assets/sprites/door_open.png"
    }
  },

  npcs: {
    wounded: {
      id: "wounded",
      name: "Раненый",
      sprite: "assets/sprites/wounded.png",
      wateredSprite: "assets/sprites/wounded_watered.png",
      topics: [
        { id: "filters", label: "Спросить про фильтры" },
        { id: "code", label: "Спросить про код" }
      ]
    },

    trader: {
      id: "trader",
      name: "Торговец",
      sprite: "assets/sprites/trader.png",
      topics: [
        { id: "code", label: "Спросить про код" }
      ]
    }
  }
};

// ============================================================
// 2. СОСТОЯНИЕ
// ============================================================

const SAVE_KEY = "last-battery-save-v1";

const INITIAL_STATE = {
  location: "shelter",

  inventory: {},

  flags: {
    wounded_watered: false,
    bunker_door_open: false,
    game_won: false
  },

  selectedItem: null,
  dialogNpc: null,
  messages: [],
  debug: false,
  lastAction: "Игра начата",
  fallbackLevel: 0
};

let state = createInitialState();

function createInitialState() {
  return JSON.parse(JSON.stringify(INITIAL_STATE));
}

// ============================================================
// 3. DOM
// ============================================================

const DOM = {
  sceneViewport: document.getElementById("scene-viewport"),
  scene: document.getElementById("scene"),
  sceneFallback: document.getElementById("scene-fallback"),
  locationName: document.getElementById("location-name"),
  locationDescription: document.getElementById("location-description"),
  inventory: document.getElementById("inventory"),
  inventoryHint: document.getElementById("inventory-hint"),
  selectedItemLabel: document.getElementById("selected-item-label"),
  journal: document.getElementById("journal"),
  journalStatus: document.getElementById("journal-status"),
  debugToggle: document.getElementById("debug-toggle"),
  debugPanel: document.getElementById("debug-panel"),
  restartButton: document.getElementById("restart-button"),
  saveButton: document.getElementById("save-button"),
  loadButton: document.getElementById("load-button"),
  startOverlay: document.getElementById("start-overlay"),
  startNew: document.getElementById("start-new"),
  startContinue: document.getElementById("start-continue"),
  startSaveStatus: document.getElementById("start-save-status"),
  winOverlay: document.getElementById("win-overlay"),
  winRestart: document.getElementById("win-restart"),
  minimapImage: document.getElementById("minimap-image"),
  minimapFallback: document.getElementById("minimap-fallback")
};

// ============================================================
// 4. ИНИЦИАЛИЗАЦИЯ
// ============================================================

document.addEventListener("DOMContentLoaded", init);

function init() {
  bindGlobalEvents();
  setupAssetFallbacks();
  resizeScene();
  window.addEventListener("resize", resizeScene);
  window.addEventListener("keydown", handleKeyboardShortcuts);

  addMessage("Ты приходишь в себя в убежище. Если верить слухам, в бункере ещё есть батарея.");
  render();
  updateStartScreen();
}

function bindGlobalEvents() {
  DOM.restartButton.addEventListener("click", resetGame);
  DOM.winRestart.addEventListener("click", resetGame);
  DOM.saveButton.addEventListener("click", saveGame);
  DOM.loadButton.addEventListener("click", loadGame);
  DOM.startNew.addEventListener("click", () => {
    resetGame();
    hideStartScreen();
  });
  DOM.startContinue.addEventListener("click", () => {
    if (!loadGame()) {
      addMessage("Сохранение не найдено. Начинаем новую игру.");
    }
    hideStartScreen();
    render();
  });

  DOM.debugToggle.addEventListener("click", () => {
    state.debug = !state.debug;
    renderDebug();
    DOM.debugToggle.textContent = state.debug ? "DEBUG: ВКЛ" : "DEBUG: ВЫКЛ";
    DOM.debugToggle.classList.toggle("subtle", !state.debug);
  });

  DOM.scene.addEventListener("dragover", (event) => {
    if (state.selectedItem) {
      event.preventDefault();
    }
  });

  DOM.scene.addEventListener("drop", (event) => {
    event.preventDefault();

    const target = event.target.closest(".scene-entity");
    if (!target) {
      return;
    }

    const itemId = event.dataTransfer.getData("text/plain");
    if (itemId) {
      dispatchAction({
        type: "USE_ITEM",
        itemId,
        targetId: target.dataset.entityId
      });
    }
  });
}

function handleKeyboardShortcuts(event) {
  if (event.key === "Escape") {
    if (state.dialogNpc) {
      clearSceneDialog();
      render();
      return;
    }

    if (state.selectedItem) {
      state.selectedItem = null;
      render();
      return;
    }
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveGame();
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "o") {
    event.preventDefault();
    loadGame();
  }
}

function setupAssetFallbacks() {
  DOM.minimapImage.addEventListener("error", () => {
    DOM.minimapImage.hidden = true;
    DOM.minimapFallback.hidden = false;
  });

  const winImage = DOM.winOverlay.querySelector("img");
  winImage.addEventListener("error", () => {
    winImage.hidden = true;
  });
}

// ============================================================
// 5. ЕДИНЫЙ ОБРАБОТЧИК КОМАНД
// ============================================================

function dispatchAction(action) {
  state.lastAction = action.type;

  switch (action.type) {
    case "TAKE_ITEM":
      takeItem(action.itemId);
      break;

    case "TALK_NPC":
      openNpcDialog(action.npcId);
      break;

    case "SELECT_TOPIC":
      handleNpcTopic(action.npcId, action.topicId);
      break;

    case "MOVE":
      moveTo(action.locationId);
      break;

    case "USE_ITEM":
      useItemOnTarget(action.itemId, action.targetId);
      break;

    case "OPEN_DOOR":
      tryOpenDoor();
      break;

    case "DROP_ITEM":
      dropItem(action.itemId);
      break;

    case "RESET_GAME":
      resetGame();
      break;

    default:
      addMessage("Неизвестное действие.");
  }

  render();
  if (action.type !== "RESET_GAME") {
    saveGame(true);
  }
}

// ============================================================
// 6. ПРЕДМЕТЫ
// ============================================================

function takeItem(itemId) {
  const item = GAME_DATA.items[itemId];

  if (!item || !item.canTake) {
    addMessage("Этот предмет нельзя взять.");
    return;
  }

  const location = GAME_DATA.locations[state.location];
  const entity = location.entities
    .map((id) => GAME_DATA.entities[id])
    .find((candidate) => candidate.itemId === itemId);

  if (!entity) {
    addMessage("Предмета здесь нет.");
    return;
  }

  addInventory(itemId, 1);
  removeEntityFromLocation(entity.id);

  addMessage("Взято: " + item.name + ".");
}

function addInventory(itemId, amount) {
  state.inventory[itemId] = (state.inventory[itemId] || 0) + amount;
}

function removeInventory(itemId, amount) {
  const current = state.inventory[itemId] || 0;

  if (current < amount) {
    return false;
  }

  state.inventory[itemId] = current - amount;

  if (state.inventory[itemId] <= 0) {
    delete state.inventory[itemId];
  }

  return true;
}

function hasItem(itemId, amount = 1) {
  return (state.inventory[itemId] || 0) >= amount;
}

function removeEntityFromLocation(entityId) {
  const location = GAME_DATA.locations[state.location];

  location.entities = location.entities.filter((id) => id !== entityId);
}

function dropItem(itemId) {
  const item = GAME_DATA.items[itemId];

  if (!item || !item.canDrop) {
    addMessage("Этот предмет нельзя выбросить.");
    return;
  }

  if (!hasItem(itemId)) {
    addMessage("Предмета нет в инвентаре.");
    return;
  }

  removeInventory(itemId, 1);

  const existingEntity = GAME_DATA.locations[state.location].entities
    .map((id) => GAME_DATA.entities[id])
    .find((entity) => entity.itemId === itemId);

  if (!existingEntity) {
    addEntityToCurrentLocation(itemId);
  }

  state.selectedItem = null;
  addMessage("Предмет возвращён на сцену.");
}

function addEntityToCurrentLocation(itemId) {
  const location = GAME_DATA.locations[state.location];

  if (!location.entities.includes(itemId)) {
    location.entities.push(itemId);
  }
}

// ============================================================
// 7. NPC И ДИАЛОГИ
// ============================================================

function openNpcDialog(npcId) {
  const npc = GAME_DATA.npcs[npcId];

  if (!npc) {
    addMessage("Здесь никого нет.");
    return;
  }

  state.selectedItem = null;
  state.dialogNpc = npcId;

  // Вместо отдельного модального окна используем компактное меню тем
  // прямо поверх сцены.
  renderNpcTopics(npcId);
}

function renderNpcTopics(npcId) {
  const npc = GAME_DATA.npcs[npcId];

  const existing = DOM.scene.querySelector(".npc-dialog");
  if (existing) {
    existing.remove();
  }

  const dialog = document.createElement("div");
  dialog.className = "npc-dialog";
  dialog.dataset.npcDialog = npcId;

  const title = document.createElement("div");
  title.className = "npc-dialog-title";
  title.textContent = npc.name;

  const subtitle = document.createElement("div");
  subtitle.className = "npc-dialog-subtitle";
  subtitle.textContent = "О чём спросить?";

  const topics = document.createElement("div");
  topics.className = "npc-dialog-topics";

  npc.topics.forEach((topic) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dialog-topic";
    button.textContent = topic.label;

    button.addEventListener("click", () => {
      dispatchAction({
        type: "SELECT_TOPIC",
        npcId,
        topicId: topic.id
      });
    });

    topics.appendChild(button);
  });

  const close = document.createElement("button");
  close.type = "button";
  close.className = "dialog-close";
  close.textContent = "Закрыть";
  close.addEventListener("click", clearSceneDialog);

  dialog.append(title, subtitle, topics, close);
  DOM.scene.appendChild(dialog);
}

function clearSceneDialog() {
  state.dialogNpc = null;
  const existing = DOM.scene.querySelector(".npc-dialog");
  if (existing) {
    existing.remove();
  }
}

function handleNpcTopic(npcId, topicId) {
  clearSceneDialog();

  if (npcId === "wounded") {
    if (topicId === "filters") {
      if (state.flags.wounded_watered) {
        addMessage("Раненый кивает: «Я уже отдал тебе фильтр».");
      } else {
        addMessage("Раненый: «У меня есть один, но мне нужна вода».");
      }
      return;
    }

    if (topicId === "code") {
      addMessage("Раненый: «Торговец знает. Спроси у него».");
      return;
    }
  }

  if (npcId === "trader" && topicId === "code") {
    if (!hasItem("filter", 2)) {
      addMessage("Торговец: «Принеси два фильтра — и код твой».");
      return;
    }

    removeInventory("filter", 2);
    addInventory("code", 1);
    addMessage("Торговец забирает оба фильтра. «Держи. Не потеряй».");
    return;
  }

  addMessage("На эту тему сейчас нечего сказать.");
}

// ============================================================
// 8. ПРИМЕНЕНИЕ ПРЕДМЕТОВ
// ============================================================

function useItemOnTarget(itemId, targetId) {
  if (!hasItem(itemId)) {
    addMessage("Предмета нет в инвентаре.");
    return;
  }

  const item = GAME_DATA.items[itemId];

  if (!item.usableTargets.includes(targetId)) {
    addMessage("Этот предмет здесь не применяется.");
    state.selectedItem = null;
    return;
  }

  if (itemId === "flask" && targetId === "wounded") {
    giveWaterToWounded();
    return;
  }

  if (itemId === "code" && targetId === "bunker_door") {
    openBunkerDoor();
    return;
  }

  addMessage("Здесь это не работает.");
  state.selectedItem = null;
}

function giveWaterToWounded() {
  if (state.flags.wounded_watered) {
    addMessage("Раненый уже выпил воду.");
    state.selectedItem = null;
    return;
  }

  removeInventory("flask", 1);
  state.flags.wounded_watered = true;
  addInventory("filter", 1);
  state.selectedItem = null;

  addMessage("Раненый жадно пьёт и протягивает вам фильтр.");
}

function openBunkerDoor() {
  if (state.flags.bunker_door_open) {
    addMessage("Дверь уже открыта.");
    state.selectedItem = null;
    return;
  }

  state.flags.bunker_door_open = true;
  removeInventory("code", 1);
  state.selectedItem = null;

  addMessage("Код принят. Тяжёлая дверь открывается.");
}

// ============================================================
// 9. ДВЕРЬ И ПЕРЕМЕЩЕНИЕ
// ============================================================

function tryOpenDoor() {
  if (state.flags.bunker_door_open) {
    addMessage("Дверь уже открыта.");
    return;
  }

  if (hasItem("code")) {
    openBunkerDoor();
    return;
  }

  addMessage("Дверь заперта. Нужен код.");
}

function moveTo(locationId) {
  if (!GAME_DATA.locations[locationId]) {
    addMessage("Такой локации не существует.");
    return;
  }

  if (state.location === "market" && locationId === "bunker") {
    if (!state.flags.bunker_door_open) {
      addMessage("Дверь заперта.");
      shakeDoor();
      return;
    }
  }

  state.location = locationId;
  state.selectedItem = null;
  clearSceneDialog();

  if (locationId === "bunker") {
    state.flags.game_won = true;
    addMessage("Ты входишь в бункер. Здесь действительно есть работающая батарея.");
    setTimeout(showWinScreen, 500);
  }
}

function shakeDoor() {
  const door = DOM.scene.querySelector('[data-entity-id="bunker_door"]');

  if (!door) {
    return;
  }

  door.classList.remove("locked");
  void door.offsetWidth;
  door.classList.add("locked");
}

// ============================================================
// 10. РЕНДЕР
// ============================================================

function render() {
  renderScene();
  renderInventory();
  renderJournal();
  renderDebug();
  updateLocationText();

  if (state.flags.game_won) {
    // Оверлей показывается с небольшой задержкой после входа.
    // Если пользователь обновил сцену, состояние всё равно остаётся победным.
  }
}

function renderScene() {
  DOM.scene.innerHTML = "";
  DOM.sceneFallback.hidden = true;
  clearSceneDialog();

  const location = GAME_DATA.locations[state.location];

  state.fallbackLevel = 0;

  const background = document.createElement("img");
  background.className = "scene-background";
  background.src = location.background;
  background.alt = "";
  background.addEventListener("error", () => {
    background.remove();
    renderSceneFallback();
  }, { once: true });

  DOM.scene.appendChild(background);

  location.entities.forEach((entityId) => {
    const entity = GAME_DATA.entities[entityId];

    if (!entity) {
      return;
    }

    renderEntity(entity);
  });

  if (state.dialogNpc && location.entities.includes(state.dialogNpc)) {
    renderNpcTopics(state.dialogNpc);
  }

  // Если фон не успел загрузиться, fallback переключится обработчиком error.
  // Для file:// это работает так же, как при обычном HTTP.
}

function renderEntity(entity) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "scene-entity";
  button.dataset.entityId = entity.id;
  button.dataset.kind = entity.kind;
  button.style.left = entity.position.x + "px";
  button.style.top = entity.position.y + "px";
  button.style.width = entity.position.w + "px";
  button.style.height = entity.position.h + "px";

  let sprite = entity.sprite || null;

  if (entity.kind === "npc") {
    const npc = GAME_DATA.npcs[entity.id];

    if (entity.id === "wounded" && state.flags.wounded_watered) {
      sprite = npc.wateredSprite;
    } else {
      sprite = npc.sprite;
    }
  }

  if (entity.kind === "door") {
    sprite = state.flags.bunker_door_open
      ? entity.spriteOpen
      : entity.spriteLocked;

    button.classList.add(state.flags.bunker_door_open ? "interactive" : "interactive");
  }

  if (entity.kind === "item") {
    sprite = GAME_DATA.items[entity.itemId].icon;
    button.classList.add("pickable", "interactive");

    // Ложный предмет намеренно не получает специальной подсказки.
    if (entity.atmosphereOnly) {
      button.classList.remove("pickable");
      button.style.filter = "none";
      button.style.animation = "none";
    }
  }

  if (entity.kind === "exit") {
    button.classList.add("interactive");
  }

  if (sprite) {
    const image = document.createElement("img");
    image.src = sprite;
    image.alt = entity.label;
    image.addEventListener("error", () => {
      image.replaceWith(createInlineSvgFallback(entity));
      state.fallbackLevel = Math.max(state.fallbackLevel, 1);
      renderDebug();
    }, { once: true });

    button.appendChild(image);
  } else {
    button.appendChild(createInlineSvgFallback(entity));
    state.fallbackLevel = Math.max(state.fallbackLevel, 1);
  }

  const label = document.createElement("span");
  label.className = "entity-label";
  label.textContent = entity.label;
  button.appendChild(label);

  attachEntityAction(button, entity);

  DOM.scene.appendChild(button);
}

function attachEntityAction(button, entity) {
  button.addEventListener("click", () => {
    if (state.selectedItem) {
      if (entity.kind === "npc" || entity.kind === "door") {
        dispatchAction({
          type: "USE_ITEM",
          itemId: state.selectedItem,
          targetId: entity.id
        });
        return;
      }

      addMessage("Этот предмет здесь не применяется.");
      return;
    }

    if (entity.kind === "item") {
      dispatchAction({
        type: "TAKE_ITEM",
        itemId: entity.itemId
      });
      return;
    }

    if (entity.kind === "npc") {
      dispatchAction({
        type: "TALK_NPC",
        npcId: entity.id
      });
      return;
    }

    if (entity.kind === "exit") {
      dispatchAction({
        type: "MOVE",
        locationId: entity.target
      });
      return;
    }

    if (entity.kind === "door") {
      if (state.flags.bunker_door_open) {
        dispatchAction({
          type: "MOVE",
          locationId: "bunker"
        });
      } else {
        dispatchAction({
          type: "OPEN_DOOR"
        });
      }
    }
  });
}

function createInlineSvgFallback(entity) {
  const wrapper = document.createElement("div");
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";
  wrapper.innerHTML = createFallbackSvg(entity);
  return wrapper.firstElementChild;
}

function createFallbackSvg(entity) {
  const title = escapeHtml(entity.label);
  const color = entity.kind === "door"
    ? "#a33a2a"
    : entity.kind === "npc"
      ? "#6f8f6a"
      : entity.kind === "item"
        ? "#c9a227"
        : "#6b6154";

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
      <rect x="2" y="2" width="96" height="96" fill="#1a1712" stroke="${color}" stroke-width="2"/>
      <circle cx="50" cy="42" r="16" fill="none" stroke="${color}" stroke-width="3"/>
      <path d="M25 78 L38 58 L50 70 L62 54 L76 78" fill="none" stroke="${color}" stroke-width="3"/>
      <text x="50" y="92" text-anchor="middle" fill="#d8cfc0" font-size="8" font-family="monospace">${title}</text>
    </svg>
  `;
}

function renderSceneFallback() {
  const location = GAME_DATA.locations[state.location];

  state.fallbackLevel = 1;

  DOM.sceneFallback.hidden = false;
  DOM.sceneFallback.textContent =
    location.name +
    "\n\n" +
    location.description +
    "\n\n" +
    "Изображение недоступно\n\n" +
    location.entities
      .map((id) => GAME_DATA.entities[id]?.label || id)
      .join(" · ");

  // SVG/HTML-заглушки сущностей остаются на сцене.
  renderDebug();
}

// ============================================================
// 11. ИНВЕНТАРЬ
// ============================================================

function renderInventory() {
  DOM.inventory.innerHTML = "";

  const itemIds = Object.keys(GAME_DATA.items);

  itemIds.forEach((itemId) => {
    const item = GAME_DATA.items[itemId];
    const count = state.inventory[itemId] || 0;

    const slot = document.createElement("div");
    slot.className = "inventory-slot";

    if (count === 0) {
      slot.classList.add("empty");
    }

    if (state.selectedItem === itemId) {
      slot.classList.add("selected");
    }

    slot.title = item.description;

    if (count > 0) {
      const image = document.createElement("img");
      image.src = item.icon;
      image.alt = item.name;
      image.addEventListener("error", () => {
        image.replaceWith(createInlineSvgFallback({
          label: item.name,
          kind: "item"
        }));
      }, { once: true });

      slot.appendChild(image);

      const name = document.createElement("span");
      name.className = "inventory-name";
      name.textContent = item.name;
      slot.appendChild(name);

      const countBadge = document.createElement("span");
      countBadge.className = "inventory-count";
      countBadge.textContent = count;
      slot.appendChild(countBadge);

      if (item.canDrop) {
        const drop = document.createElement("button");
        drop.type = "button";
        drop.className = "drop-button";
        drop.textContent = "Выбросить";
        drop.addEventListener("click", (event) => {
          event.stopPropagation();
          dispatchAction({
            type: "DROP_ITEM",
            itemId
          });
        });
        slot.appendChild(drop);
      }

      slot.addEventListener("click", () => {
        toggleSelectedItem(itemId);
      });

      slot.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", itemId);
      });

      slot.draggable = true;
    } else {
      slot.innerHTML = '<span class="inventory-name">—</span>';
    }

    DOM.inventory.appendChild(slot);
  });

  DOM.selectedItemLabel.textContent = state.selectedItem
    ? "Выбрано: " + GAME_DATA.items[state.selectedItem].name
    : "Ничего не выбрано";

  DOM.inventoryHint.textContent = state.selectedItem
    ? "Выберите подсвеченную цель на сцене или перетащите предмет на неё."
    : "Нажмите на предмет, чтобы выбрать цель. Можно также перетащить предмет на сцену.";

  updateTargetHighlighting();
}

function toggleSelectedItem(itemId) {
  state.selectedItem = state.selectedItem === itemId ? null : itemId;
  renderInventory();
  updateTargetHighlighting();
}

function updateTargetHighlighting() {
  const targets = new Set();

  if (state.selectedItem) {
    const item = GAME_DATA.items[state.selectedItem];
    item.usableTargets.forEach((targetId) => targets.add(targetId));
  }

  DOM.scene.querySelectorAll(".scene-entity").forEach((entity) => {
    const id = entity.dataset.entityId;

    entity.classList.remove("selected-target", "invalid-target");

    if (!state.selectedItem) {
      return;
    }

    if (targets.has(id)) {
      entity.classList.add("selected-target");
    } else {
      entity.classList.add("invalid-target");
    }
  });
}

// ============================================================
// 12. ЖУРНАЛ
// ============================================================

function addMessage(message) {
  state.messages.unshift({
    id: Date.now() + Math.random(),
    text: message
  });

  state.messages = state.messages.slice(0, 6);

  renderJournal();
}

function renderJournal() {
  DOM.journal.innerHTML = "";

  state.messages.forEach((message, index) => {
    const element = document.createElement("div");
    element.className = "journal-message";
    element.textContent = message.text;
    element.dataset.messageIndex = String(index);
    DOM.journal.appendChild(element);
  });

  DOM.journalStatus.textContent = state.messages.length
    ? "Последние события"
    : "Готово";
}

// ============================================================
// 13. ТЕКСТ ЛОКАЦИИ
// ============================================================

function updateLocationText() {
  const location = GAME_DATA.locations[state.location];

  DOM.locationName.textContent = location.name;
  DOM.locationDescription.textContent = location.description;
}

// ============================================================
// 14. DEBUG
// ============================================================

function renderDebug() {
  DOM.debugPanel.hidden = !state.debug;

  if (!state.debug) {
    return;
  }

  const inventory = Object.entries(state.inventory)
    .map(([id, count]) => id + ": " + count)
    .join(", ") || "пусто";

  DOM.debugPanel.textContent = [
    "DEBUG",
    "location: " + state.location,
    "inventory: " + inventory,
    "wounded_watered: " + state.flags.wounded_watered,
    "bunker_door_open: " + state.flags.bunker_door_open,
    "game_won: " + state.flags.game_won,
    "selected: " + (state.selectedItem || "none"),
    "last action: " + state.lastAction,
    "fallback: " + state.fallbackLevel
  ].join("\n");
}

// ============================================================
// 15. ПОБЕДА
// ============================================================

function showWinScreen() {
  if (!state.flags.game_won) {
    return;
  }

  DOM.winOverlay.hidden = false;
  hideStartScreen();
}

function hideWinScreen() {
  DOM.winOverlay.hidden = true;
}

function saveGame(silent = false) {
  try {
    const payload = {
      version: 1,
      state: {
        location: state.location,
        inventory: state.inventory,
        flags: state.flags,
        selectedItem: null,
        messages: state.messages
      }
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    updateStartScreen();

    if (!silent) {
      addMessage("Игра сохранена.");
      render();
    }

    return true;
  } catch (error) {
    if (!silent) {
      addMessage("Не удалось сохранить игру.");
      render();
    }
    return false;
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);

    if (!raw) {
      if (!DOM.startSaveStatus) {
        return false;
      }
      return false;
    }

    const payload = JSON.parse(raw);

    if (!payload || payload.version !== 1 || !payload.state) {
      throw new Error("Invalid save");
    }

    const restored = createInitialState();
    restored.location = GAME_DATA.locations[payload.state.location]
      ? payload.state.location
      : "shelter";
    restored.inventory = payload.state.inventory || {};
    restored.flags = {
      ...restored.flags,
      ...(payload.state.flags || {})
    };
    restored.messages = Array.isArray(payload.state.messages)
      ? payload.state.messages.slice(0, 6)
      : [];

    state = restored;
    restoreLocationEntities();
    hideWinScreen();
    clearSceneDialog();
    addMessage("Сохранение загружено.");
    render();
    updateStartScreen();
    return true;
  } catch (error) {
    localStorage.removeItem(SAVE_KEY);
    return false;
  }
}

function hasSaveGame() {
  try {
    return Boolean(localStorage.getItem(SAVE_KEY));
  } catch (error) {
    return false;
  }
}

function updateStartScreen() {
  const hasSave = hasSaveGame();
  DOM.startContinue.disabled = !hasSave;
  DOM.startContinue.classList.toggle("subtle", !hasSave);
  DOM.startSaveStatus.textContent = hasSave
    ? "Сохранение найдено"
    : "Сохранений пока нет";
}

function hideStartScreen() {
  DOM.startOverlay.hidden = true;
}

function showStartScreen() {
  DOM.startOverlay.hidden = false;
  updateStartScreen();
}

function resetGame() {
  state = createInitialState();

  // Важно: исходные массивы локаций могли быть изменены во время игры.
  // Поэтому восстанавливаем их из первоначальных данных.
  restoreLocationEntities();

  hideWinScreen();
  clearSceneDialog();

  addMessage("Игра начата заново.");
  render();
  saveGame(true);
  updateStartScreen();
}

function restoreLocationEntities() {
  GAME_DATA.locations.shelter.entities = ["flask", "exit_east"];
  GAME_DATA.locations.market.entities = [
    "wounded",
    "trader",
    "filter",
    "lamp",
    "exit_west",
    "bunker_door",
    "exit_north"
  ];
  GAME_DATA.locations.bunker.entities = ["exit_south"];
}

// ============================================================
// 16. МАСШТАБ СЦЕНЫ
// ============================================================

function resizeScene() {
  const rect = DOM.sceneViewport.getBoundingClientRect();

  if (!rect.width || !rect.height) {
    return;
  }

  const scale = Math.min(
    rect.width / GAME_DATA.canvas.width,
    rect.height / GAME_DATA.canvas.height
  );

  DOM.scene.style.setProperty("--scene-scale", scale.toFixed(5));
}

// ============================================================
// 17. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
