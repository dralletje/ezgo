import React from "react";
import styled from "styled-components/macro";

export let View = styled.div`
  display: flex;
  flex-direction: column;
`;

export let Card = styled(View)`
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  background-color: #eee;
`;

export let Text = "span";
