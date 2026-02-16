import { IEODState } from "@/types/model/endOfDay.type";

export type TMcStateCI05 =
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
  | "NoteCollect"
  | "NoteCollectSuccess"
  | "NoteCollectSuccess1"
  | "NoteCollectSuccess2"
  | "NoteCollectSuccess3"
  | "NoteIncasset"
  | "NoteIncasset1"
  | "NoteIncasset2"
  | "finished"
  | "success";

export const STATUS_MSG_CI5 = {
  start: "Model CI05B",
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
  CoinIncasset2: "กรุณานำเงินออกให้หมด แล้วใส่กล่องกลับ",
  CoinIncasset3: "กรุณารอตรวจสอบหรียญในเครื่องอีกครั้ง",
  Note1: "กรุณาไขกุญแจดอกสีเหลืองเพื่อปลดล็อคกล่องธนบัตร",
  Note2: "กรุณานำเงินออกจากกล่องให้หมด แล้วใส่กล่องกลับ",
  Note3: "กรุณารอตรวจสอบธนบัตรในเครื่องอีกครั้ง",
  Note4: "นำเงินออกหมดแล้ว กรุณารอสักครู่",
  Note5: "กรุณารอสักครู่",
  NoteCollect: "เครื่องกำลังนำเงินลงกล่อง",
  NoteCollectSuccess: "กรุณาไขกุญแจดอกสีเหลืองเพื่อปลดล็อคกล่องบรรจุธนบัตร",
  NoteCollectSuccess1: "กรุณานำเงินออกจากกล่องให้หมด แล้วใส่กล่องกลับ",
  NoteCollectSuccess2: "กรุณารอตรวจสอบธนบัตรในเครื่องอีกครั้ง",
  NoteCollectSuccess3: "กรุณารอสักครู่",
  NoteIncasset: "นำธนบัตรออกไม่หมด กรุณาไขกุญแจดอกสีเหลืองเพื่อปลดล็อคกล่อง",
  NoteIncasset1: "กรุณานำเงินออกให้หมด แล้วใส่กล่องกลับ",
  NoteIncasset2: "กรุณารอตรวจสอบธนบัตรในเครื่องอีกครั้ง",
  finished: "นำเงินออกหมดแล้ว",
  success: "ปิดสิ้นวันเสร็จสิ้น",
};

export const EOD_STATE_LIST_CI5 = [
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

export const EOD_MC_CI5_COND = {
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
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
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
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  Note3: noCondition,

  Note4: {
    note: ["StatusChange STATUS_IDLE", "Empty CONTAINER_C4A_COUNTER"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },

  Note5: noCondition,

  // กรณีธนบัตรมากกว่า 1 ครั้ง
  NoteCollect: {
    note: ["StatusChange STATUS_IDLE", "Full CONTAINER_C4A_COUNTER"],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteCollectSuccess: {
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
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteCollectSuccess1: {
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
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteCollectSuccess2: noCondition,

  // กรณีนำธนบัตรออกจากกล่องไม่หมด
  NoteIncasset: {
    note: [
      "Opened COLLECTION DOOR",
      "WaitRemoving COLLECTION_BOX",
      "Missing COLLECTION_BOX",
      "Missing CONTAINER_C4B_COUNTER",
      "Removed COLLECTION_BOX",
    ],
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteIncasset1: {
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
    coin: ["Empty COFB", "StatusChange STATUS_IDLE"],
  },
  NoteIncasset2: noCondition,

  finished: noCondition,
  success: noCondition,
};
