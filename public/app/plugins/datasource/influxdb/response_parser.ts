///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';

export default class ResponseParser {

  parse(query, results) {
    if (!results || results.results.length === 0) { return []; }

    var influxResults = results.results[0];
    if (!influxResults.series) {
      return [];
    }
    var qlower = query.toLowerCase();
    var influxdb11format = qlower.indexOf('show tag values') >= 0;
    var field_and_tags = (qlower.indexOf('show field keys') >= 0 &&
                          qlower.indexOf('show tag keys') >= 0);
    if (field_and_tags) {
      influxResults.series = influxResults.series.concat(results.results[1].series);
    }

    var res = {};
    _.each(influxResults.series, serie => {
      _.each(serie.values, value => {
        if (_.isArray(value)) {
          if (influxdb11format) {
            addUnique(res, value[1] || value[0]);
          } else {
            addUnique(res, value[0]);
          }
        } else {
          addUnique(res, value);
        }
      });
    });

    return _.map(res, value => {
      return { text: value};
    });
  }
}

function addUnique(arr, value) {
  arr[value] = value;
}
