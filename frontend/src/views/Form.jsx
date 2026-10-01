import usecurriculaController from "../controllers/useCurriculaController.js";

const formFields = [
  { name: "name", label: "Nome", required: true },
  { name: "email", label: "E-mail", type: "email", required: true },
  { name: "phone", label: "Telefone" },
  { name: "InterestRole", label: "Cargo de interesse" }
];

export default function Form() {
  const {
    fields,
    message,
    loading,
    handleFileChange,
    handleFieldChange,
    handleExtract,
    handleSubmit
  } = usecurriculaController();

  return (
    <main className="container">
      <header>
        <p className="eyebrow">REGISTRACV</p>
        <h1>Cadastro de currículo</h1>
        <p className="intro">Extraia os dados de um PDF, revise os campos e envie para salvar.</p>
      </header>

      <form className="upload" onSubmit={handleSubmit}>
        <label htmlFor="file">Arquivo PDF (opcional)</label>
        <div className="controls">
          <input
            id="file"
            name="file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button type="button" className="secondary" disabled={loading} onClick={handleExtract}>
            Extrair dados
          </button>
        </div>

        <div className="field-grid">
          {formFields.map(({ name, label, type = "text", required }) => (
            <label className="field" key={name} htmlFor={name}>
              {label}
              <input
                id={name}
                name={name}
                type={type}
                value={fields[name]}
                required={required}
                onChange={handleFieldChange}
              />
            </label>
          ))}
        </div>

        <label className="field" htmlFor="Resumee">
          Resumo profissional
          <textarea
            id="Resumee"
            name="Resumee"
            rows="6"
            value={fields.Resumee}
            onChange={handleFieldChange}
          />
        </label>

        <div className="form-actions">
          <button disabled={loading}>{loading ? "Processando…" : "Salvar currículo"}</button>
        </div>
      </form>

      {message && <p className="message" role="status">{message}</p>}
    </main>
  );
}
