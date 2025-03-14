import React, { useState } from "react";
import axios from "axios";

const App = () => {
 const [weather, setWeather] = useState(null);
 const [cep, setCep] = useState("");
 const [address, setAddress] = useState(null);
 const [error, setError] = useState(null);
 const [city, setCity] = useState("");
 const [loading, setLoading] = useState(false);

 const formatCep = (value) => {
  const cepNumerico = value.replace(/\D/g, "");
  return cepNumerico.length > 5
   ? `${cepNumerico.slice(0, 5)}-${cepNumerico.slice(5, 8)}`
   : cepNumerico;
 };

 const handleChange = (event) => {
  const formattedCep = formatCep(event.target.value);
  setCep(formattedCep);
 };

 const handleSubmit = async (event) => {
  event.preventDefault();
  setError(null);

  if (cep.length !== 9) {
   setError("CEP inválido. Formato correto: 00000-000");
   return;
  }

  try {
   const response = await axios.get(
    `https://viacep.com.br/ws/${cep.replace("-", "")}/json/`
   );

   if (response.data.erro) {
    // Caso o CEP não seja encontrado, a API retorna um campo "erro" como true
    setError("CEP inválido. Tente novamente.");
    setAddress(null);
    setCity("");
   } else {
    setAddress(response.data);
    setCity(response.data.localidade);
   }
  } catch (error) {
   setError("Erro ao buscar o CEP. Tente novamente.");
   console.error(error);
  }
 };

 const weatherApi = async (eventWeather) => {
  eventWeather.preventDefault();
  setError(null);
  setLoading(true);

  try {
   const response = await axios.get(
    `https://yahoo-weather5.p.rapidapi.com/weather`,
    {
     params: {
      location: city,
      format: "json",
      u: "c",
     },
     headers: {
      "x-rapidapi-key": "1136fcefa8msh7685030f419d76dp154591jsn183d22a2edac",
      "x-rapidapi-host": "yahoo-weather5.p.rapidapi.com",
     },
    }
   );
   setWeather(response.data.current_observation.condition.temperature);
  } catch (error) {
   setError("Cidade não encontrada.");
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-600 p-8">
   <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8">
    <h1 className="text-3xl font-semibold text-center text-indigo-700 mb-6">
     Consulta de Endereço e Clima
    </h1>

    {!address && (
     <form onSubmit={handleSubmit} className="space-y-5">
      <div>
       <label className="block text-gray-700 font-medium mb-2">
        Digite o CEP:
       </label>
       <input
        className="w-full px-4 py-3 border border-indigo-500 bg-gray-100 text-gray-800 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        type="text"
        placeholder="Ex: 01001-000"
        value={cep}
        onChange={handleChange}
        maxLength={9}
       />
      </div>
      <button
       className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md"
       type="submit"
      >
       Buscar Endereço
      </button>
     </form>
    )}

    {address && (
     <div className="mt-6 p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-indigo-700">Endereço:</p>
      <p className="text-gray-800">
       {address.logradouro || "Logradouro não disponível"}
      </p>
      <p className="text-gray-800">
       {address.bairro || "Bairro não disponível"}
      </p>
      <p className="text-gray-800">
       {address.localidade} - {address.uf}
      </p>

      <div className="flex justify-between mt-6">
       <button
        className="w-1/2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md disabled:opacity-50"
        onClick={weatherApi}
        disabled={loading || weather}
       >
        {loading ? "Carregando..." : "Ver Temperatura"}
       </button>
       <button
        className="w-1/2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md ml-2"
        onClick={() => {
         setCep("");
         setAddress(null);
         setCity("");
         setWeather(null);
         setError(null);
        }}
       >
        Novo CEP
       </button>
      </div>
     </div>
    )}

    {weather && !loading && (
     <div className="mt-6 p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-indigo-700">
       Temperatura Atual:
      </p>
      <p className="text-3xl font-bold text-gray-800">{weather}°C</p>
     </div>
    )}

    {error && (
     <div className="mt-6 p-6 bg-red-900 border-l-4 border-red-500 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-red-400">Erro:</p>
      <p className="text-white">{error}</p>
     </div>
    )}
   </div>
  </div>
 );
};

export default App;
