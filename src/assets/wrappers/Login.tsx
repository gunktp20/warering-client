import styled from "styled-components";

const Wrapper = styled.article`
    justify-content:center;
    align-items:center;
    position: relative;
    display:flex;
    background-color:#e0f4ff2c;
    width:100%;
    height:100vh;
    .form-main{
        background-color: #fff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border-top: 5px solid #3173B1;
        padding: 2rem;
        position:absolute;
        top:5rem;
        transition:0.3s all ease ;
    }

    .form-main:hover{
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);;
    }

    .logo-section{
        display:flex;
        justify-content: center;
        grid-gap:1rem;
    }

    .logo-section h2{
        font-size: 25px;
        font-weight: bold;
        color:#37b7c3
    }
`

export default Wrapper