import styled from "styled-components";

const Wrapper = styled.article`
  display: none;

  @media screen and (min-width: 0px) and (max-width: 600px) {
    display: flex;
  }
`;

export default Wrapper;
