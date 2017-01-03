/* global $ */
/* eslint-disable wrap-iife */

import '../../bower_components/bootstrap/dist/js/bootstrap.min';
import '../../bower_components/bootstrap/less/bootstrap.less';
import '../css/all.css';
import '../less/all.less';

import stringUpdater from '../../node_modules/jsmp-infra-dukakent/src/stringUpdater';

(function () {
  const button = $('[data-target="#myModal"]');

  function onButtonClick() {
    console.log(stringUpdater('I have a pen, ', 'push', 'I have an apple'));
  }

  button.click(onButtonClick);
})();
