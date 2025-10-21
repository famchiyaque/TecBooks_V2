import styled from "styled-components"

const StyledWrapper = styled.div`
  .input-container {
    --c-text: rgb(50, 50, 80);
    --c-bg: rgb(252, 252, 252);
    --c-outline: rgb(55, 45 , 190);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: black;
    margin: 0;
    padding: 0.2rem 0 0.1rem 0;
    text-align: left;
    width: 100%;
  }

  .input-field {
    padding-top: 0.3em;
    padding-bottom: 0.3em;
    // padding: 0.3em 0 0.3rem 0.2rem;
    border-radius: 0.2em;
    border: 1px solid var(--c-border, currentColor);
    color: var(--c-text);
    font-size: 1rem;
    letter-spacing: 0.1ch;
    width: 99%;
  }

  .input-field:not(:placeholder-shown) + .input-label {
    transform: translateY(-220%);
    opacity: 1;
  }

  .input-field:invalid {
    --c-border: rgb(230, 85, 60);
    --c-text: rgb(230, 85, 60);
    --c-outline: rgb(230, 85, 60);
  }

  .input-field:is(:disabled, :read-only) {
    --c-border: rgb(150, 150, 150);
    --c-text: rgb(170, 170, 170);
  }

  .input-field:is(:focus, :focus-visible) {
    outline: 2px solid var(--c-outline);
    outline-offset: 2px;
  }

  .table-label {
    color: var(--c-text);
    font-weight: 500;
    // border: solid red 1px;
    text-align: start;
    // opacity: 0;
    display: inline;
  }

  .input-label {
    font-size: smaller;
    --timing: 200ms ease-in;
    position: absolute;
    left: 0;
    top: 50%;
    transition: transform var(--timing),
      opacity var(--timing);
    transform: translateY(-50%);
    opacity: 0;
    color: var(--c-text);
    font-weight: 500;
    // border: solid blue 1px;
  }

  .input-table {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    width: auto;
    border-collapse: separate;
    // border: solid red 1px;
    border-spacing: 0.6rem;
  }

  .input-cell {
    padding: 0 0.3rem;
    text-align: center;
    min-width: 5rem;
    max-width: 5rem;
}`

export default StyledWrapper