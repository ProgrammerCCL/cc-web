import {
  TMcStateRemoveCI10,
  TMcStateRemoveCI05,
  TMcStateRemoveCI50,
  REM_MC_CI10_COND,
  REM_MC_CI50_COND,
  REM_MC_CI05_COND,
} from "@/constants/removeCassete";
interface checkRemoveCasseteMcStatusParams {
  model: string;
  state: TMcStateRemoveCI10 | TMcStateRemoveCI05 | TMcStateRemoveCI50;
  noteStatus: string;
  coinStatus: string;
}

const getModelConstant = (model: string) => {
  switch (model) {
    case "CI-10BX":
      return REM_MC_CI10_COND;
    case "CI-10B":
      return REM_MC_CI10_COND;
    case "CI-05B":
      return REM_MC_CI05_COND;
    case "CI-50B":
      return REM_MC_CI50_COND;
  }
};

export const checkRemoveMcStatus = ({
  model,
  state,
  noteStatus,
  coinStatus,
}: checkRemoveCasseteMcStatusParams) => {
  try {
    const modelConst = getModelConstant(model);

    if (!modelConst) return false;

    const thisState = modelConst[state as keyof typeof modelConst];

    if (!thisState) return false;

    if (
      (thisState.note as string[]).includes(noteStatus) &&
      (thisState.coin as string[]).includes(coinStatus)
    ) {
      return true;
    }
  } catch (err: any) {
    console.error("[ERROR]", err.message);
  }
  return false;
};
