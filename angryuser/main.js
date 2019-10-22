require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.17.1/min/vs' }});

// Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
// the default worker url location (used when creating WebWorkers). The problem here is that
// HTML5 does not allow cross-domain web workers, so we need to proxy the instantiation of
// a web worker through a same-domain script
window.MonacoEnvironment = {
  getWorkerUrl: function(workerId, label) {
    return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
      self.MonacoEnvironment = {
        baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.17.1/min/'
      };
      importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.17.1/min/vs/base/worker/workerMain.js');`
    )}`;
  }
};


if (!navigator.clipboard || !navigator.clipboard.readText) {
  document.getElementById("paste-1").hidden = true
  document.getElementById("paste-2").hidden = true
}

require(["vs/editor/editor.main"], function () {
  // ...

  var localValue = localStorage.getItem("editor1Json")
  var defaultValue = '{ "stuff": { "that": [1,3,5], "isin": false, "json": "end"}}'
  var finalValue = localValue ? localValue : defaultValue
  var editor1 = monaco.editor.create(document.getElementById('editor1'), {
    value: [
      finalValue,
    ].join('\n'),
    language: 'json',
    tabSize: 2,
    fontSize: 12,
    formatOnPaste: true,
    formatOnLoad: true,
    minimap: {enabled: false}
  });



  document.getElementById("format-edit-1").addEventListener("click", formatJson1)
  function formatJson1() {
    var jsonString = validateJson(editor1.getValue())
    editor1.setValue(jsonString)
    editor1.getAction("editor.action.formatDocument").run()
    localStorage.setItem("editor1Json",editor1.getValue())
  }

  function validateJson(json){
    var tempRes = json.replace("msg=\"", "message");
    var res = tempRes.replace("https://", "www.");
    return res

  }

  document.getElementById("font-zoom-in").addEventListener("click", fontZoomIn)
  function fontZoomIn() {
    editor1.getAction("editor.action.fontZoomIn").run()
  }

  document.getElementById("font-zoom-out").addEventListener("click", fontZoomOut)
  function fontZoomOut() {
    editor1.getAction("editor.action.fontZoomOut").run()
  }

  document.getElementById("font-zoom-reset").addEventListener("click", fontZoomReset)
  function fontZoomReset() {
    editor1.getAction("editor.action.fontZoomReset").run()
  }

  document.getElementById("paste-1").addEventListener("click", paste1)
  function paste1() {
    navigator.clipboard.readText().then(
      clipText => {
        var jsonString = validateJson(clipText)
        editor1.setValue(jsonString)
        editor1.getAction("editor.action.formatDocument").run()
        localStorage.setItem("editor1Json",editor1.getValue())
      }
    )
  }

  document.getElementById("copy-1").addEventListener("click", copyToClipboard)
  function copyToClipboard() {
    var copyText = editor1.getValue();
    navigator.clipboard.writeText(copyText)
    document.execCommand("copy");
  }

  document.getElementById("minify-1").addEventListener("click", minify1)
  function minify1() {
    const newText = JSON.stringify(JSON.parse(editor1.getValue()), null, 0)
    editor1.setValue(newText)
  }

  document.getElementById("clear-1").addEventListener("click", clear1)
  function clear1() {
    editor1.setValue('')
    localStorage.removeItem("editor1Json")
  }


  function layout() {
    var GLOBAL_PADDING = 20

    var WIDTH = window.innerWidth - 2 * GLOBAL_PADDING
    var HEIGHT = window.innerHeight

    var TITLE_HEIGHT = 36 + 5 + 15
    var FOOTER_HEIGHT = 10
    var TABS_HEIGHT = 20 + 2 + 2
    var INNER_PADDING = 0

    var HALF_WIDTH = Math.floor((WIDTH - INNER_PADDING) / 2)
    var REMAINING_HEIGHT = HEIGHT - TITLE_HEIGHT - FOOTER_HEIGHT - TABS_HEIGHT - FOOTER_HEIGHT

    document.getElementById('editor1').style.width = WIDTH + 'px'

    document.getElementById('editor1').style.height = REMAINING_HEIGHT + 'px'

    if (editor1) {
      editor1.layout({
        width: WIDTH,
        height: REMAINING_HEIGHT
      })
    }
  }

  layout()
  window.onresize = layout
});
