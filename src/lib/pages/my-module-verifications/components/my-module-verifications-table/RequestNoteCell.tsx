import { observer } from "mobx-react-lite";

import type { MoveVerifyTaskInfo } from "../../data";
import { useCelatoneApp } from "lib/app-provider";
import { EditableCell } from "lib/components/table";
import { useMoveVerifyTaskStore } from "lib/providers/store";

interface RequestNoteProps {
  moveVerifyTask: MoveVerifyTaskInfo;
}

export const RequestNoteCell = observer(
  ({ moveVerifyTask }: RequestNoteProps) => {
    const { constants } = useCelatoneApp();
    const { updateRequestNote } = useMoveVerifyTaskStore();

    return (
      <EditableCell
        defaultValue={
          moveVerifyTask.requestNote && moveVerifyTask.requestNote.length > 0
            ? moveVerifyTask.requestNote
            : "-"
        }
        initialValue={moveVerifyTask.requestNote}
        maxLength={constants.maxMoveVerifyTaskRequestNoteLength}
        onSave={(value) => updateRequestNote(moveVerifyTask.taskId, value)}
      />
    );
  }
);
