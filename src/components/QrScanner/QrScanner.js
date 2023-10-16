import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";

const QRCodeScanner = ({ onScan, toggleQrScanner }) => {
  const [data, setData] = useState("");

  useEffect(() => {
    if (data) {
      onScan(data);
      toggleQrScanner();

      // Play the beep sound when data becomes true
      const audio = new Audio("scanner-beep.mp3");
      audio.play();

      // Reset data after playing the sound
      setTimeout(() => {
        setData("");
      }, 500); // Adjust the timeout as needed
    }
  }, [data, onScan, toggleQrScanner]);

  return (
    <div>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: "200%" }}
      />
    </div>
  );
};

export default QRCodeScanner;
