export type TMcStateRemoveCI05 =
  | "start"
  | "remove"
  | "Coin1"
  | "Coin2"
  | "Coin3"
  | "CheckCoin"
  | "CoinIncasset"
  | "CoinIncasset1"
  | "CoinIncasset2"
  | "Note1"
  | "Note2"
  | "Note3"
  | "Note4"
  | "CheckNote"
  | "NoteIncasset1"
  | "NoteIncasset2"
  | "CoinSuccess"
  | "NoteSuccess"
  | "fetchFinish"
  | "finished"
  | "success"
  | "error";

export const STATUS_MSG_CI05 = {
  start: "นำเงินออกจากกล่องเก็บเงิน (Model CI05B)",
  remove: "กรุณากดปุ่มเลือกกล่องที่ต้องการ",
  Coin1: "กำลังปลดล๊อคกล่องเหรียญ",
  Coin2: "กรุณานำกล่องเหรียญออก",
  Coin3: "กรุณานำเงินออกจากกล่องให้หมด แล้วใส่กล่องกลับ",
  CheckCoin: "กำลังตรวจสอบเหรียญในเครื่องอีกครั้ง",
  CoinIncasset: "นำเหรียญออกไม่หมด กดปุ่มปลดล็อคกล่องเหรียญ",
  CoinIncasset1: "กรุณานำกล่องเหรียญออก",
  CoinIncasset2: "กรุณานำเงินออกให้หมด แล้วใส่กล่องกลับ",
  Note1: "กรุณาไขกุญแจดอกสีเหลืองเพื่อปลดล็อคกล่องธนบัตร",
  Note2: "กรุณานำเงินออกจากกล่องให้หมด แล้วใส่กล่องกลับ",
  Note3: "กรุณารอสักครู่",
  Note4: "นำธนบัตรออกหมดแล้ว กรุณารอสักครู่",
  CheckNote: "กำลังตรวจสอบธนบัตรในเครื่องอีกครั้ง",
  NoteIncasset: "นำธนบัตรออกไม่หมด",
  NoteIncasset1: "กรุณาไขกุญแจดอกสีเหลืองเพื่อปลดล็อคกล่อง",
  NoteIncasset2: "กรุณานำเงินออกให้หมด แล้วใส่กล่องกลับ",
  CoinSuccess: "นำเหรียญออกเสร็จสิ้น กดปุ่มเพื่อทำรายการต่อ",
  NoteSuccess: "นำธนบัตรออกเสร็จสิ้น กดปุ่มเพื่อทำรายการต่อ",
  fetchFinish: "กรุณารอสักครู่",
  finished: "นำเงินออกหมดแล้ว",
  success: "นำเงินออกเสร็จสิ้น",
  error: "เครื่องขัดข้องกรุณาติดต่อเจ้าหน้าที่",
};

const noCondition = {
  note: [] as string[],
  coin: [] as string[],
};

export const REM_MC_CI05_COND = {
  start: noCondition,
  remove: {
    note: ["Full CONTAINER_C4A_COUNTER", "StatusChange STATUS_IDLE", ""],
    coin: [
      "Empty COFB",
      "StatusChange STATUS_IDLE",
      "WaitForRemoving COFB",
      "Full COFB",
      "",
    ],
  },
  Coin1: {
    note: ["Full CONTAINER_C4A_COUNTER", "StatusChange STATUS_IDLE", ""],
    coin: [
      "WaitForRemoving COFB",
      "WaitForOpening COLLECTION DOOR",
      "WaitForInsertion COFB",
      "Missing COFB",
      "Removed COFB",
    ],
  },
  Coin2: {
    note: ["Full CONTAINER_C4A_COUNTER", "StatusChange STATUS_IDLE", ""],
    coin: [
      "WaitForInsertion COFB",
      "Missing COFB",
      "Removed COFB",
      "Empty COFB",
      "StatusChange STATUS_IDLE",
    ],
  },
  Coin3: {
    note: ["Full CONTAINER_C4A_COUNTER", "StatusChange STATUS_IDLE", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  // กรณีนำเหรียญออกจากกล่องไม่หมด
  CoinIncasset: {
    note: ["Full CONTAINER_C4A_COUNTER", "StatusChange STATUS_IDLE", ""],
    coin: [
      "WaitForRemoving COFB",
      "WaitForOpening COLLECTION DOOR",
      "WaitForInsertion COFB",
      "Missing COFB",
      "Removed COFB",
    ],
  },
  CoinIncasset1: {
    note: ["Full CONTAINER_C4A_COUNTER", "StatusChange STATUS_IDLE", ""],
    coin: [
      "WaitForInsertion COFB",
      "Missing COFB",
      "Removed COFB",
      "Empty COFB",
      "StatusChange STATUS_IDLE",
    ],
  },
  CoinIncasset2: {
    note: ["Full CONTAINER_C4A_COUNTER", "StatusChange STATUS_IDLE", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  // ธนบัตร
  Note1: {
    note: [
      "Opened COLLECTION DOOR",
      "WaitRemoving COLLECTION_BOX",
      "Missing COLLECTION_BOX",
      "Missing CONTAINER_C4B_COUNTER",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", "Full COFB", ""],
  },
  Note2: {
    note: [
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
      "Empty CONTAINER_C4A_COUNTER",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", "Full COFB", ""],
  },
  Note3: {
    note: ["StatusChange STATUS_IDLE", "Empty CONTAINER_C4A_COUNTER"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", "Full COFB", ""],
  },

  Note4: {
    note: ["StatusChange STATUS_IDLE", "Empty CONTAINER_C4A_COUNTER"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", "Full COFB", ""],
  },

  // กรณีนำธนบัตรออกจากกล่องไม่หมด
  NoteIncasset1: {
    note: [
      "Missing COLLECTION_BOX",
      "Missing CONTAINER_C4B_COUNTER",
      "Removed COLLECTION_BOX",
      "Empty CONTAINER_C4A_COUNTER",
      "StatusChange STATUS_BUSY",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", "Full COFB", ""],
  },
  NoteIncasset2: {
    note: ["CassetteInSerted00000000", "StatusChange STATUS_IDLE"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", "Full COFB", ""],
  },

  fetchFinish: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },

  CheckCoin: noCondition,
  CheckNote: noCondition,

  CoinSuccess: noCondition,

  NoteSuccess: {
    note: ["StatusChange STATUS_IDLE", "Empty CONTAINER_C4A_COUNTER"],
    coin: [
      "Empty COFB",
      "StatusChange STATUS_IDLE",
      "Full COFB",
      "WaitForRemoving COFB",
      "",
    ],
  },

  finished: noCondition,
  success: noCondition,
};
