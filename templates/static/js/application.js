$(document).ready(function() {

    console.log('start Application')

    // закрытии модального окна
    $(document).on('click', '.modal_close_window', function (e) {
        $(this).parent().parent().parent().parent().hide()
    })

    //    Открытие окна добавление человека
    $(document).on('click', '.person', function () {
        // Список доступных стран городов
        console.log('start click person')
        let url = 'https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json';
        let country_dict;
        let sity_dict;
        let birthplace_country_select = document.getElementById('birthplace_country_select');
        let birthplace_sity_select = document.getElementById('birthplace_sity_select');
        $("#birthplace_country_select").empty();  // Очистка при повторном открытии окна
        $("#birthplace_sity_select").empty();

        $.ajax({
	       type: 'GET',
	       url: url,
           async: false,
	       processData: false,  // tell jQuery not to process the data
           contentType: false,  // tell jQuery not to set contentType
	       success: function(data, status){
                 country_dict =  JSON.parse(data)
	       }
	    });
        //	    Заполнить список стран
        Object.entries(country_dict).forEach(([key, value]) => {
            let opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = key;
            birthplace_country_select.appendChild(opt);
        });
        sity_dict = country_dict["Russia"]
        for (let i = 0; i < sity_dict.length; i++) {
            let opt = document.createElement('option');
            opt.value = sity_dict[i];
            opt.innerHTML = sity_dict[i];
            birthplace_sity_select.appendChild(opt);
        }
        //        Сделать Russia активной по умолчанию
        $('option[value="Russia"]').attr('selected', 'selected').parent().focus();
        $('option[value="Perm"]').attr('selected', 'selected').parent().focus();
        //        Открыть модальное окно
        $('#Person_modal').toggle();
    })

    // Действие при нажатии на кнопку в окне создания человека
    $(document).on('click', '#person_ok_window', function () {
        let family = $($('#Person_modal').find('.person_family')[0]).val()
        let name = $($('#Person_modal').find('.person_name')[0]).val()
        let midlename = $($('#Person_midlename').find('.person_midlename')[0]).val()
        let gender = $('#person_gender').find(":selected").val()
        let country = $('#birthplace_country_select').find(":selected").val();
        let sity = $('#birthplace_sity_select').find(":selected").val();

        let json_table = {
            'family': family,
            'name': name,
            'gender': gender,
            'midlename': midlename,
            'position': {
                'country': country,
                'sity': sity,
            },
        }
        console.log(JSON.stringify(json_table))
        $.ajax({
	      headers: {
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