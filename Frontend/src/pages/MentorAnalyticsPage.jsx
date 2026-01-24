import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, Download, Info, ChevronRight } from 'lucide-react';
import analyticsService from '../services/analyticsService';
import { toast } from 'react-toastify';

const MentorAnalyticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [timeframe, setTimeframe] = useState('last30days');
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, [timeframe]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await analyticsService.getMentorSummary(timeframe);
            if (res.success) {
                setData(res.data);
            }
        } catch (error) {
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            await analyticsService.exportReport();
            toast.success('Report generated successfully');
        } catch (error) {
            toast.error('Failed to generate report');
        } finally {
            setExporting(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-vh-100 bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-indigo-500" />
                            Advanced Analytics
                        </h1>
                        <p className="text-gray-400">Deep insights into your mentorship performance and growth</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                        >
                            <option value="last7days">Last 7 Days</option>
                            <option value="last30days">Last 30 Days</option>
                            <option value="last90days">Last 90 Days</option>
                        </select>

                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                            {exporting ? (
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <Download size={18} />
                            )}
                            {exporting ? 'Exporting...' : 'Export PDF'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={`$${data?.summary.totalEarnings || 0}`}
                        icon={<DollarSign className="text-green-400" />}
                        color="border-green-500/20"
                    />
                    <StatCard
                        title="Total Sessions"
                        value={data?.summary.totalSessions || 0}
                        icon={<Calendar className="text-blue-400" />}
                        color="border-blue-500/20"
                    />
                    <StatCard
                        title="Active Students"
                        value={data?.summary.studentCount || 0}
                        icon={<Users className="text-purple-400" />}
                        color="border-purple-500/20"
                    />
                    <StatCard
                        title="Retention Rate"
                        value={`${data?.summary.retentionRate || 0}%`}
                        icon={<TrendingUp className="text-orange-400" />}
                        color="border-orange-500/20"
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <ChartCard title="Earnings Trend">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.timeframeStats}>
                                    <defs>
                                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis stroke="#9ca3af" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#818cf8' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#6366f1"
                                        fillOpacity={1}
                                        fill="url(#colorEarnings)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    <ChartCard title="Session Activity">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.timeframeStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis stroke="#9ca3af" fontSize={12} />
                                    <Tooltip
                                        cursor={{ fill: '#374151', opacity: 0.4 }}
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="sessions" fill="#818cf8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ChartCard title="Skill Impact Radar" className="lg:col-span-1">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={
                                    data?.skills.slice(0, 6).map(skill => ({
                                        subject: skill,
                                        A: Math.floor(Math.random() * 50) + 50, // Mocked data for radar demonstration
                                        fullMark: 150,
                                    }))
                                }>
                                    <PolarGrid stroke="#4b5563" />
                                    <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={10} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4b5563" />
                                    <Radar
                                        name="Usage"
                                        dataKey="A"
                                        stroke="#818cf8"
                                        fill="#818cf8"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    <div className="lg:col-span-2">
                        <ChartCard title="Engagement Insights">
                            <div className="space-y-6">
                                <InsightItem
                                    title="Retention Benchmark"
                                    desc="Your retention rate is 15% higher than the average platform mentor."
                                    icon={<TrendingUp className="text-green-400" />}
                                />
                                <InsightItem
                                    title="Peak Engagement"
                                    desc="Students are most active on your profile on Tuesdays and Wednesdays."
                                    icon={<Calendar className="text-blue-400" />}
                                />
                                <InsightItem
                                    title="Skill Demand"
                                    desc={`Your '${data?.skills[0] || 'Core'}' workshops have the highest conversion rate.`}
                                    icon={<Info className="text-indigo-400" />}
                                />
                                <div className="pt-4 border-t border-gray-700">
                                    <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 group transition-all">
                                        View detailed student breakdown <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </ChartCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm border ${color} rounded-2xl p-6 transition-transform hover:scale-[1.02] duration-300`}>
        <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">{title}</span>
            <div className="p-2 bg-gray-700/50 rounded-lg">{icon}</div>
        </div>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
    </div>
);

const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
        {children}
    </div>
);

const InsightItem = ({ title, desc, icon }) => (
    <div className="flex gap-4 items-start">
        <div className="p-2 bg-gray-700/50 rounded-lg shrink-0 mt-1">{icon}</div>
        <div>
            <h4 className="text-white font-medium mb-1">{title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default MentorAnalyticsPage;
