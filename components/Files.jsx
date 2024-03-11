import React from "react";

const GATEWAY_URL = "https://peach-tremendous-hare-200.mypinata.cloud";

export default function Files(props) {
  return (
    <div className="file-viewer">
      <p>Your IPFS CID:</p>
      <p>{props.cid}</p>
      <img
        src={`${GATEWAY_URL}/ipfs/${props.cid}?pinataGatewayToken=${process.env.NEXT_PUBLIC_GATEWAY_TOKEN}`}
        alt="File"
        width="100%" // Set your desired width here
        height="200" // Set your desired height here
      />
    </div>
  );
}
