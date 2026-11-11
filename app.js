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
      entities: ["wounded", "trader", "filter", "lamp", "exit_west", "bunker_door"]
    },

    bunker: {
      id: "bunker",
      name: "Бункер",
      description: "Тяжёлая дверь позади, впереди — тёмный зал с огромной машиной; на юг — выход.",
      background: "assets/locations/bunker.png",
      entities: ["bunker_machine", "bunker_panel", "bunker_battery", "bunker_comms_exit", "exit_south"]
    },

    comms: {
      id: "comms",
      name: "Старый узел связи",
      description: "Заброшенная радиорубка. Старый передатчик молчит, а единственный человек здесь будто ждал именно тебя.",
      background: "assets/locations/comms.png",
      entities: ["radio_operator", "radio_transmitter", "radio_cabinet", "radio_log", "exit_comms_bunker"]
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
      description: "Старый фонарь. Он не работает, но его можно забрать с собой.",
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
    },

    radio_coil: {
      id: "radio_coil",
      name: "Катушка связи",
      description: "Старая катушка с контактами. Подходит к разъёму радиопередатчика.",
      icon: "assets/items/radio_coil.png",
      canTake: true,
      canDrop: true,
      usableTargets: ["radio_transmitter"]
    }
  },

  entities: {
    flask: {
      id: "flask",
      kind: "item",
      itemId: "flask",
      position: { x: 535, y: 500, w: 110, h: 110 },
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
      label: "Фонарь"
    },

    wounded: {
      id: "wounded",
      kind: "npc",
      position: { x: 135, y: 345, w: 255, h: 300 },
      label: "Раненый"
    },

    trader: {
      id: "trader",
      kind: "npc",
      position: { x: 650, y: 250, w: 255, h: 320 },
      label: "Торговец"
    },

    exit_east: {
      id: "exit_east",
      kind: "exit",
      target: "market",
      position: { x: 1040, y: 95, w: 220, h: 500 },
      label: "Выйти через дверь → Рынок",
      hotspotOnly: true
    },

    exit_north: {
      id: "exit_north",
      kind: "exit",
      target: "bunker",
      position: { x: 500, y: 105, w: 200, h: 255 },
      label: "Через дверь → Бункер",
      hotspotOnly: true
    },

    exit_west: {
      id: "exit_west",
      kind: "exit",
      target: "shelter",
      position: { x: 0, y: 300, w: 185, h: 390 },
      label: "Через проход → Убежище",
      hotspotOnly: true
    },

    exit_south: {
      id: "exit_south",
      kind: "exit",
      target: "market",
      position: { x: 490, y: 600, w: 300, h: 120 },
      label: "Через дверь → Рынок",
      hotspotOnly: true
    },

    bunker_door: {
      id: "bunker_door",
      kind: "door",
      position: { x: 365, y: 185, w: 205, h: 320 },
      label: "Дверь в бункер",
      hotspotOnly: true,
      spriteLocked: "assets/sprites/door_locked.png",
      spriteOpen: "assets/sprites/door_open.png"
    },

    bunker_machine: {
      id: "bunker_machine",
      kind: "inspect",
      position: { x: 720, y: 205, w: 310, h: 250 },
      label: "Старая машина",
      sprite: "assets/sprites/bunker_machine.png"
    },

    bunker_panel: {
      id: "bunker_panel",
      kind: "inspect",
      position: { x: 925, y: 500, w: 145, h: 105 },
      label: "Панель управления",
      sprite: "assets/sprites/bunker_panel.png"
    },

    bunker_battery: {
      id: "bunker_battery",
      kind: "inspect",
      position: { x: 300, y: 380, w: 180, h: 180 },
      label: "Последняя батарея",
      sprite: "assets/sprites/bunker_battery.png"
    },

    bunker_comms_exit: {
      id: "bunker_comms_exit",
      kind: "exit",
      target: "comms",
      position: { x: 1020, y: 150, w: 180, h: 300 },
      label: "Войти в старый узел связи",
      hotspotOnly: true
    },

    radio_operator: {
      id: "radio_operator",
      kind: "npc",
      position: { x: 120, y: 310, w: 260, h: 330 },
      label: "Радист"
    },

    radio_transmitter: {
      id: "radio_transmitter",
      kind: "inspect",
      position: { x: 700, y: 235, w: 360, h: 250 },
      label: "Радиопередатчик",
      sprite: "assets/sprites/radio_transmitter.png"
    },

    radio_cabinet: {
      id: "radio_cabinet",
      kind: "inspect",
      position: { x: 475, y: 360, w: 180, h: 220 },
      label: "Технический шкаф",
      sprite: "assets/sprites/radio_cabinet.png"
    },

    radio_log: {
      id: "radio_log",
      kind: "inspect",
      position: { x: 390, y: 510, w: 100, h: 70 },
      label: "Журнал сеансов связи",
      sprite: "assets/sprites/radio_log.png"
    },

    radio_coil: {
      id: "radio_coil",
      kind: "item",
      itemId: "radio_coil",
      position: { x: 510, y: 430, w: 110, h: 110 },
      label: "Катушка связи",
      sprite: "assets/items/radio_coil.png"
    },

    exit_comms_bunker: {
      id: "exit_comms_bunker",
      kind: "exit",
      target: "bunker",
      position: { x: 0, y: 120, w: 170, h: 520 },
      label: "Вернуться в бункер",
      hotspotOnly: true
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
        { id: "code", label: "Спросить про код" },
        { id: "battery", label: "Спросить про батарею" }
      ]
    },

    radio_operator: {
      id: "radio_operator",
      name: "Радист",
      sprite: "assets/sprites/radio_operator.png",
      topics: [
        { id: "battery", label: "Спросить о батарее" },
        { id: "signal", label: "Спросить о сигнале" },
        { id: "coil", label: "Спросить о катушке" }
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

  // Количество предметов, выброшенных на сцену по локациям.
  // Нужен отдельный учёт, чтобы одинаковые предметы не терялись.
  droppedItems: {
    shelter: {},
    market: {},
    bunker: {},
    comms: {}
  },

  flags: {
    wounded_watered: false,
    bunker_door_open: false,
    bunker_machine_inspected: false,
    bunker_panel_inspected: false,
    battery_activated: false,
    comms_unlocked: false,
    radio_log_read: false,
    cabinet_open: false,
    radio_started: false,
    game_won: false
  },

  milestones: [],

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
  sceneActionHint: document.getElementById("scene-action-hint"),
  sceneTransition: document.getElementById("scene-transition"),
  locationName: document.getElementById("location-name"),
  locationDescription: document.getElementById("location-description"),
  inventory: document.getElementById("inventory"),
  inventoryHint: document.getElementById("inventory-hint"),
  selectedItemLabel: document.getElementById("selected-item-label"),
  journal: document.getElementById("journal"),
  journalStatus: document.getElementById("journal-status"),
  objective: document.getElementById("objective"),
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

  if (action.type !== "MOVE") {
    render();
    if (action.type !== "RESET_GAME") {
      saveGame(true);
    }
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

  // Если взят оригинальный предмет из мира — фиксируем это вехой.
  // Если взят один из выброшенных экземпляров — уменьшаем только
  // количество выброшенных экземпляров.
  if (hasOriginalWorldItem(itemId, state.location)) {
    const foundMilestone = "found_" + itemId;
    if (!state.milestones.includes(foundMilestone)) {
      state.milestones.push(foundMilestone);
    }
  } else {
    removeDroppedItemFromLocation(itemId);
  }

  addMessage("Взято: " + item.name + ".");

  if (itemId === "flask") {
    unlockMilestone(
      "found_flask",
      "Фляга почти полная. Значит, у тебя ещё есть шанс помочь кому-то до того, как вода закончится."
    );
  }

  if (itemId === "filter") {
    unlockMilestone(
      "found_market_filter",
      "Под слоем пыли виден рабочий фильтр. Первый намёк на то, что рынок ещё не совсем мёртв."
    );
  }
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
  const index = location.entities.indexOf(entityId);

  // Удаляем только один экземпляр. Это важно для двух одинаковых
  // предметов, находящихся одновременно на сцене.
  if (index !== -1) {
    location.entities.splice(index, 1);
  }
}

function hasOriginalWorldItem(itemId, locationId) {
  if (locationId === "shelter" && itemId === "flask") {
    return !state.milestones.includes("found_flask");
  }

  if (locationId === "market" && itemId === "filter") {
    return !state.milestones.includes("found_market_filter");
  }

  if (locationId === "market" && itemId === "lamp") {
    return !state.milestones.includes("found_lamp");
  }

  if (locationId === "comms" && itemId === "radio_coil") {
    return state.flags.cabinet_open && !state.milestones.includes("found_radio_coil");
  }

  return false;
}

function addDroppedItemToLocation(itemId) {
  const locationItems = state.droppedItems[state.location] || {};
  locationItems[itemId] = (locationItems[itemId] || 0) + 1;
  state.droppedItems[state.location] = locationItems;
}

function removeDroppedItemFromLocation(itemId) {
  const locationItems = state.droppedItems[state.location] || {};
  const current = locationItems[itemId] || 0;

  if (current <= 1) {
    delete locationItems[itemId];
  } else {
    locationItems[itemId] = current - 1;
  }

  state.droppedItems[state.location] = locationItems;
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

  // Каждый выброшенный экземпляр должен существовать отдельно.
  // Не проверяем наличие такого же предмета на сцене: два фильтра
  // могут лежать одновременно.
  addEntityToCurrentLocation(itemId);
  addDroppedItemToLocation(itemId);

  state.selectedItem = null;
  addMessage("Предмет возвращён на сцену.");
}

function addEntityToCurrentLocation(itemId) {
  const location = GAME_DATA.locations[state.location];
  location.entities.push(itemId);
}

function getSceneStateNote(entity) {
  if (entity.id === "wounded" && state.flags.wounded_watered) {
    return "Раненый уже получил воду.";
  }

  if (entity.id === "bunker_door") {
    return state.flags.bunker_door_open
      ? "Замок снят. Дверь открыта."
      : "Замок требует код.";
  }

  if (entity.id === "bunker_machine") {
    return state.flags.bunker_machine_inspected
      ? "Машина отвечает слабым гулом."
      : "Внутри ещё есть питание.";
  }

  if (entity.id === "bunker_panel") {
    return state.flags.bunker_panel_inspected
      ? "На панели горит один зелёный индикатор."
      : state.flags.bunker_machine_inspected
        ? "Машина запущена. Панель ждёт переключения."
        : "Панель обесточена. Сначала осмотри машину.";
  }

  if (entity.id === "bunker_battery") {
    return state.flags.battery_activated
      ? "Батарея работает. От неё запитан старый контур."
      : state.flags.bunker_panel_inspected
        ? "Система активна. Батарея готова."
        : "Корпус цел. Сначала запусти систему.";
  }

  if (entity.id === "radio_transmitter") {
    return state.flags.radio_started
      ? "Передатчик отвечает слабым гулом."
      : state.flags.battery_activated
        ? "На панели появился аварийный сигнал. Нужна катушка."
        : "Передатчик мёртв.";
  }

  if (entity.id === "radio_cabinet") {
    return state.flags.cabinet_open
      ? "Дверца открыта. Внутри лежит катушка."
      : state.flags.radio_log_read
        ? "Замок старый. Код из журнала должен подойти."
        : "На дверце три цифры, но замок не реагирует.";
  }

  if (entity.id === "radio_log") {
    return state.flags.radio_log_read
      ? "Последние сеансы: 03:17, 06:42, 11:08."
      : "Потрёпанный журнал сеансов связи.";
  }

  if (entity.id === "lamp") {
    return "Фонарь сломан и больше не пригоден.";
  }

  return "";
}

function getEntityStateClass(entity) {
  if (entity.id === "bunker_machine") {
    return state.flags.bunker_machine_inspected ? "state-active" : "state-dormant";
  }

  if (entity.id === "bunker_panel") {
    if (state.flags.bunker_panel_inspected) {
      return "state-active";
    }

    return state.flags.bunker_machine_inspected ? "state-ready" : "state-dormant";
  }

  if (entity.id === "bunker_battery") {
    return state.flags.game_won
      ? "state-active"
      : state.flags.bunker_panel_inspected
        ? "state-ready"
        : "state-dormant";
  }

  return "";
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

function getNpcSubtitle(npcId) {
  if (npcId === "wounded") {
    if (state.flags.game_won) {
      return "Он улыбается: теперь у поселения снова есть шанс.";
    }
    if (hasItem("code") || state.flags.bunker_door_open) {
      return "Он понимает, что ты добрался до старой двери.";
    }
    if (state.flags.wounded_watered) {
      return "Он выглядит лучше. Взгляд уже не такой мутный.";
    }
    return hasItem("flask")
      ? "Он заметил вашу флягу."
      : "Он тяжело дышит и держится за бок.";
  }

  if (npcId === "radio_operator") {
    if (state.flags.radio_started) {
      return "Он слушает динамик и явно жалеет, что ты его запустил.";
    }
    if (state.flags.battery_activated) {
      return "Он смотрит на индикатор передатчика. «Теперь узел снова слышит нас».";
    }
    return "Он сидит у выключенной радиостанции и почти не поднимает глаз.";
  }

  if (npcId === "trader") {
    if (state.flags.game_won) {
      return "Он впервые выглядит по-настоящему спокойным.";
    }
    if (state.flags.bunker_door_open) {
      return "Северная дверь открыта. Он прислушивается к гулу из бункера.";
    }
    if (hasItem("code")) {
      return "Сделка завершена. Торговец больше ничего не предлагает.";
    }
    if (hasItem("filter", 2)) {
      return "Два фильтра — достаточная цена за его услугу.";
    }
    return "Он следит за каждым предметом на вашем поясе.";
  }

  return "О чём спросить?";
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
  subtitle.textContent = getNpcSubtitle(npcId);

  const topics = document.createElement("div");
  topics.className = "npc-dialog-topics";

  npc.topics.forEach((topic) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dialog-topic";
    button.textContent = topic.label;

    if (
      npcId === "wounded" &&
      topic.id === "filters" &&
      state.flags.wounded_watered
    ) {
      button.textContent = "Про фильтр (уже отдан)";
      button.disabled = true;
    }

    if (
      npcId === "trader" &&
      topic.id === "code" &&
      hasItem("code")
    ) {
      button.textContent = "Про код (уже получен)";
      button.disabled = true;
    }

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
        addMessage(hasItem("flask")
          ? "Раненый: «Вода... пожалуйста. Тогда отдам тебе фильтр»."
          : "Раненый: «У меня есть один фильтр, но сначала нужна вода».");
      }
      return;
    }

    if (topicId === "code") {
      addMessage(state.flags.wounded_watered
        ? "Раненый: «Торговец знает про старый бункер. Два фильтра — его цена»."
        : "Раненый: «Торговец знает. Спроси у него».");
      return;
    }
  }

  if (npcId === "radio_operator") {
    if (topicId === "battery") {
      addMessage("Радист: «Батарея? Если ты её нашёл, значит машина ещё жива. Но зачем ты её включил?»");
      return;
    }
    if (topicId === "signal") {
      addMessage(state.flags.battery_activated
        ? "Радист: «Я слышал эти сигналы раньше. Они приходили из северного контура. Потом всё стихло.»"
        : "Радист: «До отключения я ловил короткие сигналы с севера. После отключения — тишина.»");
      return;
    }
    if (topicId === "coil") {
      addMessage(state.flags.radio_log_read
        ? "Радист: «Катушка должна быть в техническом шкафу. Код не записывай — 417. Я его помню.»"
        : "Радист: «Без катушки передатчик не запустить. Ищи её в техническом шкафу.»");
      return;
    }
  }

  if (npcId === "trader" && topicId === "battery") {
    if (!state.flags.bunker_door_open && !hasItem("code")) {
      addMessage("Торговец: «О батарее? Сначала доберись до бункера. Здесь такие вещи не обсуждают вслух».");
      return;
    }

    addMessage(
      state.flags.game_won
        ? "Торговец: «Значит, ты всё-таки нашёл её. Я думал, система умерла много лет назад»."
        : "Торговец: «Если внутри ещё есть зелёный свет — не спеши трогать батарею. Сначала проверь машину и панель»."
    );
    unlockMilestone(
      "heard_battery_hint",
      "Торговец предупреждает: в бункере сначала нужно проверить машину и панель, а уже потом трогать батарею."
    );
    return;
  }

  if (npcId === "trader" && topicId === "code") {
    if (!hasItem("filter", 2)) {
      addMessage(hasItem("filter", 1)
        ? "Торговец: «Одного мало. Мне нужны два фильтра, тогда дам код»."
        : "Торговец: «Принеси два фильтра — и код твой».");
      return;
    }

    removeInventory("filter", 2);
    addInventory("code", 1);
    addMessage("Торговец забирает оба фильтра. «Держи. Не потеряй».");
    addMessage("Код тяжёлый и тёплый от его ладони. Похоже, его давно не использовали.");
    unlockMilestone(
      "got_bunker_code",
      "На металлической пластине выцарапано: «Северная дверь. Не доверяй автоматике». Похоже, кто-то оставил это для следующего выжившего."
    );
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

  if (itemId === "radio_coil" && targetId === "radio_transmitter") {
    inspectBunkerEntity(targetId);
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
  unlockMilestone(
    "helped_wounded",
    "На секунду кажется, что здесь ещё можно кому-то помочь. Раненый шепчет про торговца и два фильтра."
  );
  flashEntity("wounded");
}

function inspectBunkerEntity(entityId) {
  if (state.location !== "bunker") {
    return;
  }

  if (entityId === "bunker_machine") {
    if (!state.flags.bunker_machine_inspected) {
      state.flags.bunker_machine_inspected = true;
      unlockMilestone(
        "inspected_machine",
        "Машина не мёртвая. Под панелями проходит слабый ток, а где-то внутри работает старый преобразователь."
      );
    } else {
      addMessage("Гул становится чуть громче. Машина ждёт запуска.");
    }
    render();
    return;
  }

  if (entityId === "bunker_panel") {
    if (!state.flags.bunker_machine_inspected) {
      addMessage("Панель слишком тёмная. Сначала стоит осмотреть машину.");
      return;
    }

    if (!state.flags.bunker_panel_inspected) {
      state.flags.bunker_panel_inspected = true;
      unlockMilestone(
        "inspected_panel",
        "Под слоем пыли находится механический переключатель. Один контакт всё ещё держит питание."
      );
    } else {
      addMessage("Переключатель уже поднят. Зелёный индикатор больше не мигает.");
    }
    render();
    return;
  }

  if (entityId === "bunker_battery") {
    if (!state.flags.bunker_machine_inspected) {
      addMessage("В темноте виден только массивный корпус. Сначала осмотри машину.");
      return;
    }

    if (!state.flags.bunker_panel_inspected) {
      addMessage("Батарея подключена к системе, но цепь не активна. Нужна панель.");
      return;
    }

    if (!state.flags.battery_activated) {
      state.flags.battery_activated = true;
      state.flags.comms_unlocked = true;
      unlockMilestone(
        "found_battery",
        "Зелёный индикатор загорается ровно. Последняя батарея всё ещё работает."
      );
      unlockMilestone(
        "activated_comms",
        "Машина просыпается на несколько секунд. Где-то далеко оживает старый узел связи."
      );
      addMessage("Батарея включается. В глубине системы слышится короткий щелчок — будто проснулся передатчик.");
      addMessage("На старой панели появляется координата: «Узел связи №7». Похоже, питание дошло до него.");
    } else {
      addMessage("Батарея работает. Теперь нужно проверить старый узел связи.");
    }
    render();
    return;
  }

  if (entityId === "radio_log") {
    if (!state.flags.battery_activated) {
      addMessage("Страницы покрыты пылью. Пока здесь нет смысла что-либо искать.");
      return;
    }
    state.flags.radio_log_read = true;
    unlockMilestone(
      "read_radio_log",
      "Последние записи: 03:17 — 4 сигнала; 06:42 — 1 сигнал; 11:08 — 7 сигналов. Похоже, это не время, а последовательность."
    );
    addMessage("В журнале три последних сеанса. Цифры 4–1–7 выделены карандашом.");
    render();
    return;
  }

  if (entityId === "radio_cabinet") {
    if (!state.flags.battery_activated) {
      addMessage("Шкаф заперт. Без питания электронный замок даже не просыпается.");
      return;
    }
    if (!state.flags.radio_log_read) {
      addMessage("Замок не реагирует. Нужна подсказка из старого журнала.");
      return;
    }
    if (!state.flags.cabinet_open) {
      state.flags.cabinet_open = true;
      unlockMilestone(
        "opened_radio_cabinet",
        "Код 417 подходит. В шкафу лежит старая катушка связи с целыми контактами."
      );
      addMessage("Замок щёлкает. Внутри действительно есть катушка связи.");
      if (!GAME_DATA.locations.comms.entities.includes("radio_coil")) {
        GAME_DATA.locations.comms.entities.push("radio_coil");
      }
    } else {
      addMessage("Шкаф уже открыт. Катушка лежит внутри.");
    }
    render();
    return;
  }

  if (entityId === "radio_transmitter") {
    if (!state.flags.battery_activated) {
      addMessage("Передатчик мёртв. Сначала нужно вернуть питание.");
      return;
    }
    if (!state.flags.radio_started) {
      if (!hasItem("radio_coil")) {
        addMessage("На корпусе виден пустой разъём. Нужна катушка связи.");
        return;
      }
      removeInventory("radio_coil", 1);
      state.flags.radio_started = true;
      unlockMilestone(
        "started_radio",
        "Передатчик оживает. Из динамика сначала идёт только треск, затем появляется человеческий голос."
      );
      addMessage("Катушка встаёт на место. Передатчик отвечает слабым гулом.");
      addMessage("Автоматический голос: «Узел №7 активирован. Обнаружен источник питания. Инициализация северного контура».");
      addMessage("Радист бледнеет: «Ты не должен был этого делать».");
    } else {
      addMessage("Из динамика идёт тихий треск. Где-то далеко уже проснулся северный контур.");
    }
    render();
    return;
  }
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
  unlockMilestone(
    "opened_bunker_door",
    "Из щели тянет холодным воздухом. За дверью нет света — только глухой гул глубоко под землёй."
  );
  flashEntity("bunker_door");
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

  if (state.location === "bunker" && locationId === "comms" && !state.flags.battery_activated) {
    addMessage("За дальнейшей дверью пока ничего не слышно. Сначала нужно запустить систему бункера.");
    return;
  }

  state.selectedItem = null;
  clearSceneDialog();

  const enterLocation = () => {
    const previousLocation = state.location;
    state.location = locationId;

    if (
      locationId === "market" &&
      previousLocation !== "market" &&
      state.flags.wounded_watered &&
      !state.milestones.includes("returned_to_market_after_help")
    ) {
      unlockMilestone(
        "returned_to_market_after_help",
        "Когда ты возвращаешься на рынок, раненый уже сидит ровнее. Он заметил, что ты не ушёл, и теперь смотрит на тебя иначе."
      );
    }

    if (
      locationId === "market" &&
      previousLocation !== "market" &&
      state.flags.bunker_door_open &&
      !state.milestones.includes("returned_to_market_after_code")
    ) {
      unlockMilestone(
        "returned_to_market_after_code",
        "После открытия двери рынок кажется тише. Торговец время от времени смотрит на север, будто ждёт ответа из-под земли."
      );
    }

    if (
      locationId === "shelter" &&
      previousLocation !== "shelter" &&
      state.flags.wounded_watered &&
      !state.milestones.includes("returned_to_shelter_after_help")
    ) {
      unlockMilestone(
        "returned_to_shelter_after_help",
        "В убежище всё по-прежнему пусто, но теперь тишина ощущается иначе: ты знаешь, что на рынке кому-то стало легче."
      );
    }

    if (locationId === "comms") {
      unlockMilestone(
        "entered_comms",
        "Старый узел связи снова получает питание. В радиорубке тебя уже ждёт человек."
      );
      addMessage("Ты входишь в старый узел связи. Здесь пахнет пылью, металлом и перегретой проводкой.");
    }

    if (locationId === "bunker") {
      unlockMilestone(
        "entered_bunker",
        "Дверь закрывается за спиной. В темноте постепенно проступает огромная машина. На панели едва заметно мигает один зелёный индикатор."
      );
      addMessage("Ты входишь в бункер. Здесь действительно есть работающая батарея.");
    }

    render();
    saveGame(true);
  };

  playSceneTransition(enterLocation);
  return;

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

function flashEntity(entityId) {
  requestAnimationFrame(() => {
    const entity = DOM.scene.querySelector('[data-entity-id="' + entityId + '"]');
    if (!entity) {
      return;
    }

    entity.classList.remove("state-changed");
    void entity.offsetWidth;
    entity.classList.add("state-changed");
  });
}

function playSceneTransition(callback) {
  if (!DOM.sceneTransition) {
    callback();
    return;
  }

  DOM.sceneTransition.classList.add("active");

  setTimeout(() => {
    callback();
    requestAnimationFrame(() => {
      DOM.sceneTransition.classList.remove("active");
    });
  }, 180);
}

function render() {
  renderScene();
  renderInventory();
  renderJournal();
  renderDebug();
  updateLocationText();
  updateObjective();

  if (state.flags.game_won) {
    // Оверлей показывается с небольшой задержкой после входа.
    // Если пользователь обновил сцену, состояние всё равно остаётся победным.
  }
}

function renderScene() {
  DOM.scene.innerHTML = "";
  DOM.sceneFallback.hidden = true;

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
  const entityStateClass = getEntityStateClass(entity);
  if (entityStateClass) {
    button.classList.add(entityStateClass);
  }
  button.dataset.entityId = entity.id;
  button.dataset.kind = entity.kind;
  if (entity.atmosphereOnly) {
    button.dataset.atmosphere = "true";
  }

  if (entity.id === "wounded" && state.flags.wounded_watered) {
    button.dataset.state = "helped";
  }

  if (entity.id === "bunker_door" && state.flags.bunker_door_open) {
    button.dataset.state = "open";
  }
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

  if (entity.hotspotOnly) {
    button.classList.add("hotspot-only");
    button.style.opacity = "0";
  }

  if (entity.id === "flask") {
    button.classList.add("flask-entity");
  }

  if (sprite) {
    const image = document.createElement("img");
    image.src = sprite;
    image.alt = entity.label;
    image.addEventListener("error", () => {
      if (entity.spriteFallback && image.src.endsWith(entity.sprite.split("/").pop())) {
        image.src = entity.spriteFallback;
        return;
      }
      image.replaceWith(createInlineSvgFallback(entity));
      state.fallbackLevel = Math.max(state.fallbackLevel, 1);
      renderDebug();
    }, { once: true });

    if (entity.id === "flask") {
      image.style.mixBlendMode = "multiply";
    }
    button.appendChild(image);
  } else if (!entity.hotspotOnly && entity.kind !== "inspect") {
    button.appendChild(createInlineSvgFallback(entity));
    state.fallbackLevel = Math.max(state.fallbackLevel, 1);
  }

  if (!entity.sprite || entity.kind !== "inspect") {
    const label = document.createElement("span");
    label.className = "entity-label";
    label.textContent = entity.label;
    button.appendChild(label);
  } else {
    button.setAttribute("aria-label", entity.label);
  }

  attachEntityAction(button, entity);

  button.addEventListener("mouseenter", () => showSceneActionHint(entity));
  button.addEventListener("mouseleave", hideSceneActionHint);
  button.addEventListener("focus", () => showSceneActionHint(entity));
  button.addEventListener("blur", hideSceneActionHint);

  DOM.scene.appendChild(button);
}

function showSceneActionHint(entity) {
  if (!DOM.sceneActionHint) {
    return;
  }

  let text = entity.label;

  if (state.selectedItem) {
    const item = GAME_DATA.items[state.selectedItem];
    text = item.usableTargets.includes(entity.id)
      ? "Использовать: " + item.name
      : "Здесь " + item.name.toLowerCase() + " не пригодится";
  } else if (entity.kind === "item") {
    text = entity.atmosphereOnly
      ? "Осмотреть: " + entity.label
      : "Взять: " + entity.label;
  } else if (entity.kind === "npc") {
    text = "Поговорить: " + entity.label;
  } else if (entity.kind === "exit") {
    text = "Перейти: " + entity.label;
  } else if (entity.kind === "door") {
    text = state.flags.bunker_door_open
      ? "Войти: бункер"
      : "Открыть: дверь в бункер";
  } else if (entity.kind === "inspect") {
    text = "Осмотреть: " + entity.label;
  }

  const note = getSceneStateNote(entity);
  DOM.sceneActionHint.textContent = note ? text + " · " + note : text;
  DOM.sceneActionHint.classList.add("visible");
}

function hideSceneActionHint() {
  if (DOM.sceneActionHint) {
    DOM.sceneActionHint.classList.remove("visible");
  }
}

function attachEntityAction(button, entity) {
  button.addEventListener("click", () => {
    if (state.selectedItem) {
      if (entity.kind === "npc" || entity.kind === "door" || entity.kind === "inspect") {
        dispatchAction({
          type: "USE_ITEM",
          itemId: state.selectedItem,
          targetId: entity.id
        });
        return;
      }

      const targetName = entity.label || "это";
      addMessage("«" + targetName + "» не подходит для " + GAME_DATA.items[state.selectedItem].name.toLowerCase() + ".");
      state.selectedItem = null;
      render();
      return;
    }

    if (entity.kind === "item") {
      if (entity.atmosphereOnly) {
        addMessage(entity.label + ": " + GAME_DATA.items[entity.itemId].description);

        if (entity.id === "lamp" && !state.milestones.includes("inspected_lamp")) {
          unlockMilestone(
            "inspected_lamp",
            "Под фонарём выцарапана стрелка на север. Кто-то хотел, чтобы дорогу к бункеру не забыли."
          );
        }

        return;
      }

      dispatchAction({
        type: "TAKE_ITEM",
        itemId: entity.itemId
      });
      return;
    }

    if (entity.kind === "inspect") {
      inspectBunkerEntity(entity.id);
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
  hideSceneActionHint();
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

function unlockMilestone(id, message) {
  if (state.milestones.includes(id)) {
    return false;
  }

  state.milestones.push(id);

  if (message) {
    addMessage(message);
  }

  return true;
}

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

  let description = location.description;

  if (state.location === "shelter" && state.milestones.includes("found_flask")) {
    description = "Бетонная коробка стала тише. На полу осталось только пустое место, где лежала фляга; на восток — рынок.";
  }

  if (state.location === "market" && state.flags.wounded_watered) {
    description = "Ржавые контейнеры, уже знакомый раненый, торговец и открытая дорога к северной двери. Здесь стало чуть меньше безысходности.";
  }

  if (state.location === "market" && state.flags.bunker_door_open) {
    description = "Ржавые контейнеры остаются позади. Северная дверь открыта, и из проёма тянет холодом.";
  }

  if (state.location === "market" && state.flags.game_won) {
    description = "Рынок почти не изменился, но люди уже знают: в старом бункере снова работает машина. В воздухе впервые за долгое время есть ожидание.";
  }

  if (state.location === "bunker") {
    if (state.flags.game_won) {
      description = "Тяжёлая дверь закрылась. Машина работает, а последняя батарея даёт ровный зелёный свет.";
    } else if (state.flags.battery_activated) {
      description = "Машина работает. Где-то за стенами просыпается старый узел связи.";
    } else if (state.flags.bunker_panel_inspected) {
      description = "Переключатель поднят. В глубине зала уже слышно ровное гудение.";
    } else if (state.flags.bunker_machine_inspected) {
      description = "Машина жива. На панели управления есть старый механический переключатель.";
    } else {
      description = location.description;
    }
  }

  if (state.location === "comms") {
    if (state.flags.radio_started) {
      description = "Передатчик работает. В динамике слышен треск, а радист не сводит глаз с северного индикатора.";
    } else if (state.flags.cabinet_open) {
      description = "Технический шкаф открыт. Катушка связи ждёт подключения к передатчику.";
    } else if (state.flags.battery_activated) {
      description = "Старый узел получил питание. Радист смотрит на передатчик, будто боится услышать ответ.";
    } else {
      description = location.description;
    }
  }

  DOM.locationDescription.textContent = description;
}

function updateObjective() {
  let objective = "Найди воду и помоги раненому.";

  if (state.flags.game_won) {
    objective = "Бункер найден. Батарея у тебя перед глазами.";
  } else if (state.location === "comms" && !state.flags.battery_activated) {
    objective = "Сначала восстанови питание в бункере.";
  } else if (state.location === "comms" && !state.flags.radio_log_read) {
    objective = "Осмотри журнал старых сеансов связи.";
  } else if (state.location === "comms" && !state.flags.cabinet_open) {
    objective = "Открой технический шкаф по подсказке из журнала.";
  } else if (state.location === "comms" && !hasItem("radio_coil") && !state.flags.radio_started) {
    objective = "Возьми катушку связи из технического шкафа.";
  } else if (state.location === "comms" && !state.flags.radio_started) {
    objective = "Установи катушку в радиопередатчик.";
  } else if (state.location === "comms") {
    objective = "Выслушай сообщение северного контура.";
  } else if (state.location === "bunker" && !state.flags.bunker_machine_inspected) {
    objective = "Осмотри машину в глубине бункера.";
  } else if (state.location === "bunker" && !state.flags.bunker_panel_inspected) {
    objective = "Найди на панели способ запустить систему.";
  } else if (state.location === "bunker" && !state.flags.battery_activated) {
    objective = "Активируй последнюю батарею.";
  } else if (state.location === "bunker") {
    objective = "Войди в старый узел связи.";
  } else if (hasItem("code")) {
    objective = "Используй код на двери бункера.";
  } else if (hasItem("filter", 2)) {
    objective = "Отнеси два фильтра торговцу.";
  } else if (state.flags.wounded_watered) {
    objective = "Найди второй фильтр и поговори с торговцем.";
  } else if (hasItem("flask")) {
    objective = "Дай воду раненому.";
  } else if (state.location === "shelter") {
    objective = "Возьми флягу и отправляйся на рынок.";
  }

  DOM.objective.textContent = objective;
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
    "machine_inspected: " + state.flags.bunker_machine_inspected,
    "panel_inspected: " + state.flags.bunker_panel_inspected,
    "milestones: " + (state.milestones.join(", ") || "none"),
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
        droppedItems: state.droppedItems,
        flags: state.flags,
        milestones: state.milestones,
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
    restored.droppedItems = {
      shelter: { ...(payload.state.droppedItems?.shelter || {}) },
      market: { ...(payload.state.droppedItems?.market || {}) },
      bunker: { ...(payload.state.droppedItems?.bunker || {}) },
      comms: { ...(payload.state.droppedItems?.comms || {}) }
    };
    restored.flags = {
      ...restored.flags,
      ...(payload.state.flags || {})
    };
    restored.milestones = Array.isArray(payload.state.milestones)
      ? payload.state.milestones
      : [];
    restored.messages = Array.isArray(payload.state.messages)
      ? payload.state.messages.slice(0, 6)
      : [];

    state = restored;
    restoreLocationEntities();
    clearSceneDialog();
    addMessage("Сохранение загружено.");
    render();
    updateStartScreen();

    if (state.flags.game_won) {
      setTimeout(showWinScreen, 250);
    } else {
      hideWinScreen();
    }

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
  // Восстанавливаем только те предметы, которые действительно должны
  // находиться в мире после загрузки. Состояние сцены теперь зависит
  // от инвентаря и пройденных этапов, а не сбрасывается целиком.
  GAME_DATA.locations.shelter.entities = ["exit_east"];

  if (!hasItem("flask") && !state.milestones.includes("found_flask")) {
    GAME_DATA.locations.shelter.entities.unshift("flask");
  }

  GAME_DATA.locations.market.entities = [
    "wounded",
    "trader",
    "lamp",
    "exit_west",
    "bunker_door"
  ];

  // Фильтр на рынке — отдельный предмет от фильтра, который получает
  // раненый. Поэтому его исчезновение фиксируем отдельной вехой.
  if (!state.milestones.includes("found_market_filter")) {
    GAME_DATA.locations.market.entities.splice(2, 0, "filter");
  }

  // Предметы, выброшенные игроком, восстанавливаются в том же количестве.
  Object.entries(state.droppedItems.market || {}).forEach(([itemId, count]) => {
    for (let i = 0; i < count; i += 1) {
      GAME_DATA.locations.market.entities.push(itemId);
    }
  });

  Object.entries(state.droppedItems.shelter || {}).forEach(([itemId, count]) => {
    for (let i = 0; i < count; i += 1) {
      GAME_DATA.locations.shelter.entities.push(itemId);
    }
  });

  // Финальные объекты бункера являются частью постоянной сцены и не
  // должны исчезать после загрузки сохранения.
  GAME_DATA.locations.bunker.entities = [
    "bunker_machine",
    "bunker_panel",
    "bunker_battery",
    "bunker_comms_exit",
    "exit_south"
  ];

  // Новый узел связи открывается только после запуска батареи.
  // Его содержимое восстанавливается из флагов и сохранённого инвентаря.
  GAME_DATA.locations.comms.entities = [
    "radio_operator",
    "radio_transmitter",
    "radio_cabinet",
    "radio_log",
    "exit_comms_bunker"
  ];

  if (
    state.flags.cabinet_open &&
    !state.milestones.includes("found_radio_coil") &&
    !hasItem("radio_coil") &&
    !(state.droppedItems.comms?.radio_coil > 0)
  ) {
    GAME_DATA.locations.comms.entities.push("radio_coil");
  }

  Object.entries(state.droppedItems.comms || {}).forEach(([itemId, count]) => {
    for (let i = 0; i < count; i += 1) {
      GAME_DATA.locations.comms.entities.push(itemId);
    }
  });

  Object.entries(state.droppedItems.bunker || {}).forEach(([itemId, count]) => {
    for (let i = 0; i < count; i += 1) {
      GAME_DATA.locations.bunker.entities.push(itemId);
    }
  });
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