import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRCodeScanner = ({ onScan, toggleQrScanner }) => {
  const [data, setData] = useState("");

  if (data) {
    onScan(data);
    toggleQrScanner();
    setData("");
  }

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
        style={{ width: "100%" }}
      />
      <p>{data}</p>
    </div>
  );
};

export default QRCodeScanner;
