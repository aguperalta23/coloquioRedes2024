import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react'; // Importar el hook de Auth0

// Importar componentes de autenticación
import LoginButton from './components/loginbutton';
import LogoutButton from './components/logoutbutton';
import Profile from './components/profile';

// Registrar escalas y elementos necesarios para Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const App = () => {
    const [chartData, setChartData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [xColumn, setXColumn] = useState('');
    const [yColumn, setYColumn] = useState('');
    const { isAuthenticated } = useAuth0(); // Obtener estado de autenticación

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post("http://localhost:5000/api/dataset/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Obtener los datos y las columnas
            const data = response.data.data;
            const detectedColumns = Object.keys(data[0]);

            // Configurar columnas detectadas y datos
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
            <h1>Aplicación de Gráficos con Auth0</h1>
            
            {/* Mostrar botones de autenticación y perfil */}
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
            <Profile />

            {/* Contenido principal de la aplicación */}
            {isAuthenticated && (
                <>
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
                </>
            )}
        </div>
    );
};

export default App;
