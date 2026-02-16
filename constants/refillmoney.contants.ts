import { IBathItem } from "@/types/model";

// ================================================
// Default Refill Money
// ================================================
// key must be a string of number. represent the denomination value.
// imgURL must be a string of image url.
// label must be a string of display value.
// stock must be a number of stock.
// needed must be a number of needed.
// cash must be a number of cash changed eg. cashIn or refill.
// isNote must be a boolean of is note.

export const DEFAULT_REFILL_NOTE = [
  {
    key: "1000",
    imgURL: "/assets/images/1000THB-17th-Banknote-Front.jpg",
    label: "1,000",
    stock: 0,
    needed: 0,
    cash: 0,
    isNote: true,
  },
  {
    key: "500",
    imgURL: "/assets/images/500THB-17th-Banknote-Front.jpg",
    label: "500",
    stock: 0,
    needed: 0,
    cash: 0,
    isNote: true,
  },
  {
    key: "100",
    imgURL: "/assets/images/100THB-17th-Banknote-Front.jpeg",
    label: "100",
    stock: 0,
    needed: 0,
    cash: 0,
    isNote: true,
  },
  {
    key: "50",
    imgURL: "/assets/images/50THB-17th-Banknote-Front.jpg",
    label: "50",
    stock: 0,
    needed: 0,
    cash: 0,
    isNote: true,
  },
  {
    key: "20",
    imgURL: "/assets/images/20THB-17th-Banknote-Front.jpg",
    label: "20",
    stock: 0,
    needed: 0,
    cash: 0,
    isNote: true,
  },
] as IBathItem[];

export const DEFAULT_REFILL_COIN = [
  {
    key: "10",
    imgURL: "/assets/images/10.png",
    label: "10",
    stock: 0,
    needed: 0,
    cash: 0,
  },
  {
    key: "5",
    imgURL: "/assets/images/5.png",
    label: "5",
    stock: 0,
    needed: 0,
    cash: 0,
  },
  {
    key: "2",
    imgURL: "/assets/images/2 Coin.png",
    label: "2",
    stock: 0,
    needed: 0,
    cash: 0,
  },
  {
    key: "1",
    imgURL: "/assets/images/1 Coin.png",
    label: "1",
    stock: 0,
    needed: 0,
    cash: 0,
  },
  {
    key: "0.50",
    imgURL: "/assets/images/0.5 Coin.png",
    label: "0.50",
    stock: 0,
    needed: 0,
    cash: 0,
  },
  {
    key: "0.25",
    imgURL: "/assets/images/0.25 Coin.png",
    label: "0.25",
    stock: 0,
    needed: 0,
    cash: 0,
  },
] as IBathItem[];
