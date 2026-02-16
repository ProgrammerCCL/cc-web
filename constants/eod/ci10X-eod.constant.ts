import { IEODState } from "@/types/model/endOfDay.type";

export const STATUS_MSG_CI10X = {
  start: "Model CI10BX",
  Collect: "เครื่องกำลังนำเงินลงกล่อง",
  CoinCollect: "เครื่องกำลังนำเงินลงกล่อง",
  collectSuccess: "กรุณากดปุ่มปลดล็อคกล่องเหรียญ",
  Coin1: "กรุณาเปิดประตู นำกล่องเหรียญออก",
  Coin2: "กรุณานำเงินออกจากกล่องให้หมด แล้วใส่กล่องกลับ",
  Coin3: "กรุณารอสักครู่",
  Coin4: "กรุณารอสักครู่",
  CoinCheck: "กรุณารอตรวจสอบเหรียญในเครื่องอีกครั้ง",
  NotCassetCoin: "กรุณาใส่กล่องเหรียญ กดปุ่มปลดล็อค",
  NotCassetCoin1: "กรุณาเปิดประตู นำกล่องเหรียญใส่กลับ",
  CoinCollectSuccess: "กรุณากดปุ่มปลดล็อคกล่องเหรียญ",
  CoinCollectSuccess2: "กรุณาเปิดประตู นำกล่องเหรียญออก",
  CoinCollectSuccess3: "กรุณานำเงินออกจากล่องให้หมด แล้วใส่กล่องกลับ",
  CoinIncasset: "นำเหรียญออกไม่หมด กดปุ่มปลดล็อคกล่องเหรียญ",
  CoinIncasset1: "กรุณาเปิดประตู นำกล่องเหรียญออก",
  CoinIncasset2: "กรุณานำเงินออกให้หมดแล้วใส่กล่องกลับ",
  Note1: "กรุณากดปุ่มปลดล็อคกล่องธนบัตร",
  Note2: "กรุณาเปิดประตูนำกล่องธนบัตรออก",
  Note3: "กรุณาดึงกล่องธนบัตรออก",
  Note4: "กรุณานำเงินออกแล้วใส่กล่องธนบัตรกลับ",
  Note5: "กรุณารอสักครู่",
  Note6: "กรุณารอสักครู่",
  NoteCheck: "กรุณารอตรวจสอบธนบัตรในเครื่องอีกครั้ง",
  Note7: "นำเงินออกหมดแล้ว กรุณารอสักครู่",
  Note8: "นำเงินออกหมดแล้ว กรุณารอสักครู่",
  NoteCollect: "เครื่องกำลังนำธนบัตรลงกล่อง",
  NoteCollectSuccess: "กรุณากดปุ่มปลดล็อคกล่องธนบัตร",
  NoteCollectSuccess1: "กรุณาเปิดประตูนำกล่องธนบัตรออก",
  NoteCollectSuccess2: "กรุณาดึงกล่องธนบัตรออก",
  NoteCollectSuccess3: "กรุณานำเงินออกให้หมดแล้วใส่กล่องกลับ",
  NoteIncasset: "นำธนบัตรออกไม่หมด กดปุ่มปลดล็อคกล่องธนบัตร",
  NoteIncasset1: "กรุณาเปิดประตูนำกล่องธนบัตรออก",
  NoteIncasset2: "กรุณาดึงกล่องธนบัตรออก",
  NoteIncasset3: "กรุณานำเงินออกให้หมดแล้วใส่กล่องกลับ",
  NotCasset: "กรุณาใส่กล่องธนบัตร กดปุ่มปลดล็อค",
  NotCasset1: "กรุณาเปิดประตูใส่กล่องธนบัตร",
  NotCasset2: "กรุณาใส่กล่องเก็บธนบัตรกลับ",
  finished: "นำเงินออกหมดแล้ว",
  success: "ปิดสิ้นวันเสร็จสิ้น",
};

export const EOD_STATE_LIST_CI10X = [
  {
    value: "start",
    label: "START",
    no: "0",
    steps: [],
  },
  {
    value: "collet",
    no: "1",
    label: "Collect",
    steps: [],
  },
  {
    value: "coin",
    no: "2",
    label: "Coin",
    steps: [
      {
        value: "released",
        no: "2.1",
        label: "Released",
      },
      {
        value: "returned",
        no: "2.2",
        label: "Returned",
      },
      {
        value: "finished",
        no: "2.3",
        label: "Finished",
      },
    ],
  },
  {
    value: "note",
    no: "3",
    label: "Note",
    steps: [
      {
        value: "released",
        no: "3.1",
        label: "Released",
      },
      {
        value: "returned",
        no: "3.2",
        label: "Returned",
      },
      {
        value: "finished",
        no: "3.3",
        label: "Finished",
      },
    ],
  },
  {
    value: "end",
    label: "END",
    no: "4",
    steps: [],
  },
] as IEODState[];

const noCondition = {
  note: [] as string[],
  coin: [] as string[],
};

export type TMcStateCI10X =
  | "start"
  | "Collect"
  | "CoinCollect"
  | "collectSuccess"
  | "Coin1"
  | "Coin2"
  | "Coin3"
  | "Coin4"
  | "CoinCheck"
  | "NotCassetCoin"
  | "NotCassetCoin1"
  | "CoinCollectSuccess"
  | "CoinCollectSuccess2"
  | "CoinCollectSuccess3"
  | "CoinIncasset"
  | "CoinIncasset1"
  | "CoinIncasset2"
  | "Note1"
  | "Note2"
  | "Note3"
  | "Note4"
  | "Note5"
  | "NoteCheck"
  | "Note6"
  | "Note7"
  | "Note8"
  | "NoteCollect"
  | "NoteCollectSuccess"
  | "NoteCollectSuccess1"
  | "NoteCollectSuccess2"
  | "NoteCollectSuccess3"
  | "NoteIncasset"
  | "NoteIncasset1"
  | "NoteIncasset2"
  | "NoteIncasset3"
  | "NotCasset"
  | "NotCasset1"
  | "NotCasset2"
  | "finished"
  | "success";

export const EOD_MC_CI10X_COND = {
  start: noCondition,
  Collect: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER"],
    coin: ["StatusChange STATUS_IDLE", "Full COFB"],
  },
  collectSuccess: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForOpening COLLECTION DOOR",
      "WaitForRemoving COFB",
      "WaitForInsertion COFB",
      "WaitForInsertion COLLECTION_BOX",
      "Missing COFB",
      "Removed COFB",
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
    ],
  },
  Coin1: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForRemoving COFB",
      "WaitForInsertion COFB",
      "WaitForInsertion COLLECTION_BOX",
      "Missing COFB",
      "Removed COFB",
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
    ],
  },
  Coin2: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
      "StatusChange STATUS_IDLE",
      "Empty COFB",
      // "WaitForInsertion COFB",
      // "WaitForInsertion COLLECTION_BOX",
    ],
  },

  Coin3: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "Empty COFB",
      "StatusChange STATUS_IDLE",
      "WaitForInsertion COFB",
      "WaitForInsertion COLLECTION_BOX",
    ],
  },

  CoinCheck: noCondition,

  // กรณีเหรียญมากกว่า 1 ครั้ง
  CoinCollect: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: ["StatusChange STATUS_IDLE", "Full COFB"],
  },
  CoinCollectSuccess: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForOpening COLLECTION DOOR",
      "WaitForRemoving COFB",
      "WaitForInsertion COFB",
      "WaitForInsertion COLLECTION_BOX",
      "Missing COFB",
      "Removed COFB",
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
    ],
  },
  CoinCollectSuccess2: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForRemoving COFB",
      "WaitForInsertion COFB",
      "WaitForInsertion COLLECTION_BOX",
      "Missing COFB",
      "Removed COFB",
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
    ],
  },
  CoinCollectSuccess3: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
      "StatusChange STATUS_IDLE",
      "Empty COFB",
      // "WaitForInsertion COFB",
      // "WaitForInsertion COLLECTION_BOX",
    ],
  },

  // กรณีนำเหรียญออกจากกล่องไม่หมด
  CoinIncasset: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForOpening COLLECTION DOOR",
      "WaitForRemoving COFB",
      "WaitForInsertion COFB",
      "WaitForInsertion COLLECTION_BOX",
      "Missing COFB",
      "Removed COFB",
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
    ],
  },
  CoinIncasset1: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForRemoving COFB",
      "WaitForInsertion COFB",
      "WaitForInsertion COLLECTION_BOX",
      "Missing COFB",
      "Removed COFB",
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
    ],
  },
  CoinIncasset2: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
      "StatusChange STATUS_IDLE",
      "Empty COFB",
      // "WaitForInsertion COFB",
      // "WaitForInsertion COLLECTION_BOX",
    ],
  },

  // กรณีไม่ได้ใส่กล่องเก็บเหรียญ
  NotCassetCoin: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForOpening COLLECTION DOOR",
      "WaitForRemoving COFB",
      "WaitForInsertion COFB",
      "WaitForInsertion COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
    ],
  },

  NotCassetCoin1: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      // "WaitForInsertion COFB",
      // "WaitForInsertion COLLECTION_BOX",
      // "WaitForRemoving COFB",
      "StatusChange STATUS_BUSY",
      "Locked COLLECTION DOOR",
      "Closed COLLECTION DOOR",
      "StatusChange STATUS_IDLE",
      "Empty COFB",
    ],
  },

  // ธนบัตร
  Note1: {
    note: [
      "WaitForOpening COLLECTION DOOR",
      "Opened COLLECTION DOOR",
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  Note2: {
    note: [
      "Opened COLLECTION DOOR",
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  Note3: {
    note: [
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  Note4: {
    note: [
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  Note5: noCondition,

  Note6: {
    note: ["StatusChange STATUS_IDLE", "WaitForInsertion COLLECTION_BOX"],
    coin: ["StatusChange STATUS_IDLE", "Empty COFB"],
  },

  NoteCheck: noCondition,

  Note7: {
    note: ["StatusChange STATUS_IDLE"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  Note8: noCondition,

  // กรณีธนบัตรยังไม่หมด
  NoteCollect: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER"],
    coin: ["StatusChange STATUS_IDLE", "Empty COFB"],
  },
  NoteCollectSuccess: {
    note: [
      "WaitForOpening COLLECTION DOOR",
      "Opened COLLECTION DOOR",
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteCollectSuccess1: {
    note: [
      "Opened COLLECTION DOOR",
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteCollectSuccess2: {
    note: [
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteCollectSuccess3: {
    note: [
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  // กรณีนำธนบัตรออกไม่หมด
  NoteIncasset: {
    note: [
      "WaitForOpening COLLECTION DOOR",
      "Opened COLLECTION DOOR",
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteIncasset1: {
    note: [
      "Opened COLLECTION DOOR",
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteIncasset2: {
    note: [
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteIncasset3: {
    note: [
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  // กรณีลืมใส่กล่องธนบัตรกลับ
  NotCasset: {
    note: [
      "WaitForOpening COLLECTION DOOR",
      "Opened COLLECTION DOOR",
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NotCasset1: {
    note: [
      "Opened COLLECTION DOOR",
      "WaitForRemoving COLLECTION_BOX",
      "WaitForInsertion COLLECTION_BOX",
      "Removed COLLECTION_BOX",
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NotCasset2: {
    note: [
      "StatusChange STATUS_BUSY",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
      "StatusChange STATUS_IDLE",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  finished: noCondition,
  success: noCondition,
};
