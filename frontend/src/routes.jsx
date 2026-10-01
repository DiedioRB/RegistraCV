import { createBrowserRouter } from "react-router-dom";
import Form from "./views/Form.jsx";

const routes = createBrowserRouter([
  { path: "/", element: <Form /> }
]);

export default routes;

