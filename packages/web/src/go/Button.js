import React from "react";
import styled from "styled-components/macro";
import { View, Card } from "../components/base";

let TopField = styled(View)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 50%;
  border-right: 1px solid gray;
  transition: all 0.2s ease-in;
`;

let BottomField = styled(View)`
  position: absolute;
  top: 0;
  bottom: 45%;
  left: 0;
  right: 0;
  border-bottom: 1px solid gray;
  transition: all 0.2s ease-in;
`;

let Field = styled(View)`
  width: 60px;
  height: 60px;
  margin: 5px;
  box-shadow: inset 0 14px 28px rgba(0, 0, 0, 0.25),
    inset 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  background-color: #eee;

  transition: all 0.2s ease-in;
`;

let Stone = styled(View)`
  z-index: 100;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  background-color: black;
  margin: auto;
  width: 40px;
  height: 40px;

  border-radius: 25px;

  transform: translateY(60px);
  transition: transform 0.5s cubic-bezier(0.1, 1.49, 0.58, 1);

  /* Stone positions */
  &.left {
    transform: translateX(-60px);
  }
  &.right {
    transform: translateX(60px);
  }
  &.up {
    transform: translateY(-60px);
  }
  &.down {
    transform: translateY(60px);
  }
`;

let Text = styled(View)`
  font-size: 50px;
  margin-left: 20px;
  padding: 3px;
  justify-content: flex-end;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

let ButtonStyle = styled(Card)`
  padding: 10px;
  padding-right: 50px;
  margin-top: 20px;
  flex-direction: row;
  cursor: pointer;

  transition: all 0.2s ease-in;

  /* On hover animations */
  &:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transform: translateY(2px);
  }

  &:hover ${Field} {
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12),
      inset 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  &:hover ${TopField}, &:hover ${BottomField} {
    transform: translateY(-2px);
  }

  &:hover ${Stone} {
    transform: translateY(0);
  }
`;

let Button = ({ onPress, children, stoneClassName, stoneStyle }) => {
  return (
    <ButtonStyle onClick={onPress}>
      <Field>
        <TopField />
        <Stone className={stoneClassName} style={stoneStyle} />
        <BottomField />
      </Field>

      <Text>{children}</Text>
    </ButtonStyle>
  );
};

Object.assign(Button, {
  left: ".left",
  right: ".right",
  up: ".up",
  down: ".down",
});

export default Button;
