import { useCallback, useEffect, useState } from "react";
import {
  createCurriculum,
  extractCurriculum,
  listcurricula
} from "../services/curriculaApi.js";

const emptyFields = {
  name: "",
  email: "",
  phone: "",
  InterestRole: "",
  Resumee: ""
};

export default function usecurriculaController() {
  const [curricula, setcurricula] = useState([]);
  const [fields, setFields] = useState(emptyFields);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshcurricula = useCallback(async () => {
    setcurricula(await listcurricula());
  }, []);

  useEffect(() => {
    refreshcurricula().catch((error) => setMessage(error.message));
  }, [refreshcurricula]);

  function handleFileChange(event) {
    setFile(event.target.files?.[0] ?? null);
    setFields(emptyFields);
    setMessage("");
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function handleExtract() {
    if (!file) {
      setMessage("Selecione um PDF antes de extrair os dados.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await extractCurriculum(formData);
      setFields({ ...emptyFields, ...result.fields });
      setMessage("Revise os dados extraídos e envie o formulário para salvar.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
      if (file) formData.append("file", file);

      await createCurriculum(formData);
      setFields(emptyFields);
      setFile(null);
      form.reset();
      setMessage("Currículo salvo com sucesso.");
      await refreshcurricula();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    curricula,
    fields,
    message,
    loading,
    handleFileChange,
    handleFieldChange,
    handleExtract,
    handleSubmit
  };
}
