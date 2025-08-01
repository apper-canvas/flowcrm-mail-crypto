import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import dealsService from "@/services/api/dealsService";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const AnalyticsPage = ({ onMenuClick }) => {
  const [analytics, setAnalytics] = useState(null);
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsData, pipelineInfo] = await Promise.all([
        dealsService.getAnalytics(),
        dealsService.getPipelineData()
      ]);
      
      setAnalytics(analyticsData);
      setPipelineData(pipelineInfo);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

// Chart configuration for pipeline funnel
  const chartOptions = {
    chart: {
      type: "funnel",
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      funnel: {
        sortByValues: false,
        pyramid: false,
        reversed: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opt) {
        const stage = pipelineData?.[opt.dataPointIndex];
        return stage ? `${stage.stage}: ${stage.count}` : '';
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      y: {
        formatter: function(val, opts) {
          const stage = pipelineData?.[opts.dataPointIndex];
          return stage ? `${stage.count} deals` : '';
        }
      }
    },
    labels: pipelineData?.map(stage => stage.stage) || []
  };

  // Funnel charts require simple array of values, not objects
  const chartSeries = pipelineData?.map(stage => stage.count) || [];

  // Guard against empty or invalid data
  const hasValidData = chartSeries.length > 0 && chartSeries.every(val => typeof val === 'number' && val >= 0);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;

  return (
    <div className="space-y-6">
      <Header title="Analytics" onMenuClick={onMenuClick} />

      <div className="px-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Pipeline Value */}
          <div className="bg-white rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(analytics?.totalPipelineValue || 0)}
                </p>
              </div>
              <div className="p-3 gradient-primary rounded-lg">
                <ApperIcon name="DollarSign" size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Active Deals */}
          <div className="bg-white rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analytics?.activeDealsCount || 0}
                </p>
              </div>
              <div className="p-3 gradient-accent rounded-lg">
                <ApperIcon name="Target" size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Monthly Closed Deals */}
          <div className="bg-white rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Closed Deals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analytics?.monthlyClosedDealsCount || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(analytics?.monthlyClosedDealsValue || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <ApperIcon name="TrendingUp" size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-white rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analytics?.winRate || 0}%
                </p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-lg">
                <ApperIcon name="Award" size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

{/* Pipeline Funnel Chart */}
        <div className="bg-white rounded-lg p-6 shadow-card">
          <div className="flex items-center mb-6">
            <ApperIcon name="BarChart3" size={20} className="text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Sales Pipeline Funnel</h3>
          </div>
          <div className="h-96">
            {!hasValidData ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">No pipeline data available</p>
                  <p className="text-sm">Data will appear here once deals are created</p>
                </div>
              </div>
            ) : (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="funnel"
                height="100%"
              />
            )}
          </div>

          {/* Pipeline Stats Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pipelineData.map((stage, index) => (
              <div key={stage.stage} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">{stage.stage}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stage.count}</p>
                <p className="text-sm text-gray-500">{formatCurrency(stage.value)}</p>
              </div>
            ))}
          </div>
        </div>
</div>
      </div>
    </div>
  );
};

export default AnalyticsPage;