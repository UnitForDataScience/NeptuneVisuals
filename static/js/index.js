var table = $('#summary_table').DataTable({
    dom: "<'row'<'col-sm-3'l><'col-sm-3'f><'col-sm-6'p>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
});

function highlight(word, string) {
    var index = string.toLowerCase().indexOf(word);
    if (index >= 0) {
        string = string.substring(0, index) + "<span class='highlight'>" + string.substring(index, index + word.length) + "</span>" + string.substring(index + word.length);
    }
    return string;
}

$(function () {
    $("#tabs").tabs();
    scroller.init();
    var index = $('#tabs a[href="#tabs-1"]').parent().index();
    $("#tabs").tabs("option", "active", index);

    $('#summary_search').on('click', function () {
        console.log('request made');
        table.clear();
        $('#overlay').css('display', 'block');
        $.get({
            url: '/neptune/summary.php?keywords=' + $('#summary_textbox').val(),
            success: function (data) {
                $('#overlay').css('display', 'none');
                // data = data['message'];
                console.log(data);
                $('#summary_list').html('');
                var keywords = $('#summary_textbox').val().split(',');
                for (index in keywords) {
                    keywords[index] = keywords[index].toLowerCase().trim();
                }
                for (iter in data) {

                    var string = '<ul>';
                    var found = false;
                    for (i in data[iter][1]) {
                        if (data[iter][1][i]) {
                            found = true;
                            for (index in keywords) {
                                data[iter][1][i] = highlight(keywords[index], data[iter][1][i]);
                            }
                            string += '<li>' + data[iter][1][i] + '</li>'
                        }
                    }

                    string += '</ul>';
                    if (found)
                        table.row.add([data[iter][0], string])
                }

                table.draw();

            },
            error: function (data) {
                console.log('here1')
                console.log(data);
            }
        })
    })
});