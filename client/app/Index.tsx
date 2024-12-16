import React from "react";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/HomeScreen" />;
}

// This page is only to make HomeScreen the defualt homePage for any start simulator!