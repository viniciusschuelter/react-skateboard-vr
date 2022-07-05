import { Avatar } from "@mui/material"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import * as React from "react"
import { skateParts } from "../mocks/skate-parts"

export default function Editor(props: any) {
  const { category, setCategory }: any = props

  const selectorButton = {
    color: "#AAA",
    minWidth: "60px",
    cursor: "pointer"
  }

  const selectorButtonActive = {
    color: "#DDD",
    fontWeight: "700",
  }

  const selectorText = {
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "8px",
  }

  const selectorButtonIcon = {
    width: "50px",
    height: "50px",
    padding: "4px",
    marginBottom: "4px",
    borderRadius: "50%",
    backgroundColor: "rgb(255 155 0 / 25%)",
  }

  const categoriesRendered = skateParts.map((item) => {
    return (
      <div
        onClick={() => setCategory(item.part)}
        style={{
          ...selectorButton,
          ...(category === item.part && selectorButtonActive),
        }}
      >
        <Avatar style={selectorButtonIcon} src={`/${item.part}.png`} />
        <span style={selectorText}>{item.part}</span>
      </div>
    )
  })

  return (
    <div
      style={{
        position: "absolute",
        left: "0",
        bottom: "0",
        width: "100vw",
        backgroundColor: "rgba(0,0,0, 0,25)",
        padding: "14px 0",
      }}
    >
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        textAlign="center"
        justifyContent="center"
        alignItems="center"
      >
        {categoriesRendered}
      </Stack>
    </div>
  )
}
