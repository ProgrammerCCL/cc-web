// import { TDateReport } from "@/types/model";

export const SectionReport = [
  {
    key: "receive",
    iconURL: "/assets/icons/badge-dollar-sign.svg",
    label: "ยอดรับซื้อเงินสดทั้งหมด (THB)",
    transType: "receive",
  },
  {
    key: "refill",
    iconURL: "/assets/icons/archive-restore.svg",
    label: "ยอดเติมเงินทั้งหมด (THB)",
    transType: "refill",
  },
  {
    key: "dispense",
    iconURL: "/assets/icons/archive.svg",
    label: "ยอดถอนทั้งหมด (THB)",
    transType: "dispense",
  },
  {
    key: "refund",
    iconURL: "/assets/icons/piggy-bank.svg",
    label: "ยอดคืนเงินทั้งหมด (THB)",
    transType: "refund",
  },
];
