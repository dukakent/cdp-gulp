import '../../bower_components/bootstrap/dist/js/bootstrap.min.js';
import '../../bower_components/bootstrap/less/bootstrap.less';
import '../css/all.css';
import '../less/all.less';

import stringUpdater from '../../node_modules/jsmp-infra-dukakent/src/stringUpdater.js';

(function () {

    var button = $('[data-target="#myModal"]');

    button.click(onButtonClick);

    function onButtonClick(e) {
        console.log(stringUpdater('I have a pen, ', 'push', 'I have an apple'));
    }

})();