import { createTheme } from "@mui/material";
import React, {  useState } from "react";
import { skateDecks } from "./mocks/skate-decks";
import SkateEditor from "./components/index";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#de2a5e",
    },
  },
});

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function ICApp() {
  const [connected, setConnected] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [principalId, setPrincipalId] = useState(false);
  const [mintTraits, setMintTraits] = useState({ neck: null, head: null, chest: null, body: null, legs: null, hand: null, waist: null, foot: null })
  const [PreviewCanvas, setPreviewCanvas] = useState(null)

  const handleConnect = (principalId) => {
    console.log("Logged in with principalId", principalId);
    setPrincipalId(principalId);
    setConnected(true);
  }

  const handleFail = (error) => {
    console.log("Failed to login with Plug", error);
  }

  return (
    <>
      <SkateEditor theme={theme} decks={skateDecks} setMintTraits={setMintTraits} setPreviewCanvas={setPreviewCanvas} />

    </>
  );
}