//----------------------------IOC类型 pie --------------------------------------

// 数据
const iocData = [
    { name: 'IP', value: 12200 },
    { name: '端口', value: 800 },
    { name: 'Payload', value: 1500 },
    { name: 'URL', value: 2000 },
    { name: 'HASH', value: 5020 }
];
// 计算总和
const total = iocData.reduce((sum, item) => sum + item.value, 0);
// 格式化函数
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
// 初始化图表实例
var typeChart = echarts.init(document.getElementById('typePieChart'));

// 配置项
var typeChartOption = {
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            const percent = ((params.value / total) * 100).toFixed(1);
            return `${params.seriesName} <br/>${params.name}: ${formatNumber(params.value)} (${percent}%)`;
        }
    },
    legend: {
        orient: 'vertical',
        right: 10,
        bottom: 20
    },
    series: [
        {
            name: 'IOC 类型',
            type: 'pie',
            radius: '50%',
            data: iocData,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                show: true,
                formatter: function (params) {
                    const percent = ((params.value / total) * 100).toFixed(1);
                    return `${params.name}: ${formatNumber(params.value)} (${percent}%)`;
                }
            },
            itemStyle: {
                // 使用 visualMap 中的颜色渐变
                color: function(params) {
                    //const colors = ["#d2ecf1", "#b4deff", "#73c1ff", "#35a9ff", "#237bff", "#004bbc"];
                    const colors = ["#a1d9e8", "#7ac6e5", "#52b3e1", "#2a9fd2", "#008ac3", "#006096"];
                    const index = params.dataIndex % colors.length;
                    return colors[index];
                }
            }
        }
    ]
};

// 使用刚指定的配置项和数据显示图表
typeChart.setOption(typeChartOption);

//----------------------------IOC类型 pie end--------------------------------------

//----------------------------IOC数量时序数据linechart --------------------------------------
// 生成一年的数据，单位为每小时
var generateHourlyDates = (start, count) => {
    let dates = [];
    let startDate = new Date(start);
    for (let i = 0; i < count; i++) {
        let date = new Date(startDate);
        date.setHours(startDate.getHours() + i);
        dates.push(date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]);
    }
    return dates;
};

const start_date = '2024-01-01';
const hours_count = 365 * 24; // 一年的小时数

var hourlyDates = generateHourlyDates(start_date, hours_count);

// 生成随机数据
var generateRandomData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * 200));
    }
    return data;
};

var attackHourData = {
    hourlyDates: hourlyDates,
    malware: generateRandomData(hours_count),
    phishing: generateRandomData(hours_count),
    ddos: generateRandomData(hours_count),
    botnet: generateRandomData(hours_count),
    app_attack: generateRandomData(hours_count)
};

// 计算总量
var totalHourData = attackHourData.hourlyDates.map((_, index) => {
    return attackHourData.malware[index] + attackHourData.phishing[index] + attackHourData.ddos[index] + attackHourData.botnet[index] + attackHourData.app_attack[index];
});

// 生成每天的数据
var generateDailyData = (hourlyData) => {
    const dailyData = [];
    for (let i = 0; i < hourlyData.length; i += 24) {
        dailyData.push(hourlyData.slice(i, i + 24).reduce((sum, value) => sum + value, 0));
    }
    return dailyData;
};

var attackDailyData = {
    dailyDates: hourlyDates.filter((_, index) => index % 24 === 0).map(dateStr => dateStr.split(' ')[0]),
    malware: generateDailyData(attackHourData.malware),
    phishing: generateDailyData(attackHourData.phishing),
    ddos: generateDailyData(attackHourData.ddos),
    botnet: generateDailyData(attackHourData.botnet),
    app_attack: generateDailyData(attackHourData.app_attack)
};

var totalDailyData = generateDailyData(totalHourData);

// 生成每月的数据
var generateMonthlyData = (dailyData) => {
    const monthlyData = [];
    for (let i = 0; i < dailyData.length; i += 30) {
        monthlyData.push(dailyData.slice(i, i + 30).reduce((sum, value) => sum + value, 0));
    }
    return monthlyData;
};

var attackMonthData = {
    monthlyDates: attackDailyData.dailyDates.filter((_, index) => index % 30 === 0),
    malware: generateMonthlyData(attackDailyData.malware),
    phishing: generateMonthlyData(attackDailyData.phishing),
    ddos: generateMonthlyData(attackDailyData.ddos),
    botnet: generateMonthlyData(attackDailyData.botnet),
    app_attack: generateMonthlyData(attackDailyData.app_attack)
};

var totalMonthData = generateMonthlyData(totalDailyData);

// 计算最近2天的数据(每时)
var recent2DaysData = {
    hourlyDates: hourlyDates.slice(-48),
    malware: attackHourData.malware.slice(-48),
    phishing: attackHourData.phishing.slice(-48),
    ddos: attackHourData.ddos.slice(-48),
    botnet: attackHourData.botnet.slice(-48),
    app_attack: attackHourData.app_attack.slice(-48)
};

var recent2DaysTotalData = recent2DaysData.hourlyDates.map((_, index) => {
    return recent2DaysData.malware[index] + recent2DaysData.phishing[index] + recent2DaysData.ddos[index] + recent2DaysData.botnet[index] + recent2DaysData.app_attack[index];
});

// 计算最近1个月的数据(每天)
var recent1MonthData = {
    dailyDates: attackDailyData.dailyDates.slice(-30),
    malware: attackDailyData.malware.slice(-30),
    phishing: attackDailyData.phishing.slice(-30),
    ddos: attackDailyData.ddos.slice(-30),
    botnet: attackDailyData.botnet.slice(-30),
    app_attack: attackDailyData.app_attack.slice(-30)
};

var recent1MonthTotalData = recent1MonthData.dailyDates.map((_, index) => {
    return recent1MonthData.malware[index] + recent1MonthData.phishing[index] + recent1MonthData.ddos[index] + recent1MonthData.botnet[index] + recent1MonthData.app_attack[index];
});
// 计算最近一年的数据(每月)
var recent1YearData = {
    monthlyDates: attackMonthData.monthlyDates.slice(-12),
    malware: attackMonthData.malware.slice(-12),
    phishing: attackMonthData.phishing.slice(-12),
    ddos: attackMonthData.ddos.slice(-12),
    botnet: attackMonthData.botnet.slice(-12),
    app_attack: attackMonthData.app_attack.slice(-12)
};

var recent1YearTotalData =recent1YearData.monthlyDates.map((_, index) => {
    return recent1YearData.malware[index] + recent1YearData.phishing[index] + recent1YearData.ddos[index] + recent1YearData.botnet[index] + recent1YearData.app_attack[index];
});




// 初始化图表实例
var ctiTimelineChart = echarts.init(document.getElementById('ctiTimelineChart'));

// 颜色数组，调整对比度
const colors = ["#a1d9e8", "#7ac6e5", "#52b3e1", "#2a9fd2", "#008ac3", "#006096"];

// 配置项
var ctiTimelineOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: ['恶意软件', '钓鱼', 'DDoS', '僵尸网络', '应用层攻击', '总量'],
        orient: 'vertical',
        right: 10,
        bottom:60,
        icon: 'rect', // 图例形状为长方形
        // textStyle: {
        //     color: ['#a1d9e8', '#7ac6e5', '#52b3e1', '#2a9fd2', '#008ac3', '#006096']
        // }
    },
    grid: {
        left: '3%', // 调整左侧空白
        right: '12%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: recent2DaysData.hourlyDates.map(dateStr => {
            let date = new Date(dateStr);
            return  ` ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        }),
        axisLabel: {
            interval: 6, //标签间隔6
            rotate:0
        }
    },
    yAxis: {
        type: 'value',
        name: '数量'
    },
    series: [
        {
            name: '恶意软件',
            type: 'bar',
            stack: '总量',
            data: recent2DaysData.malware,
            areaStyle: {},
            itemStyle: {
                color: colors[0]
            }
        },
        {
            name: '钓鱼',
            type: 'bar',
            stack: '总量',
            data: recent2DaysData.phishing,
            areaStyle: {},
            itemStyle: {
                color: colors[1]
            }
        },
        {
            name: 'DDoS',
            type: 'bar',
            stack: '总量',
            data: recent2DaysData.ddos,
            areaStyle: {},
            itemStyle: {
                color: colors[2]
            }
        },
        {
            name: '僵尸网络',
            type: 'bar',
            stack: '总量',
            data: recent2DaysData.botnet,
            areaStyle: {},
            itemStyle: {
                color: colors[3]
            }
        },
        {
            name: '应用层攻击',
            type: 'bar',
            stack: '总量',
            data: recent2DaysData.app_attack,
            areaStyle: {},
            itemStyle: {
                color: colors[4]
            }
        },
        {
            name: '总量',
            type: 'line',
            data: recent2DaysTotalData,
            symbol: 'none', // 不显示折线点
            itemStyle: {
                color: colors[5]
            },
            lineStyle: {
                color: colors[5],
                width: 2 // 折线宽度
            },
            z: 100 // 提升折线层级
        }
    ]
}

// 使用刚指定的配置项和数据显示图表
ctiTimelineChart.setOption(ctiTimelineOption);

//切换显示模式
function changeTimelineMode(mode) {
    let dateData, attackData_tmp, totalData_tmp, interval;
    
    switch(mode) {
        case 'day':
            dateData = recent1MonthData.dailyDates.map(dateStr => {
                let date = new Date(dateStr);
                return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            });
            attackData_tmp = recent1MonthData;
            totalData_tmp = recent1MonthTotalData;
            interval = 4;
            break;
        case 'month':
            dateData = recent1YearData.monthlyDates.map(dateStr => {
                let date = new Date(dateStr);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            });
            attackData_tmp = recent1YearData;
            totalData_tmp = recent1YearTotalData;
            interval = 1;
            break;
        default: // hour
            dateData = recent2DaysData.hourlyDates.map(dateStr => {
                let date = new Date(dateStr);
                return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            });
            attackData_tmp = recent2DaysData;
            totalData_tmp = recent2DaysTotalData;
            interval = 6;
    }
    
    // 完整的配置项
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['恶意软件', '钓鱼', 'DDoS', '僵尸网络', '应用层攻击', '总量'],
            orient: 'vertical',
            right: 10,
            bottom: 60,
            icon: 'rect'
        },
        grid: {
            left: '3%',
            right: '12%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dateData,
            axisLabel: {
                interval: interval,
                rotate: 0
            }
        },
        yAxis: {
            type: 'value',
            name: '数量'
        },
        series: [
            {
                name: '恶意软件',
                type: 'bar',
                stack: '总量',
                data: attackData_tmp.malware,
                areaStyle: {},
                itemStyle: {
                    color: colors[0]
                }
            },
            {
                name: '钓鱼',
                type: 'bar',
                stack: '总量',
                data: attackData_tmp.phishing,
                areaStyle: {},
                itemStyle: {
                    color: colors[1]
                }
            },
            {
                name: 'DDoS',
                type: 'bar',
                stack: '总量',
                data: attackData_tmp.ddos,
                areaStyle: {},
                itemStyle: {
                    color: colors[2]
                }
            },
            {
                name: '僵尸网络',
                type: 'bar',
                stack: '总量',
                data: attackData_tmp.botnet,
                areaStyle: {},
                itemStyle: {
                    color: colors[3]
                }
            },
            {
                name: '应用层攻击',
                type: 'bar',
                stack: '总量',
                data: attackData_tmp.app_attack,
                areaStyle: {},
                itemStyle: {
                    color: colors[4]
                }
            },
            {
                name: '总量',
                type: 'line',
                data: totalData_tmp,
                symbol: 'none',
                itemStyle: {
                    color: colors[5]
                },
                lineStyle: {
                    color: colors[5],
                    width: 2
                },
                z: 100
            }
        ]
    };

    // 使用完整的配置项更新图表
    ctiTimelineChart.setOption(option, true);
}

// 修改 renderIOCTypeDistributionChart 函数
function renderIOCTypeDistributionChart(data) {
    // 过滤掉 total
    const filteredData = data.filter(item => item.name !== 'total');
    
    // 计算新的总数
    const total = filteredData.reduce((sum, item) => sum + item.value, 0);
    
    // 完整的配置项
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                const percent = ((params.value / total) * 100).toFixed(1);
                return ` ${params.name}<br/>${formatNumber(params.value)} (${percent}%)`;
            }
        },
        legend: {
            orient: 'vertical',
            right: 10,
            bottom: 20,
            data: filteredData.map(item => item.name)
        },
        series: [
            {
                name: 'IOC 类型',
                type: 'pie',
                radius: '50%',
                data: filteredData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: true,
                    formatter: function (params) {
                        const percent = ((params.value / total) * 100).toFixed(1);
                        return `${params.name}: ${formatNumber(params.value)}(${percent}%)`;
                    }
                },
                itemStyle: {
                    color: function(params) {
                        const colors = ["#a1d9e8", "#7ac6e5", "#52b3e1", "#2a9fd2", "#008ac3", "#006096"];
                        const index = params.dataIndex % colors.length;
                        return colors[index];
                    }
                }
            }
        ]
    };

    // 使用完整的配置项更新图表
    typeChart.setOption(option, true);
}

// 修改 renderAttackTypeTimelineChart 函数
function renderAttackTypeTimelineChart(data) {
    let mode = $('.head-toolbar-3 .blue').data('tab') || 'hour';
    let formattedDates = data.map(item => {
        let date = new Date(item.time);
        switch(mode) {
            case 'day':
                return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            case 'month':
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            default: // hour
                return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        }
    });

    // 完整的配置项
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['恶意流量', '蜜罐信息', '僵尸网络', '应用层攻击', '开源信息', '总量'],
            orient: 'vertical',
            right: 10,
            bottom: 60
        },
        grid: {
            left: '3%',
            right: '12%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: formattedDates,
            axisLabel: {
                interval: mode === 'hour' ? 6 : (mode === 'day' ? 4 : 1)
            }
        },
        yAxis: {
            type: 'value',
            name: '数量'
        },
        series: [
            {
                name: '恶意流量',
                type: 'bar',
                stack: '总量',
                data: data.map(item => item.malicious_traffic),
                areaStyle: {},
                itemStyle: {
                    color: colors[0]
                }
            },
            {
                name: '蜜罐信息',
                type: 'bar',
                stack: '总量',
                data: data.map(item => item.honeypot_info),
                areaStyle: {},
                itemStyle: {
                    color: colors[1]
                }
            },
            {
                name: '僵尸网络',
                type: 'bar',
                stack: '总量',
                data: data.map(item => item.botnet),
                areaStyle: {},
                itemStyle: {
                    color: colors[2]
                }
            },
            {
                name: '应用层攻击',
                type: 'bar',
                stack: '总量',
                data: data.map(item => item.app_layer_attack),
                areaStyle: {},
                itemStyle: {
                    color: colors[3]
                }
            },
            {
                name: '开源信息',
                type: 'bar',
                stack: '总量',
                data: data.map(item => item.open_source_info),
                areaStyle: {},
                itemStyle: {
                    color: colors[4]
                }
            },
            {
                name: '总量',
                type: 'line',
                data: data.map(item => item.total),
                itemStyle: {
                    color: colors[5]
                },
                lineStyle: {
                    width: 2
                },
                symbol: 'none',
                z: 100
            }
        ]
    };

    // 使用完整的配置项更新图表
    ctiTimelineChart.setOption(option, true);
}