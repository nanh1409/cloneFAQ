import { Box, Button, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import React, { PropsWithoutRef } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { setOpenSelectStateDialog } from "../../../app/redux/reducers/states.slice";
import { DMVSubject } from "../../../types/appPracticeTypes";

const DMVChangeStateButton = (props: PropsWithoutRef<{ subject: DMVSubject }>) => {
  const { subject } = props;
  const statesList = useSelector((state) => state.state.statesList);
  const currentState = useSelector((state) => state.state.currentState);
  const dispatch = useDispatch();
  const router = useRouter();
  return <Box display="flex" justifyContent="center" sx={{ mt: "36px" }}>
    <Tooltip title="not your state?" placement="bottom-end" arrow>
      <Button sx={{
        width: 300, height: 70, background: "#F5C718 !important", borderRadius: 50,
        color: "#fff !important", fontSize: 24, fontWeight: 700,
      }}
        onClick={() => {
          dispatch(setOpenSelectStateDialog({
            open: true,
            onSelect: (stateSlug) => {
              const state = statesList.find(({ slug }) => slug === stateSlug);
              if (state) router.push(`/${stateSlug}/${state.shortSlug}-${subject}-practice-test`);
            }
          }))
        }}
      >
        {currentState?.name}
      </Button>
    </Tooltip>
  </Box>
}

export default DMVChangeStateButton;