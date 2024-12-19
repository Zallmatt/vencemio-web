import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Pie, Bar, Scatter } from "react-chartjs-2"; // Importar Scatter
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
} from "chart.js";
import { AuthContext } from "../../context/AuthContext";
import "./ProductStatistics.css";
import * as XLSX from "xlsx";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement); // Registrar PointElement

const ProductStatistics = () => {
  const { superuser } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedOption, setSelectedOption] = useState("general");

  const [pieData, setPieData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [discountData, setDiscountData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [topProductsData, setTopProductsData] = useState(null);
  const [discountDistributionData, setDiscountDistributionData] = useState(null); // Nuevo estado
  const [priceVsSalesData, setPriceVsSalesData] = useState(null); // Nuevo estado
  const [leastSoldData, setLeastSoldData] = useState(null); // Nuevo estado

  // Fetch products and sales
  useEffect(() => {
    const fetchProductsAndSales = async () => {
      try {
        // Obtener productos y ventas
        const productsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/productos/`); 
        const salesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/ventas/all`);

        let fetchedProducts = productsResponse.data;
        let fetchedSales = salesResponse.data;

        // Filtrar por supermercado si selecciona "Estadísticas del Supermercado"
        if (selectedOption === "super" && superuser) {
          fetchedProducts = fetchedProducts.filter(
            (product) => product.cod_super === superuser.cod_super
          );
          fetchedSales = fetchedSales.filter(
            (sale) => sale.cod_super === superuser.cod_super
          );
        }

        setProducts(fetchedProducts);
        setSales(fetchedSales);

        // Generar estadísticas basadas en los datos filtrados
        generateStatistics(fetchedProducts, fetchedSales);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProductsAndSales();
  }, [selectedOption, superuser]);

  const generateStatistics = (productData, salesData) => {
    generatePieData(productData);
    generateBarData(productData);
    generateDiscountData(productData);
    generateSalesData(salesData);
    generateStockDistribution(productData);
    generateTopSellingProducts(salesData, productData);
    generatePriceVsSales(salesData, productData);
    generateLeastSoldProducts(salesData, productData);
    generateDiscountDistribution(productData);
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
  const generateDiscountDistribution = (productsData) => {
    // Agrupar productos en rangos de descuento
    const discountRanges = productsData.reduce((acc, product) => {
      const range = `${Math.floor(product.porcentaje_descuento / 10) * 10}% - ${
        Math.ceil(product.porcentaje_descuento / 10) * 10
      }%`;
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {});
  
    // Configurar los datos para el gráfico
    setDiscountDistributionData({
      labels: Object.keys(discountRanges),
      datasets: [
        {
          label: "Distribución de Descuentos",
          data: Object.values(discountRanges),
          backgroundColor: ["#FF5733", "#FF8D1A", "#FFC300", "#28A745", "#1E90FF"],
        },
      ],
    });
  };
  
  const generatePriceVsSales = (salesData, productsData) => {
    // Combinar ventas y productos usando producto_id
    const combinedData = salesData.map((sale) => {
      const product = productsData.find((p) => p.id === sale.producto_id);
      return {
        precio: product ? product.precio : 0,
        cantidadVendida: sale.cantidad,
      };
    });
  
    // Configurar los datos del gráfico de dispersión
    setPriceVsSalesData({
      datasets: [
        {
          label: "Relación entre Precio y Cantidad Vendida",
          data: combinedData.map((item) => ({
            x: item.precio,
            y: item.cantidadVendida,
          })),
          backgroundColor: "#FF6384",
          pointRadius: 6,
        },
      ],
    });
  };
  const generateLeastSoldProducts = (salesData, productsData) => {
    // Sumar la cantidad vendida por producto
    const productSales = salesData.reduce((acc, sale) => {
      acc[sale.producto_id] = (acc[sale.producto_id] || 0) + sale.cantidad;
      return acc;
    }, {});
  
    // Ordenar los productos por menor cantidad vendida
    const leastSoldProducts = Object.entries(productSales)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 5);
  
    // Obtener los nombres de los productos
    const productNames = leastSoldProducts.map(([id, total]) => {
      const product = productsData.find((p) => p.id === id);
      return { name: product ? product.nombre : "Desconocido", total };
    });
  
    // Configurar el gráfico
    setLeastSoldData({
      labels: productNames.map((item) => item.name),
      datasets: [
        {
          label: "Productos con Menor Movimiento",
          data: productNames.map((item) => item.total),
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

  const generateTopSellingProducts = (salesData, productsData) => {
    // Sumar las cantidades vendidas por producto
    const productSales = salesData.reduce((acc, sale) => {
      acc[sale.producto_id] = (acc[sale.producto_id] || 0) + sale.cantidad;
      return acc;
    }, {});
  
    // Ordenar los productos por cantidad vendida y tomar los top 5
    const sortedProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  
    // Mapear IDs a nombres de productos usando la lista de productos
    const productNames = sortedProducts.map(([id, total]) => {
      const product = productsData.find((prod) => prod.id === id);
      return { name: product ? product.nombre : "Desconocido", total };
    });
  
    // Configurar los datos para el gráfico
    setTopProductsData({
      labels: productNames.map((item) => item.name), // Nombres de los productos
      datasets: [
        {
          label: "Top 5 Productos Más Vendidos",
          data: productNames.map((item) => item.total), // Cantidad vendida
          backgroundColor: ["#FF9F40", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    });
  };
  
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
  
    // 1. Agregar todos los productos
    if (products.length > 0) {
      const productSheet = XLSX.utils.json_to_sheet(
        products.map((product) => ({
          Nombre: product.nombre,
          Precio: product.precio,
          "Precio Descuento": product.precio_descuento,
          Stock: product.stock,
          "Porcentaje Descuento": product.porcentaje_descuento,
          "Código Tipo": product.cod_tipo,
        }))
      );
      XLSX.utils.book_append_sheet(workbook, productSheet, "Productos");
    }
  
    // 2. Agregar todas las ventas
    if (sales.length > 0) {
      const filteredSales = sales.filter(
        (sale) => sale.cod_super === superuser.cod_super // Filtrar solo las ventas del supermercado del usuario
      );
  
      const salesSheet = XLSX.utils.json_to_sheet(
        filteredSales.map((sale) => {
          const product = products.find((p) => p.id === sale.producto_id);
          return {
            "Nombre del Producto": product ? product.nombre : "Desconocido",
            "Precio Original": product ? product.precio : "N/A",
            "Precio con Descuento": product ? product.precio_descuento : "N/A",
            "Porcentaje Descuento": product ? product.porcentaje_descuento : "N/A",
            "Cantidad Vendida": sale.cantidad,
            Total: sale.total,
            "Fecha Venta": sale.fecha,
          };
        })
      );
      XLSX.utils.book_append_sheet(workbook, salesSheet, "Ventas");
    }
  
    // 3. Estadísticas de gráficos
    // Distribución por Tipo de Producto
    if (pieData) {
      const pieSheet = XLSX.utils.json_to_sheet(
        pieData.labels.map((label, index) => ({
          Tipo: label,
          Cantidad: pieData.datasets[0].data[index],
        }))
      );
      XLSX.utils.book_append_sheet(workbook, pieSheet, "Distribución Tipo");
    }
  
    // Promedio de Precios
    if (barData) {
      const barSheet = XLSX.utils.json_to_sheet(
        barData.labels.map((label, index) => ({
          Tipo: label,
          "Promedio Precio": barData.datasets[0].data[index],
        }))
      );
      XLSX.utils.book_append_sheet(workbook, barSheet, "Precios Promedio");
    }
  
    // Distribución de Stock
    if (stockData) {
      const stockSheet = XLSX.utils.json_to_sheet(
        stockData.labels.map((label, index) => ({
          Tipo: label,
          Stock: stockData.datasets[0].data[index],
        }))
      );
      XLSX.utils.book_append_sheet(workbook, stockSheet, "Distribución Stock");
    }
  
    // Top 5 Productos Vendidos
    if (topProductsData) {
      const topProductsSheet = XLSX.utils.json_to_sheet(
        topProductsData.labels.map((label, index) => ({
          Producto: label,
          Ventas: topProductsData.datasets[0].data[index],
        }))
      );
      XLSX.utils.book_append_sheet(workbook, topProductsSheet, "Top Vendidos");
    }
  
    // Relación Precio vs Cantidad Vendida
    if (priceVsSalesData) {
      const scatterSheet = XLSX.utils.json_to_sheet(
        priceVsSalesData.datasets[0].data.map((point) => ({
          Precio: point.x,
          "Cantidad Vendida": point.y,
        }))
      );
      XLSX.utils.book_append_sheet(workbook, scatterSheet, "Precio vs Cantidad");
    }
  
    // Productos con Menor Movimiento
    if (leastSoldData) {
      const leastSoldSheet = XLSX.utils.json_to_sheet(
        leastSoldData.labels.map((label, index) => ({
          Producto: label,
          Ventas: leastSoldData.datasets[0].data[index],
        }))
      );
      XLSX.utils.book_append_sheet(workbook, leastSoldSheet, "Menor Movimiento");
    }
  
    // Distribución de Descuentos
    if (discountDistributionData) {
      const discountSheet = XLSX.utils.json_to_sheet(
        discountDistributionData.labels.map((label, index) => ({
          Rango: label,
          Cantidad: discountDistributionData.datasets[0].data[index],
        }))
      );
      XLSX.utils.book_append_sheet(workbook, discountSheet, "Descuentos");
    }
  
    // 4. Hoja de resumen (opcional)
    const summarySheet = XLSX.utils.json_to_sheet([
      { Estadística: "Total de Productos", Valor: products.length },
      { Estadística: "Total de Ventas", Valor: sales.length },
      { Estadística: "Tipos de Producto Únicos", Valor: pieData?.labels.length || 0 },
      { Estadística: "Top Producto Más Vendido", Valor: topProductsData?.labels[0] || "N/A" },
      { Estadística: "Rango de Descuentos", Valor: discountDistributionData ? "Calculado" : "N/A" },
    ]);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen Estadísticas");
  
    // Descargar el archivo
    XLSX.writeFile(workbook, "todas_estadisticas_productos.xlsx");
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
          <button onClick={exportToExcel} className="download-button">
            Descargar Estadísticas en Excel
          </button>
        </div>
        {/* Distribución de Tipos */}
        <div className="chart-section">
          <h2>Distribución por Tipo de Producto</h2>
          <div className="chart-wrapper pie-chart-wrapper">
            {pieData ? <Pie data={pieData} /> : <p>Cargando datos...</p>}
          </div>
        </div>

        {/* Promedio de Precios */}
        <div className="chart-section">
          <h2>Promedio de Precios por Tipo</h2>
          <div className="chart-wrapper">
            {barData ? <Bar data={barData} /> : <p>Cargando datos...</p>}
          </div>
        </div>

        {/* Distribución de Stock */}
        <div className="chart-section">
          <h2>Distribución de Stock</h2>
          <div className="chart-wrapper pie-chart-wrapper">
            {stockData ? <Pie data={stockData} /> : <p>Cargando datos...</p>}
          </div>
        </div>

        {/* Top 5 Productos */}
        <div className="chart-section">
          <h2>Top 5 Productos Más Vendidos</h2>
          <div className="chart-wrapper">
            {topProductsData ? <Bar data={topProductsData} /> : <p>Cargando datos...</p>} 
          </div>
        </div>

        {/* Relación Precio vs Cantidad */}
        <div className="chart-section">
          <h2>Relación entre Precio y Cantidad Vendida</h2>
          <div className="chart-wrapper">
            {priceVsSalesData ? <Scatter data={priceVsSalesData} /> : <p>Cargando datos...</p>}
          </div>
        </div>

        {/* Productos con Menor Movimiento */}
        <div className="chart-section">
          <h2>Productos con Menor Movimiento</h2>
          <div className="chart-wrapper">
            {leastSoldData ? <Bar data={leastSoldData} /> : <p>Cargando datos...</p>}
          </div>
        </div>

        {/* Distribución de Descuentos */}
        <div className="chart-section">
          <h2>Distribución de Descuentos Ofrecidos</h2>
          <div className="chart-wrapper">
            {discountDistributionData ? <Bar data={discountDistributionData} /> : <p>Cargando datos...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStatistics;
