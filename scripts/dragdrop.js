$(document).ready(function () {
    var selectedButton;
    $('.dragItem').on('click keyup', function (e) {
        const key = e.which || e.keyCode;
        if((key === 13 || key === 32) || e.type === "click"){
            e.stopPropagation();
            if ($(this).attr('aria-pressed') == 'true') {
                clearSelection();
                return;
            }
            $('.dragItem')
                .addClass('disabled')
                .attr({
                    'aria-disabled': true,
                    'tabindex': -1
                });
            
            selectedButton = $(this).attr('id');
            console.log('selectedButton ', selectedButton, $('#' + selectedButton).text())
            setLiveRegion($('#' + selectedButton).text() + ' grabbed.');
            $(this).attr({
                'aria-disabled': false,
                'draggable': false,
                'aria-grabbed':true,
                'aria-pressed':true,
                'tabindex': 0
            })
            .removeClass('disabled');

            toggleSubmitBtn();
        }
    });

    $('.dropAreaWrapper .dropArea, .dragContainer').on('click keyup', function (e) {
        const key = e.which || e.keyCode;
        if((key === 13 || key === 32) || e.type === "click"){
            if ($('.dragItem[aria-pressed=true]')) {
                if ($(this).children('.dragItem').length > 0) {
                    $('.dragItemsWrapper').append($(this).children('.dragItem:first'));
                }

                $(this).hasClass('dragContainer') ? $(this).find('.dragItemsWrapper').append($('#' + selectedButton)) : $(this).append($('#' + selectedButton));

                $('.dragItem')
                    .removeClass('disabled')
                    .attr({
                        'aria-disabled': false,
                        'tabindex': 0
                    });
                $('#' + selectedButton).focus();
                $('#' + selectedButton).attr({
                    'aria-pressed': false,
                    'aria-grabbed': false,
                    'draggable': true
                });

                toggleSubmitBtn();
                setLiveRegion($('#' + selectedButton).text() + ' dropped to ' + $(this).attr('aria-label'));

                selectedButton = null;
            }
        }
    });

    $(document).on('keyup', function (e) {
        if (e.key === 'Escape') {
            if ($('.dragItems[aria-pressed=true]')) {
                clearSelection();
                return;
            }
        }
    });

    $('.dragItemsWrapper .dragItem').on('dragstart', function(event) {
        event.originalEvent.dataTransfer.setData("text", event.target.id);
    });

    $('.dropAreaWrapper .dropArea').on('dragenter', function () {
        $(this).addClass('over');
    });

    $('.dropAreaWrapper .dropArea').on('dragleave dragend', function () {
        $(this).removeClass('over');
    });

    $('.dropAreaWrapper .dropArea, .dragContainer').on('dragover', function(event) {
        event.preventDefault();
    });

    $('.dropAreaWrapper .dropArea, .dragContainer').on('drop', function(event) {
        event.preventDefault();
        const data = event.originalEvent.dataTransfer.getData("text");

        if($(this).hasClass('dragContainer')) {
            $(this).find('.dragItemsWrapper').append($("#" + data));
        }
        else {
            $(this).append($("#" + data));
            if ($(this).children('.dragItem').length > 1) {
                $('.dragItemsWrapper').append($(this).children('.dragItem:first'));
            }
        }

        toggleSubmitBtn();
    });

    $('#submitBtn').on('click', function(){
        alert('Well done!');
    });

    function toggleSubmitBtn(){
        if($('.dragItemsWrapper .dragItem').length > 0) {
            $('#submitBtn').attr('disabled', true);
        }
        else {
            $('#submitBtn').removeAttr('disabled');
        }
    }
    
    function setLiveRegion(textToDisplay) {
        $('#liveRegion').html(textToDisplay);
    }

    function clearSelection() {
        $('.dragItem').attr({
            'aria-disabled': false,
            'draggable': true,
            'aria-grabbed':false,
            'aria-pressed':false,
            'tabindex': 0
        })
        .removeClass('disabled');
    
        document.getElementById(selectedButton).focus();
        setLiveRegion('Cancelled grabbing ' + $('#' + selectedButton).text());
    }
});

// function resetView() {
//     var planetsDiv = document.querySelector('div[ondrop]');
//     for (var i = 0; i < dragButtons.length; i++) {
//         planetsDiv.appendChild(dragButtons[i]);
//     }
//     setLiveRegion('Page has been Reset.');
//     if (document.querySelector('button[aria-pressed=true]')) {
//         for (var i = 0; i < dragButtons.length; i++) {
//             dragButtons[i].disabled = false;
//             dragButtons[i].setAttribute('draggable', 'true');
//         }

//         document.getElementById(selectedButton).setAttribute('aria-pressed', 'false');
//         return;
//     }

// }