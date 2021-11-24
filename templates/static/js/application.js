$(document).ready(function() {

    function get_countries(){
        let url = 'https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json';
        let country_dict;
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
	    return country_dict;
    }

    function get_person(data){
        let url = '/person';
        let person_dict;
        $.ajax({
	       type: 'GET',
	       url: url,
	       headers: {Authorization: 'Bearer ' + readCookie('jwt')},
	       data: jQuery.param(data) ,
           async: false,
	       processData: false,  // tell jQuery not to process the data
           contentType: false,  // tell jQuery not to set contentType
	       success: function(data, status){
                 person_dict =  data
	       }
	    });
	    return person_dict;
    }

    function get_position(){
        let url = '/position';
        let position_dict;
        $.ajax({
	       type: 'GET',
	       url: url,
	       headers: {Authorization: 'Bearer ' + readCookie('jwt')},
           async: false,
	       processData: false,  // tell jQuery not to process the data
           contentType: false,  // tell jQuery not to set contentType
	       success: function(data, status){
                 position_dict =  data
	       }
	    });
	    return position_dict;
    }


    function get_all_person_in_base(){
        if (document.location.pathname == '/'){
            $("#table_all_person_in_base").empty();
            let persons = get_person({})
            if (!!persons){
                for (let i = 0; i < persons.length; i++) {
                    let person = persons[i];
                    let tr = document.createElement('tr');
                    tr.setAttribute('data-toggle', 'modal');
                    let td1 = document.createElement('td');
                    td1.innerHTML = person['family'];
                    tr.appendChild(td1);
                    let td2 = document.createElement('td');
                    td2.innerHTML = person['name'];
                    tr.appendChild(td2);
                    let td3 = document.createElement('td');
                    td3.innerHTML = person['middle_name'];
                    tr.appendChild(td3);
                    let td4 = document.createElement('td');
                    td4.innerHTML = person['gender'];
                    tr.appendChild(td4)
                    let td5 = document.createElement('td');
                    td5.innerHTML = person['position']['country'] + ', ' + person['position']['sity'];
                    tr.appendChild(td5)
                    let td6 = document.createElement('td');
                    td6.innerHTML = person['birth_date'];
                    tr.appendChild(td6)
                    let td7 = document.createElement('td');
                    td7.innerHTML = person['information'];
                    tr.appendChild(td7)
                    document.getElementById("table_all_person_in_base").appendChild(tr);
                }
            }
        }
    }

    get_all_person_in_base()

    // получения значения печеньки по имени
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    // Очистка полей Фамилии, имени, отчества
    function clear_fields(){
        $($('#Person_modal').find('.person_family')[0]).val('')
        $($('#Person_modal').find('.person_name')[0]).val('')
        $($('#Person_modal').find('.person_midlename')[0]).val('')
    }

    // Войти
    $(document).on('click', '#registration_in', function (e) {
        let data =  {
            "username": $('#registration_login').val(),
            "password": $('#registration_password').val()
        }
        let url = '/api/token/';
        $.ajax({
	       type: 'POST',
	       url: url,
	       data: jQuery.param(data) ,
           async: false,
//	       processData: false,  // tell jQuery not to process the data
//           contentType: false,  // tell jQuery not to set contentType
	       success: function(data, status){
               document.cookie = 'jwt=' + data['access'];
               get_all_person_in_base();
	       }
	    });
    })

    // закрытии модального окна
    $(document).on('click', '.modal_close_window', function (e) {
        $(this).parent().parent().parent().parent().hide()
    })

    $(document).on('click', '#create_tree', function (e) {
        window.open('tree')
    })

    $(document).on('click', '#to_email', function (e) {
        let url = '/send_peoples';
        $.ajax({
	       type: 'GET',
	       url: url,
	       headers: {Authorization: 'Bearer ' + readCookie('jwt')},
           async: true,
	       processData: false,  // tell jQuery not to process the data
           contentType: false,  // tell jQuery not to set contentType
	       success: function(data, status){
                 console.log('send email')
	       }
	    });
    })

    // Удаление человека из базы
    $(document).on('click', '#person_delete_window', function (e) {
        let select_person_id = $('#find_peoples').find(":selected").val()
        let url = '/person/' + select_person_id;
        $.ajax({
	       type: 'DELETE',
	       url: url,
	       headers: {Authorization: 'Bearer ' + readCookie('jwt')},
           async: false,
	       processData: false,  // tell jQuery not to process the data
           contentType: false,  // tell jQuery not to set contentType
	       success: function(data, status){
                 console.log('has delete')
	       }
	    });
        clear_fields();  // Очистка полей Фамилии, имени, отчества
        get_all_person_in_base() // Перерисовка таблицы
    })

    // Клик по выбранному человеку
    $(document).on('change', '#find_peoples', function (e) {
        let select_person_id = $(this).find(":selected").val()
        let select_person = get_person({'id': select_person_id})[0]
        let gender = select_person['gender']
        $($('#Person_modal').find('.person_family')[0]).val(select_person['family'])
        $($('#Person_modal').find('.person_name')[0]).val(select_person['name'])
        $($('#Person_modal').find('.person_midlename')[0]).val(select_person['midlename'])
        $($('#Person_modal').find('#person_gender option[value=' + gender + ']')[0]).attr('selected','selected');
    })

    //    Открытие окна добавление человека
    $(document).on('click', '.person', function () {
        clear_fields();  // Очистка полей Фамилии, имени, отчеств
        // Если это редактирование или удаление нужен блок поиска, инеча его нужно скрыть
        if ($(this).hasClass('add'))
            $('.search_people_area').hide()
        else
            $('.search_people_area').show()
        // Список доступных стран городов
        let country_dict = get_countries();
        let sity_dict;
        let birthplace_country_select = document.getElementById('birthplace_country_select');
        let birthplace_sity_select = document.getElementById('birthplace_sity_select');
        let person_father_select = document.getElementById('person_father_select');
        let person_mother_select = document.getElementById('person_mother_select');
        let person_current_spouse_select = document.getElementById('person_current_spouse_select');
        // Очистка при повторном открытии окна
        $("#birthplace_country_select").empty();
        $("#birthplace_sity_select").empty();
        $("#person_father_select").empty();
        let opt = document.createElement('option');
        opt.value = -1;
        opt.innerHTML = 'Unknown';
        person_father_select.appendChild(opt);
        $("#person_mother_select").empty();
        let opt1 = document.createElement('option');
        opt1.value = -1;
        opt1.innerHTML = 'Unknown';
        person_mother_select.appendChild(opt1);
        let opt2 = document.createElement('option');
        opt2.value = -1;
        opt2.innerHTML = 'Unknown';
        person_current_spouse_select.appendChild(opt2);
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
        // Люди мужского пола
        let mans = get_person({'gender': 'M'})
        for (let i = 0; i < mans.length; i++) {
            let opt = document.createElement('option');
            opt.value = mans[i]['id'];
            opt.innerHTML = mans[i]['family'] + ' ' + mans[i]['name'];
            person_father_select.appendChild(opt);
        }
        // Люди женского пола
        let womens = get_person({'gender': 'F'})
        for (let i = 0; i < womens.length; i++) {
            let opt = document.createElement('option');
            opt.value = womens[i]['id'];
            opt.innerHTML = womens[i]['family'] + ' ' + womens[i]['name'];
            person_mother_select.appendChild(opt);
        }
        // Все Люди
        let peoples = get_person({})
        for (let i = 0; i < peoples.length; i++) {
            let opt = document.createElement('option');
            opt.value = peoples[i]['id'];
            opt.innerHTML = peoples[i]['family'] + ' ' + peoples[i]['name'];
            person_current_spouse_select.appendChild(opt);
        }
        //        Открыть модальное окно
        if ($(this).hasClass('update'))
            $('#person_ok_window').addClass('update')
        $('#Person_modal').toggle();
    })

    // Действие при нажатии на кнопку в окне создания человека
    $(document).on('click', '#person_ok_window', function () {
        let family = $($('#Person_modal').find('.person_family')[0]).val()
        let name = $($('#Person_modal').find('.person_name')[0]).val()
        let midlename = $($('#Person_modal').find('.person_midlename')[0]).val()
        let gender = $('#person_gender').find(":selected").val()
        let country = $('#birthplace_country_select').find(":selected").val();
        let sity = $('#birthplace_sity_select').find(":selected").val();
        let father_id = $('#person_father_select').find(":selected").val();
        if (!!!father_id)
            father_id = '-1'
        let mother_id = $('#person_mother_select').find(":selected").val();
        if (!!!mother_id)
            mother_id = '-1'
        let spouse_id = $('#person_current_spouse_select').find(":selected").val();
        if (!!!spouse_id)
            spouse_id = '-1'
        let json_table = {
            'family': family,
            'name': name,
            'gender': gender,
            'middle_name': midlename,
            "mother_num": mother_id,
            "father_num": father_id,
            "spouse_num": spouse_id,
            'position': {'country': country,
                         'sity': sity,
                         },
        }
        if ($(this).hasClass('update')){
            let select_person_id = $('#find_peoples').find(":selected").val()
            if (!!select_person_id) {
                $.ajax({
                  headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + readCookie('jwt'),
                  },
                  type: 'PUT',
                  url: '/person/' + select_person_id,

                  data: JSON.stringify(json_table),
                   dataType: 'json',
                  success: function(data, status){
                        get_all_person_in_base() // Перерисовка таблицы
                        $('#Person_modal').toggle();
                  }
                });
            }
        }
        else{
            console.log('Add')
            $.ajax({
              headers: {
                'Content-Type': 'application/json',
    //	        "Authorization": "Basic " + btoa('alexander' + ":" + '123')
                'Authorization': 'Bearer ' + readCookie('jwt'),
              },
              type: 'POST',
              url: '/person',
              data: JSON.stringify(json_table),
               dataType: 'json',
              success: function(data, status){
                    get_all_person_in_base() // Перерисовка таблицы
                    $('#Person_modal').toggle();
              }
            });
        }
    })

    // Поиск людей
    $(document).on('click', '#find_peoples_button', function (e) {
        $("#find_peoples").empty();
        let fined_peoples = document.getElementById('find_peoples');
        let family = $($('#Person_modal').find('.person_family')[0]).val()
        let name = $($('#Person_modal').find('.person_name')[0]).val()
        let midlename = $($('#Person_midlename').find('.person_midlename')[0]).val()
        let gender = $('#person_gender').find(":selected").val()
        let country = $('#birthplace_country_select').find(":selected").val();
        let sity = $('#birthplace_sity_select').find(":selected").val();
        let data = {}
        if (!family == '')
            data['family'] = family
        if (!name == '')
            data['name'] = name
        if (!midlename == '')
            data['middle_name'] = midlename
        if (!gender == '')
            data['gender'] = gender
        let peoples = get_person(data)
        for (let i = 0; i < peoples.length; i++) {
            let opt = document.createElement('option');
            opt.setAttribute('class',  'find_one_person_select');
            opt.value = peoples[i]['id'];
            opt.innerHTML = peoples[i]['family'] + ' ' + peoples[i]['name'];
            fined_peoples.appendChild(opt);
        }
    })

    //    Открытие окна списка мест
    $(document).on('click', '.sity', function () {
        let positions = get_position();
        $("#Position_modal_table").empty();
        for (let i = 0; i < positions.length; i++) {
            let position = positions[i];
            let tr = document.createElement('tr');
            tr.setAttribute('data-toggle', 'modal');
//            tr.setAttribute('class', 'battery_row modal-trigger error-message table-message')
            tr.setAttribute('position_id', position['id'])
            let td1 = document.createElement('td');
            td1.innerHTML = position['country'];
            tr.appendChild(td1);
            let td2 = document.createElement('td');
            td2.innerHTML = position['sity'];
            tr.appendChild(td2);
            let td3 = document.createElement('td');
            td3.innerHTML = '0';
            tr.appendChild(td3);
            document.getElementById("Position_modal_table").appendChild(tr);
        }
        $('#Position_modal').toggle();
    })

})