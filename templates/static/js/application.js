$(document).ready(function() {

    console.log('start Application')

    // закрытии модального окна
    $(document).on('click', '.modal_close_window', function (e) {
        $(this).parent().parent().parent().parent().hide()
    })

    $(document).on('click', '.person', function () {
        console.log('click person')
        $('#Person_modal').toggle();
    })

    $(document).on('click', '#person_ok_window', function () {
        let family = $($('#Person_modal').find('.person_family')[0]).val()
        let name = $($('#Person_modal').find('.person_name')[0]).val()
        let midlename = $($('#Person_midlename').find('.person_midlename')[0]).val()
        let gender = $('#person_gender').find(":selected").val()

        let json_table = {
            'family': family,
            'name': name,
            'gender': gender,
            'midlename': midlename,
            'position': {},
}
        $.ajax({
	      headers: {
//	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
//	        "Authorization": "Basic " + btoa('alexander' + ":" + '123')
	      },
	      type: 'POST',
	      url: '/person',
	      data: JSON.stringify(json_table),
	       dataType: 'json',
	      success: function(data, status){
                $('#Person_modal').toggle();
	      }
	    });

    })

})