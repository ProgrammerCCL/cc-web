import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface DialogProps {
  isOpen?: boolean;
  massage?: string;
  headerError?: string;
  headerFinish?: string;
  isError?: boolean;
  isFinish?: boolean;
  onCloseCallback?: () => void;
  action?: ReactNode;
}

export function DialogComponent(props: DialogProps) {
  const {
    isOpen,
    isError,
    isFinish,
    massage,
    action,
    headerError,
    headerFinish,
    onCloseCallback,
  } = props;

  const handleClose = () => {
    if (onCloseCallback) {
      onCloseCallback();
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={isError ? "text-red-500" : ""}>
            {isError ? headerError : headerFinish}
          </DialogTitle>
          <DialogDescription>{massage}</DialogDescription>
          {isFinish ? (
            ""
          ) : (
            <DialogDescription className="mx-auto">
              {action ? (
                <div className="w-80 justify-center py-4">{action}</div>
              ) : (
                <Loader2 className=" animate-spin" width={50} height={50} />
              )}
            </DialogDescription>
          )}
        </DialogHeader>
        {isFinish ? (
          <div className="flex-center">
            <Button
              className="mx-auto mt-4 w-1/3"
              variant={"default"}
              onClick={() => handleClose()}
            >
              Close
            </Button>
          </div>
        ) : (
          ""
        )}
      </DialogContent>
    </Dialog>
  );
}
