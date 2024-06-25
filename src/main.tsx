import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import "./index.css";
import "./App.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
    {/* <div className=" bg-green-900">
        <div className="bg-yellow-500 w-[100%] h-[300px] mb-3"></div>
        <div className="bg-yellow-500 w-[100%] h-[300px] mb-3"></div>
        <div className="bg-yellow-500 w-[100%] h-[300px] mb-3"></div>
        <div className="bg-yellow-500 w-[100%] h-[300px] mb-3"></div>
        <div className="bg-yellow-500 w-[100%] h-[300px] mb-3"></div>
        <div className="bg-yellow-500 w-[100%] h-[300px] mb-3"></div>
        <div className="bg-yellow-500 w-[100%] h-[300px] mb-3"></div>
        <div className="bg-yellow-500 w-[100%] h-[300px]"></div>
    </div> */}
  </Provider>
);
