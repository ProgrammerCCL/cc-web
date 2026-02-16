import { Button } from "@/components/ui/button";

type CancelButtonProps = {
  onClick?: () => void;
};

export function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="rounded-2xl border-2 border-red-400 bg-white py-8 text-2xl text-red-400 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white"
    >
      ยกเลิกการชำระเงิน
    </Button>
  );
}
