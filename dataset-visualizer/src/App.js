import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Registramos las escalas y elementos que necesitamos
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const App = () => {
    const [chartData, setChartData] = useState(null);

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post("http://localhost:5000/api/dataset/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Procesa los datos para el gráfico basado en la respuesta de la API
            const data = response.data;
            const labels = data.data.map(item => item["indice_tiempo"]); // Ejemplo de columna de tiempo
            const productionData = data.data.map(item => item["produccion_arroz_t"]);
            const yieldData = data.data.map(item => item["rendimiento_arroz_kgxha"]);

            setChartData({
                labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'Producción de Arroz (Toneladas)',
                        data: productionData,
                        borderColor: 'blue',
                        borderWidth: 2,
                        fill: false,
                    },
                    {
                        type: 'bar',
                        label: 'Rendimiento de Arroz (kg/ha)',
                        data: yieldData,
                        backgroundColor: 'orange',
                    },
                ],
            });
        } catch (error) {
            console.error("Error al cargar el archivo:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => uploadFile(e.target.files[0])} />
            {chartData && (
                <>
                    <Line data={chartData} />
                    <Bar data={chartData} />
                </>
            )}
        </div>
    );
};

export default App;
