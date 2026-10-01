import { createBrowserRouter } from "react-router-dom";
import Form from "./views/Form.jsx";
import List from "./views/List.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout
        title="Currículos cadastrados"
        description="Consulte os currículos salvos ou inicie um novo cadastro."
      >
        <List />
      </AppLayout>
    )
  },
  {
    path: "/register",
    element: (
      <AppLayout
        title="Novo currículo"
        description="Preencha os dados manualmente ou extraia os campos de um PDF."
      >
        <Form />
      </AppLayout>
    )
  }
]);

export default routes;
