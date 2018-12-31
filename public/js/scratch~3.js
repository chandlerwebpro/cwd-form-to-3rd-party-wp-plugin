jQuery(document).ready(function(){

    document.cwd = {};

    var $ = jQuery,
        form_step = '1',
        cwd = document.cwd;

    // flag variable used in step 2 indicates that form has been submitted via ajax so when the button is clicked 
    // again later by js the event handle skips the ajax code and returns true
    var submit = false;

    function build_options(place_holder, options) {
        // options:[{name:'A NAME', value: 'A VALUE', isDefaultValue: true/false},...]
        var option_html = ["<option value='place_holder'>", place_holder, "</option>"];
        for(var i=0; i<options.length; i++) {
            option_html.push("<option value='");
            option_html.push(options[i].value);
            if(options[i].isDefaultValue) {
                option_html.push("' selected>");
            } else {
                option_html.push("'>");
            }
            option_html.push(options[i].value);
            option_html.push("</option>");
        }
        // for(var i=1; i<4; i++) {
        //     option_html.push("<option value='");
        //     option_html.push(i);
        //     option_html.push("'>");
        //     option_html.push(i);
        //     option_html.push("</option>");
        // }
        return option_html.join('');
    }
    
    function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    cwd['form_session'] = guid();

    cwd['steps'] = {
        step1: {
            greeting: 'To get an Insurance quote first enter you First and Last name',
            register: function(that) {
                let step1 = cwd.steps.step1;
                push_message(step1.greeting, 'reply');
                let fname_input = that.contentDocument.querySelector("input[name='fname']");
                if(fname_input !== null){
                    fname_input.onchange = function(){
                        let fname = fname_input.value;
                        step1.fname.validate(fname);
                    }
                }
                let lname_input = that.contentDocument.querySelector("input[name='lname']");
                if(lname_input !== null){
                    lname_input.onchange = function(){
                        let lname = lname_input.value;
                        console.log('lname changed !');
                        step1.lname.validate(lname);
                    }
                }
            },
            field_names: ['fname', 'lname'],
            fname: {
                validate: function(field_val) {
                    if(field_val == '') {
                        push_message('First name is required. Please enter your First Name', 'reply');
                    }else{
                        push_message(('My first name is ' + field_val), 'from');
                        cwd.steps.step1.fname.value = field_val;
                    }
                },
                value: ''
            },
            lname: {
                validate: function(field_val) {
                    if(field_val == '') {
                        push_message('Last name is required. Please enter your Last Name', 'reply');
                    }else{
                        push_message(('My last name is ' + field_val), 'from');
                        cwd.steps.step1.lname.value = field_val;
                    }
                },
                value: ''
            }
        },
        step2: {
            greeting: 'Now lets get your Email, Phone and Zip Code',
            register: function(that) {
                var submit_button = that.contentDocument.querySelector('input[type=submit]'),
                    step1 = cwd.steps.step1,
                    step2 = cwd.steps.step2;
                
                step2.ifrm = that;

                push_message(step2.greeting, 'reply');
                var email_input = that.contentDocument.querySelector("input[name='email']");
                if(email_input !== null){
                    email_input.onchange = function(){
                        let email = email_input.value;
                        console.log('email changed !');
                        step2.email.validate(email);
                    }
                }
                var phone_input = that.contentDocument.querySelector("input[name='phone']");
                if(phone_input !== null){
                    phone_input.onchange = function(){
                        let phone_num = phone_input.value;
                        console.log('phone changed !');
                        cwd.steps.step2.phone.validate(phone_num);
                    }
                }
                var zipcode_input = that.contentDocument.querySelector("input[name='zipcode']");
                if(zipcode_input !== null){
                    zipcode_input.onchange = function(){
                        let zipcode = zipcode_input.value;
                        console.log('zipcode changed !');
                        cwd.steps.step2.zipcode.validate(zipcode);
                    }
                }
                console.log(submit_button);
                $(submit_button).on('click', function(e){
                    console.log('The Clickening !');
                    if(submit){
                        submit = false;
                        return true;
                    }else{
                        e.preventDefault();
                        submit = true
                    }

                    var phone_type = $(document.getElementById('advanced_iframe').contentDocument).find('input[type=radio]:checked').val();
                    console.log('input[type=radio]:checked');
                    console.log(phone_type);
 
 
                    var currentTarget = e.target;
                    var form_data = {
                        form_session: cwd.form_session,
                        form_step: 'step2',
                        fname: step1.fname.value,
                        lname: step1.lname.value,
                        email: step2.email.value,
                        phone: step2.phone.value,
                        phone_type: phone_type,
                        zipcode: step2.zipcode.value, 
                    };

                    jQuery.ajax({
                        method: "POST",
                        url: '/b1/wp-content/plugins/cwd-form-to-3rd-party/ajax.php',
                        data: form_data, 
                        dataType: "text",
                        success: function (response) {
                            response = JSON.parse(response);
                            console.log('Ajax Success');
                            console.log(response);
                            // set step3: field values
                            cwd.steps.step3.prepare_step(response);

                            
                            $(currentTarget).click();
                        },
                        error: function(response) {
                            console.log('Ajax Error.');
                            console.log(response);
                        }
                    });
                });

                var phone_input = that.contentDocument.querySelector('input[name=phone]');
                $(phone_input).mask('(000) 000-0000');
                console.log('register for step2!');
            },
            field_names: ['email', 'phone', 'zipcode'],
            email: {
                validate: function(field_val) {
                    if(field_val == '') {
                        push_message('Email is required. Please enter your Email Address', 'reply');
                    }else{
                        push_message(('My Email Address is ' + field_val), 'from');
                        cwd.steps.step2.email.value = field_val;
                    }
                },
                value: ''
            },
            phone: {
                validate: function(field_val) {
                    if(field_val == '') {
                        push_message('A phone number is required. Please enter your Phone Number', 'reply');
                    }else{
                        push_message(('My phone number is ' + field_val), 'from');
                        cwd.steps.step2.phone.value = field_val;
                    }
                },
                value: ''
            },
            zipcode: {
                validate: function(field_val) {
                    if(field_val == '') {
                        push_message('A zip code is required. Please enter your Zip Code.', 'reply');
                    }else{
                        push_message(('My zip code is ' + field_val), 'from');
                        cwd.steps.step2.zipcode.value = field_val;
                    }
                },
                value: ''
            }
        },
        step3: {
            greeting: 'We also need your street address, county, and city.',
            register: function(that) { // "that" is an aliase for "this" in the contect of the iframe onload function
                var step3 = cwd.steps.step3,
                    submit_button = that.contentDocument.querySelector('input[type=submit]');

                step3['dropdown_county'] = that.contentDocument.querySelector("select[name='dropdown_county']");
                step3['dropdown_city'] = that.contentDocument.querySelector("select[name='dropdown_city']");
                var county_options_html = build_options('Select County', step3.county.scraped_json),
                    city_options_html = build_options('Select City', step3.city.scraped_json);
                $(step3.dropdown_county).html(county_options_html);
                $(step3.dropdown_city).html(city_options_html);

                push_message(step3.greeting, 'reply');
                var address_1 = that.contentDocument.querySelector("input[name='address_1']");
                if(address_1 !== null){
                    address_1.onchange = function(){
                        let address1 = address_1.value;
                        console.log('address_1 changed !');
                        step3.address1.validate(address1);
                    }
                }

                var address_2 = that.contentDocument.querySelector("input[name='address_2']");
                if(address_2 !== null){
                    address_2.onchange = function(){
                        let address2 = address_2.value;
                        console.log('address_2 changed !');
                        step3.address2.validate(address2);
                    }
                }

                var county = that.contentDocument.querySelector("select[name='dropdown_county']");
                console.log('county select object');
                console.log(that.contentDocument);
                console.log(county);
                if(county !== null){
                    county.onchange = function(){
                        let county_val = county.value;
                        console.log('county changed !');
                        step3.county.validate(county_val);
                    }
                }

                var city = that.contentDocument.querySelector("select[name='dropdown_city']");
                console.log('city select object');
                console.log(that.contentDocument);
                console.log(city);
                if(city !== null){
                    city.onchange = function(){
                        let city_val = city.value;
                        console.log('city changed !');
                        step3.city.validate(city_val);
                    }
                }

            },
            prepare_step: function(step3_form_state) {
                var step3 = cwd.steps.step3;
                step3.county.scraped_json = step3_form_state['counties'];
                step3.city.scraped_json = step3_form_state['cities'];
            },
            field_names: ['address1', 'address2', 'county', 'city'],
            address1: {
                validate: function(field_val) {
                    // validate
                    if(field_val == '') {
                        push_message('Address is required. Please enter your Address', 'reply');
                    }else{
                        push_message(('My Address is ' + field_val), 'from');
                        cwd.steps.step3.address1.value = field_val;
                    }
                },
                value: null
            },
            address2: {
                validate: function(field_val) {
                    // validate
                    if(field_val == '') {
                        // push_message('Address is required. Please enter your Address', 'reply');
                    }else{
                        push_message(('Address 2 is ' + field_val), 'from');
                        cwd.steps.step3.address2.value = field_val;
                    }
                },
                value: null
            },
            county: {
                validate: function(field_val) {
                    // validate
                    if(field_val == '') {
                        push_message('County is required. Please select your County.', 'reply');
                    }else{
                        push_message(('County is ' + field_val), 'from');
                        cwd.steps.step3.county.value = field_val;
                    }
                },
                scraped_json: null,
                value: null
            },
            city: {
                validate: function(field_val) {
                    // validate
                    if(field_val == '') {
                        push_message('City is required. Please select your City.', 'reply');
                    }else{
                        push_message(('City is ' + field_val), 'from');
                        cwd.steps.step3.county.value = field_val;
                    }
                },
                scraped_json: null,
                value: null
            },
        },
        step4: {
            greeting: 'Welcome to step4!',
            register: function(that) {
                step4['dropdown_region'] = that.contentDocument.querySelector("select[name='dropdown_region']");
                var region_options = build_options('Select Region', step4.region.scraped_json);
                $(step4.dropdown_region).html(region_options);

                push_message(step4.greeting, 'reply');
                step4.dropdown_region.onchange = function() {
                    let region = setp4.dropdown_region.value;
                    console.log('region changed');
                    step4.region.validate(region);
                }
            },
            prepare_step: function(step3_form_state) {
                var step4 = cwd.steps.step4;
                step4.region.scraped_json = step3_form_state['region'];
            },
            field_names: ['region'],
            region: {
                validate: function(field_val) {
                    if(field_val == '') {
                        push_message('Region is required. Please select your Region.', 'reply');
                    }else{
                        push_message(('Region is' + field_val), 'from');
                        cwd.steps.step4.region.value = field_val;
                    }
                },
                scraped_json: null,
                value: null
            }

        }
    };
        

    function push_message(message,  message_type){
        var $content = jQuery(screen_div),
            height = $content.height();
        var markup = Array("<div class=\"phone-message ", message_type, "\">",
        message, "</div>\n");
        $content.append(markup.join(""));
        $content.animate({scrollTop: height}, 500);
    }

    // insert sms div above phone
    var screen_div = document.createElement('div');
    screen_div.className = 'screen-div';
    screen_div.style.position = 'absolute';
    screen_div.style.width = "27%";
    screen_div.style.height = "44%";
    screen_div.style.left = "49.5%";
    screen_div.style.top = "4%";
    screen_div.style.background = 'white';
    screen_div.style.fontSize = '.875rem';
    screen_div.style.overflowX = 'hidden';
    screen_div.style.overflowY = 'scroll';
    screen_div.style.padding = '1.25rem';
    screen_div.style.paddingBottom = '5rem';
    screen_div.style.margin = '5.5rem 0 0 3.8125rem';
    var cwd_phone_widget = document.getElementById('cwd-phone-widget');
    console.log("cwd_phone_widget = ");
    console.log(cwd_phone_widget);
    // // var col_inner = jQuery(cwd_phone_widget).find('div.vc_column-inner');
    if(cwd_phone_widget !== null){
        cwd_phone_widget.appendChild(screen_div);
        // attach event handlers to form
        ifrm = document.getElementById('advanced_iframe');
        console.log(ifrm);
        if(ifrm !== null){
            ifrm.onload = function(){
                var form_url = this.contentWindow.location.href,
                    form_name_start = form_url.indexOf('contact-form/'),
                    form_name = form_url.slice(form_name_start,-1);

                if(form_name == 'contact-form/step-1'){
                    console.log('step1');
                    cwd.steps.step1.register(this); // register event handlers for this form
                }else if(form_name == 'contact-form/step-2'){
                    console.log('step 2');
                    cwd.steps.step2.register(this); // register event handlers for this form
                }else if(form_name == 'contact-form/step-3'){
                    console.log('step 3');
                    console.log(cwd.steps.step3.county);
                    console.log(cwd.steps.step3.city);
                    cwd.steps.step3.register(this); // register event handlers for this form
                }else if(form_name == 'contact-form/step-4'){
                    cwd.steps.step4.register(this);
                }
            }
        }

    }

});

