
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
        JupyterEvents.OpenNotebookEvent = OpenNotebookEvent;
        JupyterEvents.BeginExecuteCellEvent = BeginExecuteCellEvent;
        JupyterEvents.FinishExecuteCellEvent = FinishExecuteCellEvent;
        JupyterEvents.SaveNotebookEvent = SaveNotebookEvent;
        JupyterEvents.ShowHintEvent = ShowHintEvent;
        JupyterEvents.ChangeCellsInViewEvent = ChangeCellsInViewEvent;
        // JupyterEvents.SrlDisplayHintPromptEvent = SrlDisplayHintPromptEvent;
        // JupyterEvents.SrlDisplayHintAnswerEvent = SrlDisplayHintAnswerEvent;
        // JupyterEvents.SrlClickNextEvent = SrlClickNextEvent;
        JupyterEvents.SrlAssignConditionEvent = SrlAssignConditionEvent;
        JupyterEvents.SrlHintUserResponseEvent = SrlHintUserResponseEvent;
        JupyterEvents.SrlOpenHintListEvent = SrlOpenHintListEvent;
        JupyterEvents.SrlHintChosenEvent = SrlHintChosenEvent;
        JupyterEvents.SrlOpenHintPromptEvent = SrlOpenHintPromptEvent;
        JupyterEvents.SrlOpenHintAnswerEvent = SrlOpenHintAnswerEvent;      ];
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
