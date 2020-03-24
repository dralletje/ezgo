import React from "react";
import styled from "styled-components/macro";

import { Card } from "../components/base";

let styled_condition = (condition_fn) => {
  return (props) => (condition_fn(props) ? `&` : `&:not(&)`);
};

export let Button = styled(Card)`
  transition: box-shadow 0.5s, transform 0.5s, border-color 0.5s, color 0.5s;
  box-shadow: none;
  transform: translateY(0);

  padding: 5px 20px;
  color: #333;
  border: solid 1px #777;
  cursor: pointer;

  justify-content: flex-end;

  -webkit-touch-callout: none;
  user-select: none;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  }

  ${styled_condition((p) => p.disabled)} {
    &,
    &:hover {
      cursor: default;
      box-shadow: none;
      transform: translateY(0);
      color: #999;
      border-color: #bbb;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
    color: #eee;
    border-color: #eee;
  }
`;

export default Button;
