export default function CurriculaList({ curricula, loading = false, message = "" }) {
  return (
    <section className="curricula-section" aria-labelledby="curricula-heading">
      <h2 id="curricula-heading">Currículos cadastrados</h2>

      {loading && <p className="empty" role="status">Carregando currículos…</p>}
      {!loading && message && <p className="list-error" role="alert">{message}</p>}
      {!loading && !message && curricula.length === 0 && (
        <p className="empty">Nenhum currículo cadastrado ainda.</p>
      )}

      {!loading && !message && curricula.length > 0 && (
        <ul className="curricula-list">
          {curricula.map((curriculum) => (
            <li className="curriculum-card" key={curriculum.id}>
              <div className="curriculum-heading">
                <h3>{curriculum.name}</h3>
                {curriculum.interestRole && (
                  <span className="curriculum-role">{curriculum.interestRole}</span>
                )}
              </div>
              <div className="curriculum-details">
                <a href={`mailto:${curriculum.email}`}>{curriculum.email}</a>
                {curriculum.phone && <span>{curriculum.phone}</span>}
                <time dateTime={curriculum.createdAt}>
                  {new Date(curriculum.createdAt).toLocaleDateString("pt-BR")}
                </time>
              </div>
              {curriculum.resumee && (
                <p className="curriculum-summary">{curriculum.resumee}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
