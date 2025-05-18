import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spinner, Alert, Table, Nav, Form } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { toast } from 'react-toastify';
import { getSalesData, getBestsellers } from '../../services/adminService';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const SalesReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salesData, setSalesData] = useState({});
  const [bestsellers, setBestsellers] = useState([]);
  const [timeRange, setTimeRange] = useState('7'); // Default to 7 days
  const [reportType, setReportType] = useState('revenue'); // Default to revenue report
  const [dateFormat, setDateFormat] = useState('daily'); // daily, weekly, monthly
  const [loadingBestsellers, setLoadingBestsellers] = useState(true);
  
  // Fetch data on component mount and when params change
  useEffect(() => {
    fetchSalesData(timeRange, dateFormat);
    fetchBestsellers(timeRange);
  }, [timeRange, dateFormat]);

  // Fetch sales data for reporting
  const fetchSalesData = async (days, groupBy) => {
    setLoading(true);
    setError('');
    try {
      const response = await getSalesData(days, groupBy);
      setSalesData(response.data || {});
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Failed to load sales data. Please try again.');
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch bestsellers
  const fetchBestsellers = async (days) => {
    setLoadingBestsellers(true);
    try {
      const response = await getBestsellers(days);
      setBestsellers(response.data || []);
    } catch (error) {
      console.error('Error fetching bestsellers:', error);
      toast.error('Failed to load bestseller data');
    } finally {
      setLoadingBestsellers(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate summary metrics
  const getTotalRevenue = () => {
    return salesData.timeline?.reduce((total, day) => total + (day.revenue || 0), 0) || 0;
  };

  const getTotalOrders = () => {
    return salesData.timeline?.reduce((total, day) => total + (day.orders || 0), 0) || 0;
  };

  const getAverageOrderValue = () => {
    const totalOrders = getTotalOrders();
    return totalOrders > 0 ? getTotalRevenue() / totalOrders : 0;
  };

  const getTotalProfit = () => {
    return salesData.timeline?.reduce((total, day) => total + (day.profit || 0), 0) || 0;
  };

  // Prepare chart data for revenue/orders timeline
  const getTimelineChartData = () => {
    if (!salesData.timeline || salesData.timeline.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'No Data',
          data: [],
          borderColor: 'rgba(0, 123, 255, 1)',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
        }]
      };
    }

    const labels = salesData.timeline.map(day => day.date);
    
    if (reportType === 'revenue') {
      return {
        labels,
        datasets: [{
          label: 'Revenue',
          data: salesData.timeline.map(day => day.revenue || 0),
          borderColor: 'rgba(40, 167, 69, 1)',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          tension: 0.3,
          fill: true
        }]
      };
    } else if (reportType === 'orders') {
      return {
        labels,
        datasets: [{
          label: 'Orders',
          data: salesData.timeline.map(day => day.orders || 0),
          borderColor: 'rgba(0, 123, 255, 1)',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.3,
          fill: true
        }]
      };
    } else if (reportType === 'profit') {
      return {
        labels,
        datasets: [{
          label: 'Profit',
          data: salesData.timeline.map(day => day.profit || 0),
          borderColor: 'rgba(102, 16, 242, 1)',
          backgroundColor: 'rgba(102, 16, 242, 0.1)',
          tension: 0.3,
          fill: true
        }]
      };
    } else {
      // Combined view (profit and revenue)
      return {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: salesData.timeline.map(day => day.revenue || 0),
            borderColor: 'rgba(40, 167, 69, 1)',
            backgroundColor: 'transparent',
            tension: 0.3,
            yAxisID: 'y'
          },
          {
            label: 'Profit',
            data: salesData.timeline.map(day => day.profit || 0),
            borderColor: 'rgba(102, 16, 242, 1)',
            backgroundColor: 'transparent',
            tension: 0.3,
            borderDash: [5, 5],
            yAxisID: 'y'
          },
          {
            label: 'Orders',
            data: salesData.timeline.map(day => day.orders || 0),
            borderColor: 'rgba(0, 123, 255, 1)',
            backgroundColor: 'transparent',
            tension: 0.3,
            yAxisID: 'y1'
          }
        ]
      };
    }
  };

  // Prepare chart options
  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (['Revenue', 'Profit'].includes(context.dataset.label)) {
                  label += formatCurrency(context.parsed.y);
                } else {
                  label += context.parsed.y;
                }
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value) {
              if (['revenue', 'profit', 'combined'].includes(reportType)) {
                return formatCurrency(value);
              }
              return value;
            }
          }
        }
      }
    };

    // Special config for combined view
    if (reportType === 'combined') {
      return {
        ...baseOptions,
        scales: {
          ...baseOptions.scales,
          y: {
            ...baseOptions.scales.y,
            position: 'left',
            title: {
              display: true,
              text: 'Revenue / Profit'
            }
          },
          y1: {
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: 'Orders'
            }
          }
        }
      };
    }

    return baseOptions;
  };

  // Get category sales distribution for pie chart
  const getCategorySalesData = () => {
    if (!salesData.categorySales || Object.keys(salesData.categorySales).length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e9ecef'],
          borderWidth: 0
        }]
      };
    }

    const labels = Object.keys(salesData.categorySales).map(
      key => key.charAt(0).toUpperCase() + key.slice(1)
    );
    
    const data = Object.values(salesData.categorySales);
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)'
    ];

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors.slice(0, data.length),
        borderWidth: 1,
        borderColor: '#fff'
      }]
    };
  };

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = formatCurrency(context.raw);
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Handle report type change
  const handleReportTypeChange = (type) => {
    setReportType(type);
  };

  // Handle time range change 
  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
  };

  // Handle date format change
  const handleDateFormatChange = (format) => {
    setDateFormat(format);
  };

  // Get proper period label based on current settings
  const getPeriodLabel = () => {
    switch(timeRange) {
      case '7': return 'Last 7 Days';
      case '30': return 'Last 30 Days';
      case '90': return 'Last 90 Days';
      case '365': return 'Last 365 Days';
      default: return 'Custom Period';
    }
  };

  return (
    <div className="sales-report p-3">
      <h4 className="mb-4">Sales Reports</h4>

      {/* Controls */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Select 
            value={timeRange} 
            onChange={(e) => handleTimeRangeChange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="365">Last Year</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select 
            value={dateFormat} 
            onChange={(e) => handleDateFormatChange(e.target.value)}
            disabled={timeRange === '7'} // Disable for 7 day view
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Form.Select>
        </Col>
        <Col md={4} className="text-end">
          <Button 
            variant="outline-secondary"
            onClick={() => {
              fetchSalesData(timeRange, dateFormat);
              fetchBestsellers(timeRange);
            }}
          >
            <i className="bi bi-arrow-repeat me-1"></i>
            Refresh Data
          </Button>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="summary-card h-100">
            <Card.Body className="text-center">
              <h6 className="text-uppercase text-muted">Revenue</h6>
              {loading ? (
                <div className="py-2"><Spinner animation="border" size="sm" /></div>
              ) : (
                <h3 className="mt-2 mb-0 text-success">
                  {formatCurrency(getTotalRevenue())}
                </h3>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card h-100">
            <Card.Body className="text-center">
              <h6 className="text-uppercase text-muted">Profit</h6>
              {loading ? (
                <div className="py-2"><Spinner animation="border" size="sm" /></div>
              ) : (
                <h3 className="mt-2 mb-0 text-primary">
                  {formatCurrency(getTotalProfit())}
                </h3>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card h-100">
            <Card.Body className="text-center">
              <h6 className="text-uppercase text-muted">Orders</h6>
              {loading ? (
                <div className="py-2"><Spinner animation="border" size="sm" /></div>
              ) : (
                <h3 className="mt-2 mb-0">
                  {getTotalOrders()}
                </h3>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card h-100">
            <Card.Body className="text-center">
              <h6 className="text-uppercase text-muted">Avg. Order</h6>
              {loading ? (
                <div className="py-2"><Spinner animation="border" size="sm" /></div>
              ) : (
                <h3 className="mt-2 mb-0">
                  {formatCurrency(getAverageOrderValue())}
                </h3>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Main Chart Section */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title">{getPeriodLabel()} Performance</h5>
                <Nav as="ul" className="reports-nav">
                  <Nav.Item as="li">
                    <Nav.Link
                      active={reportType === 'revenue'}
                      onClick={() => handleReportTypeChange('revenue')}
                    >
                      Revenue
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link
                      active={reportType === 'orders'}
                      onClick={() => handleReportTypeChange('orders')}
                    >
                      Orders
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link
                      active={reportType === 'profit'}
                      onClick={() => handleReportTypeChange('profit')}
                    >
                      Profit
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link
                      active={reportType === 'combined'}
                      onClick={() => handleReportTypeChange('combined')}
                    >
                      Combined
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
              
              <div style={{ height: '300px' }}>
                {loading ? (
                  <div className="h-100 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <Line 
                    data={getTimelineChartData()} 
                    options={getChartOptions()}
                  />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="card-title mb-3">Sales by Category</h5>
              <div style={{ height: '250px' }}>
                {loading ? (
                  <div className="h-100 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <Pie 
                    data={getCategorySalesData()} 
                    options={pieChartOptions}
                  />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bestsellers Section */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Best Selling Products</h5>
            </Card.Header>
            <Card.Body>
              {loadingBestsellers ? (
                <div className="text-center py-3">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
                  {bestsellers.length === 0 ? (
                    <Alert variant="info">No bestseller data available for this period.</Alert>
                  ) : (
                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th style={{ width: '5%' }}>#</th>
                          <th style={{ width: '45%' }}>Product</th>
                          <th style={{ width: '15%' }} className="text-center">Units Sold</th>
                          <th style={{ width: '15%' }} className="text-end">Revenue</th>
                          <th style={{ width: '15%' }} className="text-end">Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bestsellers.map((product, index) => (
                          <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                {product.image && (
                                  <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                    className="me-2 rounded"
                                  />
                                )}
                                <div>
                                  <div>{product.name}</div>
                                  <small className="text-muted">{product.category}</small>
                                </div>
                              </div>
                            </td>
                            <td className="text-center">{product.unitsSold}</td>
                            <td className="text-end">{formatCurrency(product.revenue)}</td>
                            <td className="text-end">{formatCurrency(product.profit)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalesReport; 