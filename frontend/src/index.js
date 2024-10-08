import { StrictMode } from "react";
import * as ReactDOM from 'react-dom/client';

// import App from "./App";
import FullCalendar from "./FullCalendar";
// import TuiCalendar from "./TuiCalendar";
// import TuiCalendar2 from "./TuiCalendar2";
// import ReactCalendar from "./ReactCalendar";
// import ReactBigCalendar from "./ReactBigCalendar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <FullCalendar />
    {/* <TuiCalendar /> */}
    {/* <TuiCalendar2 /> */}
    {/* <ReactCalendar /> */}
    {/* <ReactBigCalendar /> */}
  </StrictMode>
);
