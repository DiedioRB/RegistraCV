import useCurriculaController from "../controllers/useCurriculaController.js";

const formFields = [
  { name: "name", label: "Nome", required: true },
  { name: "email", label: "E-mail", type: "email", required: true },
  { name: "phone", label: "Telefone" },
  { name: "interestRole", label: "Cargo de interesse" }
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
  } = useCurriculaController();

  return (
    <>
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

        <label className="field" htmlFor="resumee">
          Resumo profissional
          <textarea
            id="resumee"
            name="resumee"
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
    </>
  );
}
