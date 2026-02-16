export type TMcStateRemoveCI50 =
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
  | "Note6"
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

export const STATUS_MSG_CI50 = {
  start: "นำเงินออกจากกล่องเก็บเงิน (Model CI50B)",
  remove: "กรุณากดปุ่มเลือกกล่องที่ต้องการ",
  Coin1: "กำลังปล๊ดล๊อคกล่องเหรียญ",
  Coin2: "กรุณานำกล่องเหรียญออก",
  Coin3: "กรุณานำเงินออกจากกล่องให้หมด แล้วใส่กล่องกลับ",
  CheckCoin: "กำลังตรวจสอบเหรียญในเครื่องอีกครั้ง",
  CoinIncasset: "นำเหรียญออกไม่หมด กดปุ่มปลดล็อคกล่องเหรียญ",
  CoinIncasset1: "กรุณานำกล่องเหรียญออก",
  CoinIncasset2: "กรุณานำเงินออกให้หมด แล้วใส่กล่องกลับ",
  Note1: "กรุณาเปิดประตูเซฟเครื่องธนบัตร",
  Note2: "กรุณานำกล่องบรรจุธนบัตรออก",
  Note3: "กรุณานำเงินออกแล้วใส่กล่องธนบัตรกลับ",
  Note4: "กรุณารอสักครู่",
  Note5: "กรุณารอสักครู่",
  NoteCheck: "กรุณารอตรวจสอบธนบัตรในเครื่องอีกครั้ง",
  Note6: "นำเงินออกหมดแล้ว กรุณารอสักครู่",
  NoteIncasset: "นำธนบัตรออกไม่หมด",
  NoteIncasset1: "กรุณาเปิดประตูเซฟเครื่องธนบัตร",
  NoteIncasset2: "กรุณานำกล่องบรรจุธนบัตรออก",
  NoteIncasset3: "กรุณานำเงินออกให้หมดแล้วใส่กล่องกลับ",
  NotCasset: "กรุณาใส่กล่องธนบัตร",
  NotCasset1: "กรุณาเปิดประตูเซฟเครื่องธนบัตร",
  NotCasset2: "กรุณาใส่กล่องเก็บธนบัตรกลับ แล้วปิดประตูเซฟ",
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

export const REM_MC_CI50_COND = {
  start: noCondition,
  remove: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: [
      "Empty COFB",
      "StatusChange STATUS_IDLE",
      "WaitForRemoving COFB",
      "",
    ],
  },
  Coin1: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["WaitForRemoving COFB"],
  },
  Coin2: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["WaitForInsertion COFB", "Missing COFB"],
  },
  Coin3: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  // กรณีนำเหรียญออกจากกล่องไม่หมด
  CoinIncasset: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["WaitForRemoving COFB"],
  },
  CoinIncasset1: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["WaitForInsertion COFB", "Missing COFB"],
  },
  CoinIncasset2: {
    note: ["StatusChange STATUS_IDLE", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  // ธนบัตร
  Note1: {
    note: ["Opened COLLECTION DOOR", "StatusChange STATUS_BUSY"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  Note2: {
    note: [
      "Missing CONTAINER_C4A_COUNTER",
      "Empty CONTAINER_C4A_COUNTER",
      "CassetteInSerted ffffffff",
      "Closed COLLECTION DOOR",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  Note3: {
    note: [
      "CassetteInSerted ffffffff",
      "Closed COLLECTION DOOR",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },

  Note4: noCondition,

  Note5: {
    note: ["StatusChange STATUS_IDLE", "WaitForInsertion COLLECTION_BOX"],
    coin: ["StatusChange STATUS_IDLE", "Empty COFB", ""],
  },
  Note6: {
    note: ["StatusChange STATUS_IDLE"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },

  // กรณีนำธนบัตรออกไม่หมด
  NoteIncasset1: {
    note: ["Opened COLLECTION DOOR"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  NoteIncasset2: {
    note: [
      "Missing CONTAINER_C4A_COUNTER",
      "Empty CONTAINER_C4A_COUNTER",
      "CassetteInSerted ffffffff",
      "Closed COLLECTION DOOR",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  NoteIncasset3: {
    note: [
      "CassetteInSerted ffffffff",
      "Closed COLLECTION DOOR",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },

  // กรณีลืมใส่กล่องธนบัตรกลับ
  NotCasset1: {
    note: ["Opened COLLECTION DOOR", "StatusChange STATUS_BUSY"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", ""],
  },
  NotCasset2: {
    note: [
      "CassetteInSerted ffffffff",
      "Closed COLLECTION DOOR",
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
  CoinSuccess: noCondition,
  NoteSuccess: {
    note: ["StatusChange STATUS_IDLE"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE", "WaitForRemoving COFB"],
  },
  finished: noCondition,
  success: noCondition,
};
