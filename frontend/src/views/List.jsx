import { useEffect } from "react";
import CurriculaList from "../components/CurriculaList.jsx";
import useCurriculaController from "../controllers/useCurriculaController.js";

export default function List() {
  const { curricula, message, loading, fetchCurricula } = useCurriculaController();

  useEffect(() => {
    fetchCurricula();
  }, [fetchCurricula]);

  return <CurriculaList curricula={curricula} message={message} loading={loading} />;
}
