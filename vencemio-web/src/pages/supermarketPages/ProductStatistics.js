import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { AuthContext } from "../../context/AuthContext";
import "./ProductStatistics.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ProductStatistics = () => {
  const { superuser } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedOption, setSelectedOption] = useState("general");
  const [pieData, setPieData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [discountData, setDiscountData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [supermarketPriceData, setSupermarketPriceData] = useState(null);
  const [stockData, setStockData] = useState(null); // Agregado
  const [topProductsData, setTopProductsData] = useState(null); // Agregado

  useEffect(() => {
    const fetchProductsAndSales = async () => {
      try {
        const productsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/productos/`);
        const fetchedProducts = productsResponse.data;

        const filtered = fetchedProducts.filter(
          (product) => product.cod_super === superuser.cod_super
        );

        setProducts(fetchedProducts);
        setFilteredProducts(filtered);

        const salesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/ventas/all`);
        const fetchedSales = salesResponse.data;
        setSales(fetchedSales);

        generateStatistics(fetchedProducts, fetchedSales);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProductsAndSales();
  }, [superuser.cod_super]);

  const generateStatistics = (productData, salesData) => {
    generatePieData(productData);
    generateBarData(productData);
    generateDiscountData(productData);
    generateSupermarketPriceData(productData);
    generateSalesData(salesData);
    generateStockDistribution(productData); // Generar distribución de stock
    generateTopSellingProducts(salesData); // Generar top 5 productos vendidos
  };

  const generateStockDistribution = (productsData) => {
    const stockCounts = productsData.reduce((acc, product) => {
      acc[product.cod_tipo] = (acc[product.cod_tipo] || 0) + product.stock;
      return acc;
    }, {});

    setStockData({
      labels: Object.keys(stockCounts),
      datasets: [
        {
          label: "Distribución de Stock por Tipo de Producto",
          data: Object.values(stockCounts),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    });
  };

  const generateTopSellingProducts = (salesData) => {
    const productSales = salesData.reduce((acc, sale) => {
      acc[sale.producto_id] = (acc[sale.producto_id] || 0) + sale.cantidad;
      return acc;
    }, {});

    const sortedProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setTopProductsData({
      labels: sortedProducts.map(([id]) => id),
      datasets: [
        {
          label: "Top 5 Productos Más Vendidos",
          data: sortedProducts.map(([, total]) => total),
          backgroundColor: ["#FF9F40", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    });
  };
  const generatePieData = (data) => {
    const typeCounts = data.reduce((acc, product) => {
      acc[product.cod_tipo] = (acc[product.cod_tipo] || 0) + 1;
      return acc;
    }, {});
  
    setPieData({
      labels: Object.keys(typeCounts),
      datasets: [
        {
          label: "Distribución por Tipo de Producto",
          data: Object.values(typeCounts),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
        },
      ],
    });
  };
  
  const generateBarData = (data) => {
    const typePrices = data.reduce((acc, product) => {
      if (!acc[product.cod_tipo]) {
        acc[product.cod_tipo] = { sum: 0, count: 0 };
      }
      acc[product.cod_tipo].sum += parseFloat(product.precio);
      acc[product.cod_tipo].count += 1;
      return acc;
    }, {});
  
    const types = Object.keys(typePrices);
    const averages = types.map((type) => typePrices[type].sum / typePrices[type].count);
  
    setBarData({
      labels: types,
      datasets: [
        {
          label: "Promedio de Precios por Tipo",
          data: averages,
          backgroundColor: "#36A2EB",
        },
      ],
    });
  };
  
  const generateDiscountData = (data) => {
    const discountCounts = data.reduce((acc, product) => {
      const discountRange = `${Math.floor(product.porcentaje_descuento / 10) * 10}% - ${
        Math.ceil(product.porcentaje_descuento / 10) * 10
      }%`;
      acc[discountRange] = (acc[discountRange] || 0) + 1;
      return acc;
    }, {});
  
    setDiscountData({
      labels: Object.keys(discountCounts),
      datasets: [
        {
          label: "Distribución de Productos por Descuento",
          data: Object.values(discountCounts),
          backgroundColor: ["#FF5733", "#FF8D1A", "#FFC300", "#28A745", "#1E90FF"],
        },
      ],
    });
  };
  
  const generateSupermarketPriceData = (data) => {
    const supermarketPrices = data.reduce((acc, product) => {
      if (!acc[product.cod_super]) {
        acc[product.cod_super] = { sum: 0, count: 0 };
      }
      acc[product.cod_super].sum += parseFloat(product.precio);
      acc[product.cod_super].count += 1;
      return acc;
    }, {});
  
    const supermarkets = Object.keys(supermarketPrices);
    const averagePrices = supermarkets.map(
      (supermarket) => supermarketPrices[supermarket].sum / supermarketPrices[supermarket].count
    );
  
    setSupermarketPriceData({
      labels: supermarkets,
      datasets: [
        {
          label: "Promedio de Precios por Supermercado",
          data: averagePrices,
          backgroundColor: "#36A2EB",
        },
      ],
    });
  };
  
  const generateSalesData = (salesData) => {
    const totalSales = salesData.reduce((acc, sale) => {
      acc[sale.cod_tipo] = (acc[sale.cod_tipo] || 0) + sale.total;
      return acc;
    }, {});
  
    setSalesData({
      labels: Object.keys(totalSales),
      datasets: [
        {
          label: "Total de Ventas por Tipo",
          data: Object.values(totalSales),
          backgroundColor: ["#FF9F40", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    });
  };
  
  return (
    <div className="statistics-page">
      <div className="statistics-container">
        <h1 className="statistics-title">Estadísticas de Productos y Ventas</h1>

        <div className="select-wrapper">
          <label>Seleccionar estadísticas:</label>
          <select onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption}>
            <option value="general">Estadísticas Generales</option>
            <option value="super">Estadísticas del Supermercado</option>
          </select>
        </div>

        <div className="chart-section">
          <h2>Distribución por Tipo de Producto</h2>
          {pieData ? <Pie data={pieData} /> : <p>Cargando datos...</p>}
        </div>

        <div className="chart-section">
          <h2>Promedio de Precios por Tipo</h2>
          {barData ? <Bar data={barData} /> : <p>Cargando datos...</p>}
        </div>

        <div className="chart-section">
          <h2>Total de Ventas por Tipo</h2>
          {salesData ? <Bar data={salesData} /> : <p>Cargando datos...</p>}
        </div>

        <div className="chart-section">
          <h2>Top 5 Productos Más Vendidos</h2>
          {topProductsData ? <Bar data={topProductsData} /> : <p>Cargando datos...</p>}
        </div>

        <div className="chart-section">
          <h2>Distribución de Stock por Tipo de Producto</h2>
          {stockData ? <Pie data={stockData} /> : <p>Cargando datos...</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductStatistics;
