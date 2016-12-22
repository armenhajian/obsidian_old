$(".tours-filter #cat").on('hover', function () {
    var count = $(this).children().length;
    $(this).attr('size', count);
}, function () {
    $(this).removeAttr('size');
});
$(".tours-filter #days").on('hover', function () {
    var count = $(this).children().length;
    $(this).attr('size', count);
}, function () {
    $(this).removeAttr('size');
});

$(".tours-filter #cat").on('change', function () {
    filterItems()
});
$(".tours-filter #days").on('change', function () {
    filterItems()
});

function filterItems() {
    $.ajax({
        url:'/tours/filter',
        type:'get',
        data : {
            category:$(".tours-filter #cat").val(),
            days:$(".tours-filter #days").val()
        }
    }).done(function(data){
        $("#tours").html(data);
    })
}