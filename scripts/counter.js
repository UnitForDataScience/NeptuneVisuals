$(function () {
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    var jsonData;
    var powerPlants;

    function drawChart(dataCounts, xAxisTypes) {
        var highChart = Highcharts.chart('container', {
            chart: {
                polar: true,
                type: 'line'
            },
            title: {
                text: ''
            },
            pane: {
                size: '80%'
            },
            xAxis: {
                tickmarkPlacement: 'on',
                lineWidth: 0,
                categories: xAxisTypes
            },
            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },
            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },
            series: [{
                name: 'Errors',
                data: dataCounts,
                pointPlacement: 'on'
            }]
        });
    }

    function dataReady() {
        powerPlants = Object.keys(jsonData);
        $.each(powerPlants, function (i, item) {
            $('#PlantSelect').append($('<option>', {
                value: item,
                text: item
            }));
        });
        $('#PlantSelect').change(function () {
            var value = $('#PlantSelect').val();
            var data = jsonData[value];
            var chartData = {};
            var types;
            for (textFile in data) {
                for (type in data[textFile]) {
                    if (!chartData[type])
                        chartData[type] = 1;
                    else
                        chartData[type] += 1;
                }
            }
            types = Object.keys(chartData);

            var array = [];
            for (i in types) {
                array.push(chartData[types[i]]);
            }
            drawChart(array, types);
        });
    }

    $.ajax({
        url: '/neptune/data/counter.json',
        method: 'get',
        success: function (data) {
            jsonData = data;
            dataReady();
        },
        error: function (data) {

        }
    })
});