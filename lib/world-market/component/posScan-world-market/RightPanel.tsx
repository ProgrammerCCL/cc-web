// import { Button } from "react-day-picker";
// import { NumpadButton } from "../numpad";

// interface RightPanelProps {
//   saleAmount: string;
//   formatNumber: (value: string) => string;
//   MAIN_NUMPAD: string[];
//   handleNumpadClick: (value: string) => void;
//   handleStartSale: () => void;
//   isStart: boolean;
//   isConfirmDisabled: boolean;
// }

// const RightPanel: React.FC<RightPanelProps> = ({
//   saleAmount,
//   formatNumber,
//   MAIN_NUMPAD,
//   handleNumpadClick,
//   handleStartSale,
//   isStart,
//   isConfirmDisabled,
// }) => {
//   return (
//     <div className="flex h-full w-1/2 flex-col items-center justify-between rounded-2xl bg-white p-6">
//       {/* ข้อความ "กรุณาระบุยอดเงิน" */}
//       <div className="mb-2 w-full text-center text-4xl text-gray-900">
//         กรุณาระบุยอดเงินที่ต้องการจ่าย
//       </div>

//       {/* ระบบยอดที่ต้องการ */}
//       <div className="my-6 flex h-20 w-full items-center justify-center rounded-md border-2 border-gray-300 bg-slate-50 text-center text-6xl tracking-widest text-gray-900 shadow-inner md:h-[140px]">
//         <span>{formatNumber(saleAmount)}</span>
//       </div>

//       {/* ข้อความ "บาท" */}
//       <div className="mb-6 w-full text-center text-2xl text-gray-900">บาท</div>

//       {/* แสดงปุ่มตัวเลข */}
//       <div className="mb-6 grid w-full grid-cols-3 gap-3">
//         {MAIN_NUMPAD.map((val) => (
//           <NumpadButton
//             key={val}
//             value={val}
//             onClick={handleNumpadClick}
//             className={val === "0" ? "col-span-2" : ""}
//           />
//         ))}
//         <NumpadButton value={"C"} onClick={handleNumpadClick} />
//       </div>

//       {/* ปุ่มชำระเงิน */}
//       <div className="mb-4 w-full">
//         <Button
//           type="button"
//           className="h-24 w-full border-2 border-black bg-blue-800 text-4xl text-white hover:bg-zinc-800"
//           variant="default"
//           onClick={handleStartSale}
//           disabled={isStart || isConfirmDisabled}
//         >
//           {isStart
//             ? "Starting..."
//             : isConfirmDisabled
//               ? "Cannot Sale"
//               : "ชำระเงิน"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default RightPanel;
