import Vue from 'vue';
import axios from 'axios';
import md5 from 'md5';
import { modal } from 'vue-strap';
import 'css-toggle-switch/dist/toggle-switch.css';
import VueFileUpload from 'vue-upload-component';
import vSelect from 'vue-select';

import { runSmoothScrolling, parseHashString, checkPatterns } from '../shared/utils';
import DepositCardModal from '../shared/components/depositCardModal';
import storeInstance from '../frontend/store';
import headerApp from "./header";

const projectPostApp = new Vue({
    components: {
        FileUpload: VueFileUpload,
        vSelect,
        modal,
        DepositCardModal
    },
    data: {
        sharedState: storeInstance.state,
        isLoading: false,
        fields: {
            title: '',
            description: '',
            payment_type: '',
            currency: '',
            fixed_project_type: '',
            hourly_project_type: '',
            optionalUpgrade : '',
            selected_project_skill : '',
        },
        errors: {
            general: null,
            fields: {
                'title_required': '',
                'description': '',
                'skills' : '',
            },

        },
        warnings  :{
          'title' : '',
        },
        internalCheckedNames: [],
        skills: [],
        selectSkills : [],
        projectTypes : [],
        selectCurrency :[],
        selectSetProjectSkills :[],
        hourlyTypes: [],
        imagesLinks: {
            backgroundImageIcon: require('./assets/images/background.svg'),
            skillsSuggestionIcon: require('./assets/images/suggestions.svg'),
            advancedImageIcon: require('./assets/images/advanced.png'),
        },
        attachUploads: [],
        attachUploadEvents: {},
        show_skill_tooltip: false,
        attemptSubmit: false,
    },
    computed: {
        subAdvanced: {
            get: function () {
                return this.internalCheckedNames;
            },
            set: function (newVal) {
                this.internalCheckedNames = newVal;
            }
        },
        missingTitle: function () {  return !this.fields.title; },
        leastTitle : function ()  {
            if (this.fields.title && this.fields.title.length<= 10) {
                this.warnings.title = 'Please insert at least 10 characters';
                return true;
            }
            return false;
        },
        missingDescription: function() {return !this.fields.description; },
        leastDescription : function ()  {
            if (this.fields.description && this.fields.description.length<= 10) {
                this.warnings.description = 'Please insert at least 10 characters';
                return true;
            }
            return false;
        },
        missingSkills : function () {
            if(this.skills.length > 0) {
                return false;
            }else {
                return true;
            }

        },
     },
    mounted: function() {
        let fields = {
            payment_type : 'fixed',
            currency : 'usd',
            optionalUpgrade: 'standard',
            selected_project_skill : 'develop-an-app',
        };

        this.selectCurrency = [
            {id : 'usd', title: 'USD $'},
            {id : 'euro', title: 'EURO'},
        ];

        this.selectSetProjectSkills = [
            { id: 'build-me-a-website', title: 'Build me a website'},
            { id: 'develop-an-app', title: 'Develop an app'},
            { id: 'design-something', title: 'Design something'},
        ];
        this.hourlyTypes = [
            { id: 'entry', title: 'Entry'},
            { id: 'intermediate', title: 'Intermediate'},
            { id: 'expert', title: 'Expert'},
        ];

        this.projectTypes= [
            {id : '5', title: 'Micro project (5$-30$)'},
            {id : '30', title: 'Simple project (30$-250$)'},
        ];
        this.fields = fields;
    },
    methods: {
        onChangeOptionGroup: function(value){
            this.fields.optionalUpgrade = value;
        },
        onChangeAdvancedGroup: function(value) {
            if (this.internalCheckedNames.indexOf(value) >= 0) {
                this.internalCheckedNames.splice(this.internalCheckedNames.indexOf(value), 1);
            }else {
                this.internalCheckedNames.push(value);
            }
        },
        handleSaveClick: function(event){
            if (this.isLoading) {
                return;
            }
            if (!this.id) {
                this.sendCreateRequest(event);
                return;
            }

            this.sendUpdateRequest();
        },
        sendCreateRequest: function (event) {
            this.attemptSubmit = true;
            if (this.missingTitle || this.missingDescription || this.leastTitle || this.leastDescription || this.missingSkills ) {
                event.preventDefault();
                return false;
            }
            let data = {
                title: this.fields.title,
                description: this.fields.description,
                skills: this.skills,
                payment_type: this.fields.payment_type,
                option : this.fields.optionalUpgrade,
                currency: this.fields.currency,
                fixed_project_type: this.fields.fixed_project_type,
                hourly_project_type: this.fields.hourly_project_type,
                advanced_options : this.internalCheckedNames
            };
            console.log(data);
        },
    }
});

export default projectPostApp;