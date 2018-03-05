import Vue from 'vue';
import axios from 'axios';
import { directive as onClickOutside } from 'vue-on-click-outside';
import storeInstance from '../frontend/store';
import { formatTimespanFromNow, prepareNotification, parseQueryString } from '../shared/utils';


const projectHeaderApp = new Vue({
    directives: {
        onClickOutside
    },
    data: {
        sharedState: storeInstance.state,
    },
    mounted: function() {

    },
    methods: {

    }
});


export default projectHeaderApp;