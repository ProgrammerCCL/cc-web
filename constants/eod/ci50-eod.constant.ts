import { IEODState } from "@/types/model/endOfDay.type";

export type TMcStateCI50 =
  | "start"
  | "Collect"
  | "CoinCollect"
  | "collectSuccess"
  | "Coin1"
  | "Coin2"
  | "Coin3"
  | "CoinCollectSuccess"
  | "CoinCollectSuccess2"
  | "CoinCollectSuccess3"
  | "CoinCollectSuccess4"
  | "CoinIncasset"
  | "CoinIncasset1"
  | "CoinIncasset2"
  | "CoinIncasset3"
  | "Note1"
  | "Note2"
  | "Note3"
  | "Note4"
  | "Note5"
  | "Note6"
  | "Note7"
  | "NoteCollect"
  | "NoteCollectSuccess"
  | "NoteCollectSuccess1"
  | "NoteCollectSuccess2"
  | "NoteIncasset"
  | "NoteIncasset1"
  | "NoteIncasset2"
  | "NotCasset"
  | "NotCasset1"
  | "finished"
  | "success";

export const STATUS_MSG_CI50 = {
  start: "Model CI50B",
  Collect: "เครื่องกำลังนำเงินลงกล่อง",
  CoinCollect: "เครื่องกำลังนำเงินลงกล่อง",
  collectSuccess: "กรุณากดปุ่มปลดล็อคกล่องเหรียญ",
  Coin1: "กรุณานำกล่องเหรียญออก",
  Coin2: "กรุณานำเงินออกจากกล่องให้หมด แล้วใส่กล่องกลับ",
  Coin3: "กรุณารอตรวจสอบเหรียญในเครื่องอีกครั้ง",
  CoinCollectSuccess: "กรุณากดปุ่มปลดล็อคกล่องเหรียญ",
  CoinCollectSuccess2: "กรุณานำกล่องเหรียญออก",
  CoinCollectSuccess3: "กรุณานำเงินออกจากล่องให้หมด แล้วใส่กล่องกลับ",
  CoinCollectSuccess4: "กรุณารอตรวจสอบหรียญในเครื่องอีกครั้ง",
  CoinIncasset: "นำเหรียญออกไม่หมด กดปุ่มปลดล็อคกล่องเหรียญ",
  CoinIncasset1: "กรุณานำกล่องเหรียญออก",
  CoinIncasset2: "กรุณานำเงินออกให้หมดแล้วใส่กล่องกลับ",
  CoinIncasset3: "กรุณารอตรวจสอบหรียญในเครื่องอีกครั้ง",
  Note1: "กรุณาเปิดประตูเซฟเครื่องธนบัตร",
  Note2: "กรุณานำกล่องบรรจุธนบัตรออก",
  Note3: "กรุณานำเงินออกแล้วใส่กล่องธนบัตรกลับ",
  Note4: "กรุณารอสักครู่",
  Note5: "กรุณารอสักครู่",
  NoteCheck: "กรุณารอตรวจสอบธนบัตรในเครื่องอีกครั้ง",
  Note6: "นำเงินออกหมดแล้ว กรุณารอสักครู่",
  Note7: "นำเงินออกหมดแล้ว กรุณารอสักครู่",
  NoteCollect: "เครื่องกำลังนำธนบัตรลงกล่อง",
  NoteCollectSuccess: "กรุณาเปิดประตูเซฟเครื่องธนบัตร",
  NoteCollectSuccess1: "กรุณานำกล่องบรรจุธนบัตรออก",
  NoteCollectSuccess2: "กรุณานำเงินออกให้หมดแล้วใส่กล่องกลับ",
  NoteIncasset: "นำธนบัตรออกไม่หมด กรุณาเปิดประตูเซฟเครื่องธนบัตร",
  NoteIncasset1: "กรุณานำกล่องบรรจุธนบัตรออก",
  NoteIncasset2: "กรุณานำเงินออกให้หมดแล้วใส่กล่องกลับ",
  NotCasset: "กรุณาใส่กล่องธนบัตร เปิดประตูเซฟเครื่องธนบัตร",
  NotCasset1: "กรุณาใส่กล่องเก็บธนบัตรกลับ",
  finished: "นำเงินออกหมดแล้ว",
  success: "ปิดสิ้นวันเสร็จสิ้น",
};

export const EOD_STATE_LIST_CI50 = [
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

export const EOD_MC_CI50_COND = {
  start: noCondition,
  Collect: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER"],
    coin: ["StatusChange STATUS_IDLE", "Full COFB"],
  },
  collectSuccess: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForRemoving COFB",
      "WaitForOpening COLLECTION DOOR",
      "WaitForInsertion COFB",
      "Missing COFB",
      "Removed COFB",
    ],
  },
  Coin1: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForInsertion COFB",
      "Missing COFB",
      "Removed COFB",
      "Empty COFB",
      "StatusChange STATUS_IDLE",
    ],
  },
  Coin2: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  Coin3: noCondition,

  // กรณีเหรียญมากกว่า 1 ครั้ง
  CoinCollect: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: ["StatusChange STATUS_IDLE", "Full COFB"],
  },
  CoinCollectSuccess: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForRemoving COFB",
      "WaitForOpening COLLECTION DOOR",
      "WaitForInsertion COFB",
      "Missing COFB",
      "Removed COFB",
    ],
  },
  CoinCollectSuccess2: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForInsertion COFB",
      "Missing COFB",
      "Removed COFB",
      "Empty COFB",
      "StatusChange STATUS_IDLE",
    ],
  },
  CoinCollectSuccess3: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  CoinCollectSuccess4: noCondition,

  // กรณีนำเหรียญออกจากกล่องไม่หมด
  CoinIncasset: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForRemoving COFB",
      "WaitForOpening COLLECTION DOOR",
      "WaitForInsertion COFB",
      "Missing COFB",
      "Removed COFB",
    ],
  },
  CoinIncasset1: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: [
      "WaitForInsertion COFB",
      "Missing COFB",
      "Removed COFB",
      "Empty COFB",
      "StatusChange STATUS_IDLE",
    ],
  },
  CoinIncasset2: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER", ""],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  CoinIncasset3: noCondition,

  Note1: {
    note: [
      "Opened COLLECTION DOOR",
      "StatusChange STATUS_BUSY",
      "Missing CONTAINER_C4A_COUNTER",
      "Empty CONTAINER_C4A_COUNTER",
      "Removed COLLECTION_BOX",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  Note2: {
    note: [
      "Missing CONTAINER_C4A_COUNTER",
      "Empty CONTAINER_C4A_COUNTER",
      "Removed COLLECTION_BOX",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  Note3: {
    note: [
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

  Note4: noCondition,

  Note5: {
    note: ["StatusChange STATUS_IDLE", "WaitForInsertion COLLECTION_BOX"],
    coin: ["StatusChange STATUS_IDLE", "Empty COFB"],
  },
  Note6: {
    note: ["StatusChange STATUS_IDLE"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  Note7: noCondition,

  NoteCheck: noCondition,

  // กรณีธนบัตรยังมีใน stacker
  NoteCollect: {
    note: ["StatusChange STATUS_IDLE"],
    coin: ["StatusChange STATUS_IDLE", "Empty COFB"],
  },
  NoteCollectSuccess: {
    note: [
      "Opened COLLECTION DOOR",
      "StatusChange STATUS_BUSY",
      "Missing CONTAINER_C4A_COUNTER",
      "Empty CONTAINER_C4A_COUNTER",
      "Removed COLLECTION_BOX",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteCollectSuccess1: {
    note: [
      "Missing CONTAINER_C4A_COUNTER",
      "Empty CONTAINER_C4A_COUNTER",
      "Removed COLLECTION_BOX",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteCollectSuccess2: {
    note: [
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
      "Opened COLLECTION DOOR",
      "StatusChange STATUS_BUSY",
      "Missing CONTAINER_C4A_COUNTER",
      "Empty CONTAINER_C4A_COUNTER",
      "Removed COLLECTION_BOX",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteIncasset1: {
    note: [
      "Missing CONTAINER_C4A_COUNTER",
      "Empty CONTAINER_C4A_COUNTER",
      "Removed COLLECTION_BOX",
      "Closed COLLECTION DOOR",
      "Locked COLLECTION DOOR",
      "CassetteInserted 20069703",
      "CassetteInSerted20020459",
      "CassetteInserted 20005555",
      "CassetteInSerted00000000",
      "CassetteInSerted ffffffff",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteIncasset2: {
    note: [
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
      "Opened COLLECTION DOOR",
      "StatusChange STATUS_BUSY",
      "Missing CONTAINER_C4A_COUNTER",
      "Empty CONTAINER_C4A_COUNTER",
      "Removed COLLECTION_BOX",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NotCasset1: {
    note: [
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
