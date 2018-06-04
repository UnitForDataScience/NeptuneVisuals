$(function() {
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
$.ajax({
    method: 'get',
    url: '/neptune/data/regionCounterData.json',
    success: function(data) {
        for (region in data) {
            types = Object.keys(data[region])
            series = []
            for (key in data[region]) {
                if (key != "Performance")
                    series.push(data[region][key]['count'])
            }
            var newTypes = []
            for (iter in types) {
                if (types[iter] != "Performance") {
                    newTypes.push(types[iter])
                }
            }
            var title = "Region: "

            if (region == "combined") {
                title += "Combined"
            } else {
                title += region
            }
            Highcharts.chart(region, {
                chart: {
                    polar: true,
                    type: 'line'
                },
                title: {
                    text: title
                },
                pane: {
                    size: '80%'
                },
                xAxis: {
                    tickmarkPlacement: 'on',
                    lineWidth: 0,
                    categories: newTypes
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
                    data: series,
                    pointPlacement: 'on'
                }]
            });
        }
    },
    error: function(data) {}
})
})