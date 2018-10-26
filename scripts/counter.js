$(function() {
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

  table = $('#dataTables').DataTable();

  var jsonData;
  var powerPlants;
  function updateDataTable(options) {
    for (iter in textFileData[options.type]) {
      var displayString = '<div class="col-md-12 col-12 col-xl-12 col-sm-12 col-lg-12">'
      for (iter2 in textFileData[options.type][iter]) {
        displayString += '<div>' + textFileData[options.type][iter][iter2].keyWord + ":" + textFileData[options.type][iter][iter2].count + '</div>'
      }
      displayString += "</div>"
      table.row.add([options.type, iter, '<div>' + displayString + '</div>'])
    }
    table.draw()
  }

  function clearDataTable() {
    table
      .clear()
      .draw();
  }
  function drawChart(dataCounts, xAxisTypes) {
    newData = _.map(dataCounts, function(data, index) {
      return {
        y: data,
        type: xAxisTypes[index]
      }
    })
    clearDataTable()
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
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function() {
                clearDataTable()
                updateDataTable(this.options)
              }
            }
          }
        }
      },
      series: [{
        name: 'Errors',
        data: newData,
        pointPlacement: 'on'
      }]
    });
  }
  var textFileData;
  function dataReady() {
    powerPlants = Object.keys(jsonData);
    $.each(powerPlants, function(i, item) {
      $('#PlantSelect').append($('<option>', {
        value: item,
        text: item
      }));
    });

    $('#PlantSelect').change(function() {
      textFileData = {}
      clearDataTable()
      var value = $('#PlantSelect').val();
      var data = jsonData[value];
      var chartData = {};
      var types;
      for (textFile in data) {

        for (type in data[textFile]) {
          if (!chartData[type]) {
            chartData[type] = 1;
          } else {
            chartData[type] += 1;
          }
          if (!textFileData[type]) {
            textFileData[type] = {}
          }
          if (!textFileData[type][textFile]) {
            textFileData[type][textFile] = []
          }
          for (keyWord in data[textFile][type]) {
            textFileData[type][textFile].push({
              keyWord: keyWord,
              count: data[textFile][type][keyWord]
            })
          }
        }
      }
      types = Object.keys(chartData);
      var array = [];
      types.sort();
      for (i in types) {
        array.push(chartData[types[i]]);
      }
      drawChart(array, types);
    });
  }

  $.ajax({
    url: '/neptune/data/counter.json',
    method: 'get',
    success: function(data) {
      jsonData = data;
      dataReady();
    },
    error: function(data) {}
  })
});
