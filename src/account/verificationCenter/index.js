import Vue from 'vue';
import axios from 'axios';
import FileUpload from 'vue-upload-component';
import storeInstance from '../../frontend/store';
import './style.scss';

Number.range = function() {
  var start, end, step;
  var array = [];

  switch(arguments.length){
    case 0:
      throw new Error('range() expected at least 1 argument, got 0 - must be specified as [start,] stop[, step]');
      return array;
    case 1:
      start = 0;
      end = Math.floor(arguments[0]) - 1;
      step = 1;
      break;
    case 2:
    case 3:
    default:
      start = Math.floor(arguments[0]);
      end = Math.floor(arguments[1]) - 1;
      var s = arguments[2];
      if (typeof s === 'undefined'){
        s = 1;
      }
      step = Math.floor(s) || (function(){ throw new Error('range() step argument must not be zero'); })();
      break;
   }

  if (step > 0){
    for (var i = start; i <= end; i += step){
      array.push(i);
    }
  } else if (step < 0) {
    step = -step;
    if (start > end){
      for (var i = start; i > end + 1; i -= step){
        array.push(i);
      }
    }
  }
  return array;
}


if (document.getElementById('sm-account-verification-center')) {
    if (window.SM_BOOTSTRAP_DATA) {
        // Bootstrap data as it's a separate bundle
        storeInstance.bootstrap(window.SM_BOOTSTRAP_DATA);
    }

    var init_with_page = 0;

    if (window.localStorage.getItem('verification_page') !== null) {
        init_with_page = parseInt(window.localStorage.getItem('verification_page'));
    }

    new Vue({
        el: '#sm-account-verification-center',
        components: {
            FileUpload
        },
        data: function() {
            var data =  {
                page: init_with_page,  // use setPage to change

                country: window.INITIAL_VERIFICATION.country_code,
                countryName: window.INITIAL_VERIFICATION.country_code,
                countries: [
                    ['', 'Loading...'],
                ],

                first_name: window.INITIAL_VERIFICATION.first_name,
                last_name: window.INITIAL_VERIFICATION.last_name,
                birth_date: { year : "", month: "", day: "" },  // init state sets later in this function
                id_issue_country: window.INITIAL_VERIFICATION.id_issuing_country,
                id_type: window.INITIAL_VERIFICATION.id_type,
                id_number: window.INITIAL_VERIFICATION.id_number,
                id_expired_on: { year : "", month: "", day: "" },  // init state sets later in this function
                address1: window.INITIAL_VERIFICATION.address_line_1,
                address2: window.INITIAL_VERIFICATION.address_line_2,
                city: window.INITIAL_VERIFICATION.city,
                state: window.INITIAL_VERIFICATION.country_state,
                postal_code: window.INITIAL_VERIFICATION.postal_code,
                institutions_name: window.INITIAL_VERIFICATION.institution_name,
                document_type: window.INITIAL_VERIFICATION.document_type,
                document_issued: { year : "", month: "", day: "" },  // init state sets later in this function

                // Image upload
                uploadFiles1: [],
                uploadFiles2: [],
                uploadFiles3: [],
                
                uploadEvents: {},

                uploadError: null,

                error_placement_0: '',
                error_placement_1: '',
                error_placement_2: '',
                error_placement_3: '',
                
                // Const
                available_day: Number.range(1, 32),
                available_month: Number.range(1, 13),
                available_year_before: Number.range(new Date().getFullYear()-90, new Date().getFullYear()),
                available_year_after: Number.range(new Date().getFullYear(), new Date().getFullYear()+50),
            };

            // init dates
            // birthdate
            if (window.INITIAL_VERIFICATION.birthdate !== null) {
                let birthdate = new Date(window.INITIAL_VERIFICATION.birthdate);
                data.birth_date.year = birthdate.getFullYear();
                data.birth_date.month = birthdate.getMonth()+1;
                data.birth_date.day = birthdate.getDate();
            }
            // id_expired_on
            if (window.INITIAL_VERIFICATION.id_expire_date !== null) {
                let id_expired_on = new Date(window.INITIAL_VERIFICATION.id_expire_date);
                data.id_expired_on.year = id_expired_on.getFullYear();
                data.id_expired_on.month = id_expired_on.getMonth()+1;
                data.id_expired_on.day = id_expired_on.getDate();
            }
            // document_issued
            if (window.INITIAL_VERIFICATION.document_date_issued !== null) {
                let document_issued = new Date(window.INITIAL_VERIFICATION.document_date_issued);
                data.document_issued.year = document_issued.getFullYear();
                data.document_issued.month = document_issued.getMonth()+1;
                data.document_issued.day = document_issued.getDate();
            }


            return data;
        },
        mounted: function() {
            this.uploadEvents = {
                add: this.handleUploadAdd.bind(this),
            };
            this.loadCountries();
        },
        methods: {
            loadCountries: function() {
                axios.get('/verification/countrys.json')
                    .then(res => {
                        this.countries = res.data;
                    })
            },
            setPage: function(new_page) {
                this.page = new_page;
                localStorage.setItem('verification_page', this.page);
            },
            getFormData: function() {
                let data = new FormData();

                // page 0
                data.append('country_code', this.country);

                // page 1
                data.append('first_name', this.first_name);
                data.append('last_name', this.last_name);
                data.append('birthdate', this.birth_date.year+'-'+this.birth_date.month+'-'+this.birth_date.day);
                data.append('id_number', this.id_number);
                data.append('id_type', this.id_type);
                data.append('id_issuing_country', this.id_issue_country);
                data.append('id_expire_date', this.id_expired_on.year+'-'+this.id_expired_on.month+'-'+this.id_expired_on.day);

                // page 3
                data.append('address_line_1', this.address1);
                data.append('address_line_2', this.address2);
                data.append('city', this.city);
                data.append('country_state', this.state);
                data.append('postal_code', this.postal_code);
                data.append('institution_name', this.institutions_name);
                data.append('document_type', this.document_type);
                data.append('document_date_issued', this.document_issued.year+'-'+this.document_issued.month+'-'+this.document_issued.day);

                return data
            },
            completeStep_0: function() {
                let data = this.getFormData();

                axios.post('/verification/step/0', data, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(res => {
                        this.setPage(this.page+1)
                    })
                    .catch(res => {
                        console.error('Request details:', res);
                        this.error_placement_0 = res.response.data.error.message;
                    });
            },
            completeStep_1: function() {
                let data = this.getFormData();
                
                axios.post('/verification/step/1', data, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(res => {
                        this.setPage(this.page+1)
                    })
                    .catch(res => {
                        console.error('Request details:', res);
                    });
            },
            completeStep_2: function() {
                let data = this.getFormData();
                
                this.setPage(this.page+1)
            },
            completeStep_3: function() {
                let data = this.getFormData();
                
                axios.post('/verification/step/3', data, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(res => {
                        this.setPage(this.page+1)
                    })
                    .catch(res => {
                        console.error('Request details:', res);
                    });
            },
            // uploads
            handleUploadAdd: function(file, component) {
                console.log('handleUploadAdd1');
                var reader = new FileReader();
                reader.onload = function (e) {
                    file.previewValue = 'url('+e.target.result+')';
                };
                reader.readAsDataURL(file.file);
                component.active = true;
            },
          

            // others
            goToDashboard: function() {
                location.href="/dashboard";
            },
        },
    });
}