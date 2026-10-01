import { NavLink } from "react-router-dom";

export default function AppLayout({ title, description, children }) {
  return (
    <main className="container">
      <header className="app-header">
        <p className="eyebrow">REGISTRACV</p>
        <h1>{title}</h1>
        <p className="intro">{description}</p>
      </header>
      <nav className="page-navigation" aria-label="Navegação principal">
        <NavLink
          end
          to="/"
          className={({ isActive }) => `nav-button${isActive ? " active" : ""}`}
        >
          Lista de currículos
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) => `nav-button${isActive ? " active" : ""}`}
        >
          Novo cadastro
        </NavLink>
      </nav>
      {children}
    </main>
  );
}
