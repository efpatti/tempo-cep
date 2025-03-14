import React, { useState } from "react";
import axios from "axios";

const App = () => {
 const [weather, setWeather] = useState(null);
 const [cep, setCep] = useState("");
 const [address, setAddress] = useState(null);
 const [error, setError] = useState(null);
 const [city, setCity] = useState("");
 const [loading, setLoading] = useState(false);

 // Função para formatar o CEP enquanto o usuário digita
 const formatCep = (value) => {
  const cepNumerico = value.replace(/\D/g, ""); // Remove tudo que não for número
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
   setAddress(response.data);
   setCity(response.data.localidade);
  } catch (error) {
   setError("CEP não encontrado");
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
   setError("Cidade não encontrada");
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
   <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
    <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
     Consulta de Endereço e Clima
    </h1>

    {!address && (
     <form onSubmit={handleSubmit} className="space-y-4">
      <div>
       <label className="block text-gray-700 font-medium mb-2">
        Digite o CEP:
       </label>
       <input
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        type="text"
        placeholder="Ex: 01001-000"
        value={cep}
        onChange={handleChange}
        maxLength={9} // Limita o número de caracteres no input
       />
      </div>
      <button
       className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold shadow-md"
       type="submit"
      >
       Buscar Endereço
      </button>
     </form>
    )}

    {address && (
     <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 rounded-md shadow-md">
      <p className="text-lg font-semibold text-green-800">Endereço:</p>
      <p>{address.logradouro || "Logradouro não disponível"}</p>
      <p>{address.bairro || "Bairro não disponível"}</p>
      <p>
       {address.localidade} - {address.uf}
      </p>

      <div className="flex justify-between mt-4">
       <button
        className="w-1/2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-semibold shadow-md disabled:opacity-50"
        onClick={weatherApi}
        disabled={loading || weather}
       >
        {loading ? "Carregando..." : "Ver Temperatura"}
       </button>
       <button
        className="w-1/2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition font-semibold shadow-md ml-2"
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
     <div className="mt-4 p-4 bg-blue-100 border-l-4 border-blue-500 rounded-md shadow-md">
      <p className="text-lg font-semibold text-blue-800">Temperatura Atual:</p>
      <p className="text-2xl font-bold">{weather}°C</p>
     </div>
    )}

    {error && (
     <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md">
      <p className="text-lg font-semibold text-red-800">Erro:</p>
      <p>{error}</p>
     </div>
    )}
   </div>
  </div>
 );
};

export default App;
