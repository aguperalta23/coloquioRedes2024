import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Registramos las escalas y elementos que necesitamos
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const App = () => {
    const [chartData, setChartData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [xColumn, setXColumn] = useState('');
    const [yColumn, setYColumn] = useState('');

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post("http://localhost:5000/api/dataset/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Obtiene los datos y columnas
            const data = response.data.data;
            const detectedColumns = Object.keys(data[0]);

            // Configura las columnas detectadas y los datos
            setColumns(detectedColumns);
            setChartData(data);
        } catch (error) {
            console.error("Error al cargar el archivo:", error);
        }
    };

    const generateChartData = () => {
        if (!chartData || !xColumn || !yColumn) return null;

        const labels = chartData.map(item => item[xColumn]);
        const yData = chartData.map(item => item[yColumn]);

        return {
            labels,
            datasets: [
                {
                    type: 'line',
                    label: `${yColumn} (línea)`,
                    data: yData,
                    borderColor: 'blue',
                    borderWidth: 2,
                    fill: false,
                },
                {
                    type: 'bar',
                    label: `${yColumn} (barras)`,
                    data: yData,
                    backgroundColor: 'orange',
                },
            ],
        };
    };

    const chartConfig = generateChartData();

    return (
        <div>
            <input type="file" onChange={(e) => uploadFile(e.target.files[0])} />
            
            {columns.length > 0 && (
                <div>
                    <label>
                        Selecciona la columna X:
                        <select value={xColumn} onChange={(e) => setXColumn(e.target.value)}>
                            <option value="">Selecciona una opción</option>
                            {columns.map(col => (
                                <option key={col} value={col}>{col}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Selecciona la columna Y:
                        <select value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
                            <option value="">Selecciona una opción</option>
                            {columns.map(col => (
                                <option key={col} value={col}>{col}</option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            {chartConfig && (
                <>
                    <Line data={chartConfig} />
                    <Bar data={chartConfig} />
                </>
            )}
        </div>
    );
};

export default App;
