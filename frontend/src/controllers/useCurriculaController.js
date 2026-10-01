import { useCallback, useEffect, useRef, useState } from "react";
import {
  listCurricula,
  createCurriculum,
  extractCurriculum,
} from "../services/curriculaApi.js";

const emptyFields = {
  name: "",
  email: "",
  phone: "",
  interestRole: "",
  resumee: ""
};

export default function useCurriculaController() {
  const [curricula, setCurricula] = useState([]);
  const [fields, setFields] = useState(emptyFields);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCurricula = useCallback(async () => {
    setCurricula(await listCurricula());
  }, []);

  async function extractFile(selectedFile) {
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const result = await extractCurriculum(formData);
      setFields({ ...emptyFields, ...result.fields });
      setMessage("Revise os dados extraídos e envie o formulário para salvar.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setFields(emptyFields);
    setMessage(selectedFile ? "Extraindo dados do PDF…" : "");
    if (selectedFile) {
      extractFile(selectedFile);
    } else {
      setLoading(false);
    }
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
    await extractFile(file);
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
    fetchCurricula,
    handleFileChange,
    handleFieldChange,
    handleExtract,
    handleSubmit
  };
}
