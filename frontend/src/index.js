import { StrictMode } from "react";
import ReactDOM from "react-dom";

// import App from "./App";
// import FullCalendar from "./FullCalendar";
import TuiCalendar from "./TuiCalendar";
// import TuiCalendar2 from "./TuiCalendar2";
// import ReactCalendar from "./ReactCalendar";
// import ReactBigCalendar from "./ReactBigCalendar";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    {/* <FullCalendar /> */}
    <TuiCalendar />
    {/* <TuiCalendar2 /> */}
    {/* <ReactCalendar /> */}
    {/* <ReactBigCalendar /> */}
  </StrictMode>,
  rootElement
);
