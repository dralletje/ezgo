import React from "react";
import styled from "styled-components/macro";

import { View } from "../components/base";
import Button from "./Button";

let Title = styled(View)`
  font-size: 35px;
  padding: 20px;
  padding-top: 50px;

  color: #eee;
  text-shadow: 0 14px 28px rgba(0, 0, 0, 0.5), 0 10px 10px rgba(0, 0, 0, 0.5);
`;

let SetupScreen = ({ setColor }) => {
  return (
    <View
      style={{ flex: 1, textAlign: "center", width: "auto", margin: "auto" }}
    >
      <Title>WHiCh ColOUR YoU WanT 2 🐝 ?</Title>

      <Button
        onPress={() => setColor("black")}
        stoneStyle={{ backgroundColor: "black" }}
        stoneClassName={Button.down}
        children="BLACK"
      />

      <Button
        onPress={() => setColor("white")}
        stoneStyle={{ backgroundColor: "white" }}
        stoneClassName={Button.right}
        children="WHITE"
      />
    </View>
  );
};

export default SetupScreen;
