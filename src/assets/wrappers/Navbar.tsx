import styled from "styled-components";

const Wrapper = styled.article`
  display: flex;
  z-index: 2;

  @media screen and (min-width: 0px) and (max-width: 600px) {
    display: none;
  }
`;

export default Wrapper;
