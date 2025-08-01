import React, { useCallback, useEffect, useRef, useState } from 'react'
import Chart from 'react-apexcharts'
import { Activity, Building2, DollarSign, TrendingDown, TrendingUp, Users } from 'lucide-react'
import DealsService from "@/services/api/dealsService";
import { activitiesService } from '@/services/api/activitiesService'
import { companiesService } from '@/services/api/companiesService'
import { contactsService } from '@/services/api/contactsService'
import Loading from '@/components/ui/Loading'

// Create instance of DealsService
const dealsService = new DealsService();
import Error from "@/components/ui/Error";

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const chartRefs = useRef({});
  const containerRefs = useRef({});
  const isMountedRef = useRef(true);

  // Safe chart data validator
  const validateChartData = useCallback((data, type = 'array') => {
    if (!data) return type === 'array' ? [] : {};
    
    if (type === 'array') {
      return Array.isArray(data) ? data.filter(item => item != null && !isNaN(Number(item))) : [];
    }
    
    if (type === 'object') {
      return typeof data === 'object' && data !== null ? data : {};
    }
    
    return data;
  }, []);

  // Safe chart container dimension checker
  const checkContainerDimensions = useCallback((containerId) => {
    const container = containerRefs.current[containerId];
    if (!container) return false;
    
    const rect = container.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    const fetchAnalytics = async () => {
      if (!isMountedRef.current) return;
      
      try {
        setLoading(true);
        setError(null);

        const [deals, contacts, companies, activities] = await Promise.all([
          dealsService.getDeals().catch(() => []),
          contactsService.getContacts().catch(() => []),
          companiesService.getCompanies().catch(() => []),
          activitiesService.getActivities().catch(() => [])
        ]);

        if (!isMountedRef.current) return;

        // Validate and calculate analytics with null checks
        const safeDeals = validateChartData(deals, 'array');
        const safeContacts = validateChartData(contacts, 'array');
        const safeCompanies = validateChartData(companies, 'array');

        const totalDeals = safeDeals.length;
        const totalContacts = safeContacts.length;
        const totalCompanies = safeCompanies.length;
        const totalRevenue = safeDeals.reduce((sum, deal) => {
          const value = deal?.value;
          return sum + (typeof value === 'number' && !isNaN(value) ? value : 0);
        }, 0);

        // Revenue by month with validation
        const revenueByMonth = safeDeals.reduce((acc, deal) => {
          if (deal?.createdAt && deal?.value && !isNaN(deal.value)) {
            try {
              const date = new Date(deal.createdAt);
              if (!isNaN(date.getTime())) {
                const month = date.toLocaleString('default', { month: 'short' });
                acc[month] = (acc[month] || 0) + Number(deal.value);
              }
            } catch (e) {
              console.warn('Invalid date in deal:', deal.createdAt);
            }
          }
          return acc;
        }, {});

        // Deals by stage with validation
        const dealsByStage = safeDeals.reduce((acc, deal) => {
          const stage = deal?.stage && typeof deal.stage === 'string' ? deal.stage : 'Unknown';
          acc[stage] = (acc[stage] || 0) + 1;
          return acc;
        }, {});

        // Ensure we have at least some data for charts
        const finalRevenueByMonth = Object.keys(revenueByMonth).length > 0 
          ? revenueByMonth 
          : { 'Jan': 0, 'Feb': 0, 'Mar': 0 };

        const finalDealsByStage = Object.keys(dealsByStage).length > 0 
          ? dealsByStage 
          : { 'New': 0, 'Qualified': 0, 'Proposal': 0, 'Won': 0 };

        if (isMountedRef.current) {
          setAnalytics({
            totalDeals,
            totalContacts,
            totalCompanies,
            totalRevenue,
            revenueByMonth: finalRevenueByMonth,
            dealsByStage: finalDealsByStage
          });
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error('Analytics fetch error:', err);
          setError(err?.message || 'Failed to fetch analytics');
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [validateChartData]);

  // Cleanup chart instances on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      // Safely destroy all chart instances
      Object.entries(chartRefs.current).forEach(([key, chart]) => {
        if (chart && typeof chart.destroy === 'function') {
          try {
            chart.destroy();
          } catch (e) {
            console.warn(`Error destroying chart ${key}:`, e);
          }
        }
      });
      chartRefs.current = {};
      containerRefs.current = {};
    };
  }, []);

  // Safe chart update handler
  const handleChartReady = useCallback((chartInstance, chartId) => {
    if (!isMountedRef.current) return;
    
    try {
      chartRefs.current[chartId] = chartInstance;
    } catch (e) {
      console.warn(`Error setting chart reference for ${chartId}:`, e);
    }
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!analytics) return <Error message="No analytics data available" />;

  // Prepare chart data with comprehensive validation
  const revenueData = validateChartData(analytics.revenueByMonth, 'object');
  const stageData = validateChartData(analytics.dealsByStage, 'object');

  const revenueCategories = Object.keys(revenueData).filter(key => key && typeof key === 'string');
  const revenueValues = Object.values(revenueData).map(val => {
    const num = Number(val);
    return !isNaN(num) && isFinite(num) ? num : 0;
  });

  const stageLabels = Object.keys(stageData).filter(key => key && typeof key === 'string');
  const stageValues = Object.values(stageData).map(val => {
    const num = Number(val);
    return !isNaN(num) && isFinite(num) ? Math.max(0, num) : 0;
  });

  // Only render charts if we have valid data and dimensions
  const canRenderRevenueChart = revenueCategories.length > 0 && revenueValues.some(val => val > 0);
  const canRenderStageChart = stageLabels.length > 0 && stageValues.some(val => val > 0);

  const revenueChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      animations: { enabled: false }, // Disable animations to prevent errors
      events: {
        mounted: (chart) => handleChartReady(chart, 'revenue'),
        beforeDestroy: () => {
          if (chartRefs.current.revenue) {
            chartRefs.current.revenue = null;
          }
        }
      }
    },
    colors: ['#5B5FDE'],
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: revenueCategories,
      labels: { style: { colors: '#64748B' } }
    },
    yaxis: { 
      labels: { style: { colors: '#64748B' } },
      min: 0
    },
    grid: { borderColor: '#E2E8F0' },
    tooltip: {
      y: {
        formatter: (value) => {
          const num = Number(value);
          return !isNaN(num) ? `$${num.toLocaleString()}` : '$0';
        }
      }
    },
    noData: {
      text: 'No revenue data available',
      style: { fontSize: '16px', color: '#64748B' }
    }
  };

  const revenueChartSeries = [
    {
      name: 'Revenue',
      data: revenueValues
    }
  ];

  const stageChartOptions = {
    chart: {
      type: 'donut',
      height: 300,
      animations: { enabled: false }, // Disable animations to prevent errors
      events: {
        mounted: (chart) => handleChartReady(chart, 'stage'),
        beforeDestroy: () => {
          if (chartRefs.current.stage) {
            chartRefs.current.stage = null;
          }
        }
      }
    },
    colors: ['#5B5FDE', '#00D4AA', '#FFB800', '#FF4747'],
    labels: stageLabels,
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    dataLabels: {
      formatter: (val, opts) => {
        const value = opts.w.globals.series[opts.seriesIndex];
        return !isNaN(value) && value > 0 ? `${Math.round(val)}%` : '0%';
      }
    },
    noData: {
      text: 'No deal stage data available',
      style: { fontSize: '16px', color: '#64748B' }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(analytics.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalDeals || 0}</p>
            </div>
            <div className="p-3 bg-accent-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalContacts || 0}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalCompanies || 0}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <div 
            ref={(el) => {
              if (el) containerRefs.current.revenue = el;
            }}
            style={{ minHeight: '350px', width: '100%' }}
          >
            {canRenderRevenueChart ? (
              <Chart
                options={revenueChartOptions}
                series={revenueChartSeries}
                type="line"
                height={350}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No revenue data to display</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Deals by Stage Chart */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deals by Stage</h2>
          <div 
            ref={(el) => {
              if (el) containerRefs.current.stage = el;
            }}
            style={{ minHeight: '300px', width: '100%' }}
          >
            {canRenderStageChart ? (
              <Chart
                options={stageChartOptions}
                series={stageValues}
                type="donut"
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No deal stage data to display</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;