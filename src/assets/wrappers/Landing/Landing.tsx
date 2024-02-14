import styled from "styled-components";

const Wrapper = styled.article`
  background-color: #fff;
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  flex-direction: column;
  z-index: 0;
  .intro-section-1 {
    background-image: linear-gradient(
      to right top,
      #6ab5fa,
      #3173b1,
      #1d4469,
      #1d4469,
      #1d4469
    );
    height: 450px;
  }
  .wwd-container {
  }

  @media screen and (min-width: 0px) and (max-width: 600px) {
    .intro-section-1 {
      z-index: 1;
    }
    .wwd-container {
      flex-direction: column;
      grid-gap: 5rem;
    }
  }
`;

export default Wrapper;
