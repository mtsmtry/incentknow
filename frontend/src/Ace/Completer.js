"use strict";

exports.setCompletersImpl = function (comps, editor) {
  return function () {
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });
    editor.completers = comps;
  };
};