import React from "react";
import CyberFeedList from "./CyberFeedList";

export default function CyberFeedWidget() {
  return (
    <CyberFeedList limit={3} showHeader />
  );
}
