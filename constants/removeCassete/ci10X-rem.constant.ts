export type TMcStateRemoveCI10X =
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
  | "Note5"
  | "CheckNote"
  | "Note6"
  | "Note7"
  | "NoteIncasset"
  | "NoteIncasset1"
  | "NoteIncasset2"
  | "NoteIncasset3"
  | "NotCasset"
  | "NotCasset1"
  | "NotCasset2"
  | "CoinSuccess"
  | "NoteSuccess"
  | "fetchFinish"
  | "finished"
  | "success";

export const STATUS_MSG_CI10X = {
  start: "นำเงินออกจากกล่องเก็บเงิน (Model CI10BX)",
  remove: "กรุณากดปุ่มเลือกกล่องที่ต้องการ",
  Coin1: "กำลังปล๊ดล๊อคกล่องเหรียญ",
  Coin2: "กรุณาเปิดประตู นำกล่องเหรียญออก",
  Coin3: "กรุณานำเงินออกจากกล่องให้หมด แล้วใส่กล่องกลับ",
  CheckCoin: "กำลังตรวจสอบเหรียญในเครื่องอีกครั้ง",
  CoinIncasset: "นำเหรียญออกไม่หมด กดปุ่มปลดล็อคกล่องเหรียญ",
  CoinIncasset1: "กรุณาเปิดประตู กรุณานำกล่องเหรียญออก",
  CoinIncasset2: "กรุณานำเงินออกให้หมด แล้วใส่กล่องกลับ",
  Note1: "กำลังปลดล็อคกล่องธนบัตร",
  Note2: "กรุณาเปิดประตูนำกล่องธนบัตรออก",
  Note3: "กรุณาดึงกล่องธนบัตรออก",
  Note4: "กรุณานำเงินออกแล้วใส่กล่องธนบัตรกลับ",
  Note5: "กรุณารอสักครู่",
  Note6: "กรุณารอสักครู่",
  CheckNote: "กำลังตรวจสอบธนบัตรในเครื่องอีกครั้ง",
  Note7: "นำธนบัตรออกหมดแล้ว กรุณารอสักครู่",
  NoteIncasset: "นำธนบัตรออกไม่หมด กดปุ่มปลดล็อคกล่องธนบัตร",
  NoteIncasset1: "กรุณาเปิดประตูนำกล่องธนบัตรออก",
  NoteIncasset2: "กรุณาดึงกล่องธนบัตรออก",
  NoteIncasset3: "กรุณานำเงินออกให้หมดแล้วใส่กล่องกลับ",
  NotCasset: "กรุณาใส่กล่องธนบัตร กดปุ่มปลดล็อค",
  NotCasset1: "กรุณาเปิดประตูใส่กล่องธนบัตร",
  NotCasset2: "กรุณาใส่กล่องเก็บธนบัตรกลับ",
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

export const REM_MC_CI10X_COND = {
  start: noCondition,
  remove: {
    note: ["WaitForOpening COLLECTION DOOR", "StatusChange STATUS_IDLE", ""],
    coin: [
      "Empty COFB",
      "StatusChange STATUS_IDLE",
      "WaitForRemoving COFB",
      "WaitForOpening COLLECTION DOOR",
      "",
    ],
  },
  Coin1: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["WaitForRemoving COFB", "WaitForOpening COLLECTION DOOR"],
  },
  Coin2: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["WaitForInsertion COFB", "Missing COFB", "Removed COFB"],
  },
  Coin3: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  // กรณีนำเหรียญออกจากกล่องไม่หมด
  CoinIncasset: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["WaitForRemoving COFB", "WaitForOpening COLLECTION DOOR"],
  },
  CoinIncasset1: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["WaitForInsertion COFB", "Missing COFB", "Removed COFB"],
  },
  CoinIncasset2: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  // ธนบัตร
  Note1: {
    note: ["WaitForOpening COLLECTION DOOR"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  Note2: {
    note: ["Opened COLLECTION DOOR", "WaitRemoving COLLECTION_BOX"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  Note3: {
    note: [
      "WaitForInsertion COLLECTION_BOX",
      "Missing COLLECTION_BOX",
      "Missing CONTAINER_C4B_COUNTER",
      "Removed COLLECTION_BOX",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },

  Note4: {
    note: [
      //   "Empty CONTAINER_C4A_COUNTER",
      //   "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },

  Note5: noCondition,

  Note6: {
    note: ["StatusChange STATUS_IDLE", "WaitForInsertion COLLECTION_BOX"],
    coin: ["StatusChange STATUS_IDLE", "Empty COFB", ""],
  },

  Note7: {
    note: ["StatusChange STATUS_IDLE"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },

  // กรณีนำธนบัตรออกไม่หมด
  NoteIncasset: {
    note: ["WaitForOpening COLLECTION DOOR"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  NoteIncasset1: {
    note: ["Opened COLLECTION DOOR", "WaitRemoving COLLECTION_BOX"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  NoteIncasset2: {
    note: [
      "WaitForInsertion COLLECTION_BOX",
      "Missing COLLECTION_BOX",
      "Missing CONTAINER_C4B_COUNTER",
      "Removed COLLECTION_BOX",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  NoteIncasset3: {
    note: [
      //   "Empty CONTAINER_C4A_COUNTER",
      //   "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },

  // กรณีลืมใส่กล่องธนบัตรกลับ
  NotCasset: {
    note: ["WaitForOpening COLLECTION DOOR"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  NotCasset1: {
    note: ["Opened COLLECTION DOOR", "WaitRemoving COLLECTION_BOX"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  NotCasset2: {
    note: [
      //   "Empty CONTAINER_C4A_COUNTER",
      //   "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  CheckCoin: noCondition,
  CheckNote: noCondition,

  fetchFinish: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },

  CoinSuccess: {
    note: ["StatusChange STATUS_IDLE", "WaitForOpening COLLECTION DOOR"],
    coin: [
      "Empty COFB",
      "StatusChange STATUS_IDLE",
      "WaitForRemoving COFB",
      "WaitForOpening COLLECTION DOOR",
    ],
  },
  NoteSuccess: {
    note: ["StatusChange STATUS_IDLE", "WaitForOpening COLLECTION DOOR"],
    coin: [
      "Empty COFB",
      "StatusChange STATUS_IDLE",
      "WaitForRemoving COFB",
      "WaitForOpening COLLECTION DOOR",
    ],
  },
  finished: noCondition,
  success: noCondition,
};
