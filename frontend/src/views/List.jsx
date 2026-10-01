import useCurriculaController from "../controllers/useCurriculaController.js";

export default function List() {
  const { curricula, message, loading } = useCurriculaController();

  return (
    <>
      <section>
        <h2>Currículos cadastrados</h2>
        {curricula.length === 0 ? (
          <p className="empty">Nenhum currículo cadastrado ainda.</p>
        ) : (
          <ul className="documents">
            {curricula.map((curriculum) => (
              <li key={curriculum.id}>
                <span>{curriculum.name} · {curriculum.email}</span>
                <time>{new Date(curriculum.createdAt).toLocaleString("pt-BR")}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
