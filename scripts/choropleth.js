$(function() {
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
var H = Highcharts,
    map = H.maps['countries/us/us-all'],
    chart;
var newData = [];
var mainData = [];
$.ajax({
    url: '/neptune/data/data.json',
    type: 'get',
    dataType: 'json',
    success: function(data) {
        mainData = data;
        for (var temp = 0; temp < data.length; temp++) {
            newData[temp] = data[temp]
            newData[temp]['lat'] = newData[temp]['Latitude'];
            newData[temp]['lon'] = newData[temp]['Long'];
            newData[temp]['z'] = newData[temp]['Intensity'];
        }
        chart = Highcharts.mapChart('container', {
            title: {
                text: 'Human Errors in Nuclear Power Plants'
            },

            tooltip: {
                pointFormat: 'Plant: {point.Name} <br>' +
                    'Lat: {point.lat}<br>' +
                    'Lon: {point.lon}<br>' +
                    'Intensity: {point.z}'
            },

            xAxis: {
                crosshair: {
                    zIndex: 5,
                    dashStyle: 'dot',
                    snap: false,
                    color: 'gray'
                }
            },

            yAxis: {
                crosshair: {
                    zIndex: 5,
                    dashStyle: 'dot',
                    snap: false,
                    color: 'gray'
                }
            },

            series: [{
                name: 'Basemap',
                mapData: map,
                borderColor: '#606060',
                nullColor: 'rgba(200, 200, 200, 0.2)',
                showInLegend: false
            }, {
                name: 'Separators',
                type: 'mapline',
                data: H.geojson(map, 'mapline'),
                color: '#101010',
                enableMouseTracking: false,
                showInLegend: false
            }, {
                type: 'mapbubble',
                dataLabels: {
                    enabled: true,
                    format: '{point.z}'
                },
                name: 'Power-Plants',
                data: [],
                maxSize: '12%',
                minSize: '1%',
                color: H.getOptions().colors[0]
            }]
        });
        changeTheContent();
        // Display custom label with lat/lon next to crosshairs
        $('#container').mousemove(function(e) {
            var position;
            if (chart) {
                if (!chart.lab) {
                    chart.lab = chart.renderer.text('', 0, 0)
                        .attr({
                            zIndex: 5
                        })
                        .css({
                            color: '#505050'
                        })
                        .add();
                }
                e = chart.pointer.normalize(e);
                position = chart.fromPointToLatLon({
                    x: chart.xAxis[0].toValue(e.chartX),
                    y: chart.yAxis[0].toValue(e.chartY)
                });
                chart.lab.attr({
                    x: e.chartX + 5,
                    y: e.chartY - 22,
                    text: 'Lat: ' + position.lat.toFixed(2) + '<br>Lon: ' + position.lon.toFixed(2)
                });
            }
        });
        $('#container').mouseout(function() {
            if (chart && chart.lab) {
                chart.lab.destroy();
                chart.lab = null;
            }
        });
    }
});
function changeTheContent() {
    var region = $('#RegionSelect').val();
    var unit = $('#UnitSelect').val();
    var updateData = [];
    for (iter in mainData) {
        if (((mainData[iter]['Units'].toString()) == unit || unit == "All")
                && ((mainData[iter]['Region'].toString()) == region || region == "All")) {
            updateData.push({
                lat: mainData[iter]['Latitude'],
                lon: mainData[iter]['Long'],
                z: mainData[iter]["Intensity"],
                Name: mainData[iter]["Name"]
            })
        }
    }
    console.log(updateData);
    $("#container").highcharts().series[2].update({
        data: updateData
    })
}
$('#RegionSelect').change(function() {
    changeTheContent();
})
$('#UnitSelect').change(function() {
    changeTheContent();
})
});