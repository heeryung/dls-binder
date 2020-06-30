
define([
    'jquery',
    'require',
    'base/js/namespace',
    'base/js/i18n',
    'nbextensions/jupyterlogger',
    'nbextensions/jupyterevents'
  ], function ($,
               require,
               Jupyter,
               i18n,
               jupyterLogger,
               JupyterEvents
               ) {
    'use strict';

function load_ipython_extension(){
    var logger = jupyterLogger.log;

    function setupJupyterEventListeners(logger) {
      var logRecord = function(event) {
        logger.info(event.detail);
      };
      var jupyterEventsToLog = [
        JupyterEvents.OpenNotebookEvent,
        JupyterEvents.BeginExecuteCellEvent,
        JupyterEvents.FinishExecuteCellEvent,
        JupyterEvents.SaveNotebookEvent,
        JupyterEvents.ShowHintEvent,
        JupyterEvents.ChangeCellsInViewEvent,
        // JupyterEvents.SrlDisplayHintPromptEvent = SrlDisplayHintPromptEvent;
        // JupyterEvents.SrlDisplayHintAnswerEvent = SrlDisplayHintAnswerEvent;
        // JupyterEvents.SrlClickNextEvent = SrlClickNextEvent;
        JupyterEvents.SrlAssignConditionEvent,
        JupyterEvents.SrlHintUserResponseEvent,
        JupyterEvents.SrlOpenHintListEvent,
        JupyterEvents.SrlHintChosenEvent,
        JupyterEvents.SrlOpenHintPromptEvent,
        JupyterEvents.SrlOpenHintAnswerEvent
    ];
      jupyterEventsToLog.forEach(function(jupyterEvent, index) {
        document.addEventListener(jupyterEvent.name, logRecord, false);
        var boundJupyterEvent = new jupyterEvent();
      });
    }
    setupJupyterEventListeners(logger);
	}

	return {
		load_ipython_extension: load_ipython_extension
	};
});
