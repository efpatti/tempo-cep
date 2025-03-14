import React, { useState } from "react";
import axios from "axios";

const App = () => {
 const [weather, setWeather] = useState(null);
 const [cep, setCep] = useState("");
 const [address, setAddress] = useState(null);
 const [error, setError] = useState(null);
 const [city, setCity] = useState("");

 const handleChange = (event) => {
  setCep(event.target.value);
 };

 const handleSubmit = async (event) => {
  event.preventDefault();
  setError(null);

  try {
   const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
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
  }
 };

 return (
  <div className="flex justify-center items-center h-screen">
   <div className="w-full max-w-md">
    <form
     onSubmit={handleSubmit}
     className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
     <div className="mb-4">
      <label
       className="block text-gray-700 text-sm font-bold mb-2"
       htmlFor="cep"
      >
       CEP
      </label>
      <input
       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
       id="cep"
       type="text"
       placeholder="Digite o CEP"
       value={cep}
       onChange={handleChange}
      />
     </div>
     <div className="flex items-center justify-between">
      <button
       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
       type="submit"
      >
       Conferir endereço
      </button>
     </div>
    </form>
    {address && (
     <div
      className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
      role="alert"
     >
      <p className="font-bold">Endereço:</p>
      <p>{address.logradouro}</p>
      <p>{address.bairro}</p>
      <p>
       {address.localidade} - {address.uf}
      </p>
      <button
       className="rounded-md border border-green-500 p-2 hover:bg-opacity-50 hover:bg-green-500 ease-in-out duration-150 hover:text-white"
       onClick={weatherApi}
      >
       Conferir temperatura
      </button>
     </div>
    )}
    {weather && (
     <div
      className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
      role="alert"
     >
      <p className="font-bold">Temperatura:</p>
      <p>{weather}°C</p>
     </div>
    )}
    {error && (
     <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
      role="alert"
     >
      <p className="font-bold">Erro:</p>
      <p>{error}</p>
     </div>
    )}
   </div>
  </div>
 );
};

export default App;
