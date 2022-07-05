import { Avatar } from "@mui/material";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import * as React from "react";
import {skateParts} from '../data/skate-parts';

export default function Editor(props: any) {
  const { category, setCategory }: any = props;

  const selectorButton = {
    color: "#999999",
    fontSize: "12px",
    minWidth: "60px",
    cursor: "pointer",
  }

  const selectorButtonActive = {
    color: "#666666",
    fontSize: "12px",
    minWidth: "60px",
    cursor: "pointer",
  }

  const selectorButtonIcon = {
    display: "inline-block",
    width: "40px",
    height: "40px",
    padding: "2px",
  }

  const categoriesRendered = skateParts.map( item => {
    return (
        <div onClick={() => setCategory(item.part)} style={category && category === item.part ? selectorButton : selectorButtonActive}>
          <Avatar style={selectorButtonIcon} src={`/${item.part}.png`} />
          <br />
          {item.part}
        </div>
    );
  })

  return (
    <div style={{
      position: "absolute",
      left: "0",
      bottom: "0",
      width: "100vw",
      backgroundColor: "#111111",
      borderTop: "1px solid #303030",
      padding: "14px 0",
    }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        {categoriesRendered}
      </Stack>
    </div>
  );
}