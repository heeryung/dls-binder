define([
    'jquery',
    'require',
    'base/js/namespace',
    'base/js/dialog',
    'base/js/i18n',
    'nbextensions/showdown',
    'nbextensions/url',
    'nbextensions/username',
    'nbextensions/external/seedrandom'
], function ($,
             require,
             Jupyter,
             dialog,
             i18n,
             showdown,
             getUrl,
             getUsername,
             seedrandom) {
    var username = getUsername.getUsernameForConfig();
    var questionId = Jupyter.notebook.get_cell(0).metadata.question_id;
    Math.seedrandom(username + questionId);
    var type_1_questions = new Array();  //Type 1 (reflection-before)
    type_1_questions.push("What are you hoping to get help with?");
    type_1_questions.push("Can you explain where you get stuck?");
    type_1_questions.push("What are you confused about right now?");
    type_1_questions.push("What part of the problem or task presents the challenge?");
    type_1_questions.push("What question do you wish you could ask now?");
    type_1_questions.push("What piece of information are you missing at the moment?");
    type_1_questions.push("What do you think the problem is asking you to do?");
    type_1_questions.push("Why is your current direction the right way to solve the task?");
    type_1_questions.push("How well is your current approach to this problem working?");

    var type_2_questions = new Array(); //Type 2 (planning-before)
    type_2_questions.push("What is the step you need to take next?");
    type_2_questions.push("What is your plan for solving the task if the hint helps you with the present obstacle?");
    type_2_questions.push("Is there a sub-goal you can set that will help you solve the entire problem?");
    type_2_questions.push("Can you break the larger problem into smaller parts, and tackle them one at a time?");
    type_2_questions.push("What should be the next steps that you will take to solve the problem?");

    var type_3_questions = new Array(); //Type 3 (reflection-after)
    type_3_questions.push("How did the hint help you? Did the hint resolve some misconceptions or provide you with the missing information?");
    type_3_questions.push("Does this hint suggest you might have a mistaken belief or an incorrect assumption? If yes, what is it?");
    type_3_questions.push("Does anything in this hint conflict with the way you understood the problem? If yes, what is it?");
    type_3_questions.push("How would you explain this hint in your own words?");
    type_3_questions.push("How could you explain to someone else what this hint is saying?");
    type_3_questions.push("Was the hint helpful? If so, what kind of assistance did it offer to you?");

    var type_4_questions = new Array();  //Type 4 (planning-after)
    type_4_questions.push("How does this hint make you rethink the way you're approaching the problem?");
    type_4_questions.push("How do you intend to use this hint to move forward?");
    type_4_questions.push("How will you use this hint in solving the problem?");
    type_4_questions.push("How do you intend to apply the hint in solving the current task?");
    type_4_questions.push("How did the hint lead you to rethink your initial plans to solve the task?");
    type_4_questions.push("What would be the next step that you would take?");


//     if (window.performance && window.performance.navigation.type == window.performance.navigation.TYPE_RELOAD) {
//         //    var navVar = "reload";
//         random_before = localStorage.getItem("random_before");
//         random_after = localStorage.getItem("random_after");
//         console.log("reloaded");
//         console.log(random_before);
//         console.log(random_after);
//     }
//     else if (window.performance && window.performance.navigation.type == window.performance.navigation.TYPE_BACK_FORWARD) {
//         //    var navVar = "back_forward";
//         random_before = localStorage.getItem("random_before");
//         random_after = localStorage.getItem("random_after");
//         console.log("back_forward");
//         console.log(random_before);
//         console.log(random_after);
//     }
//     else {
//         var random_before = Math.floor(Math.random() * 3);
//         var random_after = Math.floor(Math.random() * 3 + 3);
//         localStorage.setItem("random_before", random_before);
//         localStorage.setItem("random_after", random_after);
//         console.log("0");
//     }


    var random_before = Math.floor(Math.random() * 3);
    var random_after = Math.floor(Math.random() * 3 + 3);
    localStorage.setItem("random_before", random_before);
    localStorage.setItem("random_after", random_after);



// //	var random_before = 0;
// //	var random_after = 0;

    var num_type_1 = type_1_questions.length;
    var num_type_2 = type_2_questions.length;
    var num_type_3 = type_3_questions.length;
    var num_type_4 = type_4_questions.length;


//    var random_1 = Math.floor(Math.random() * num_type_1);  // Type 1 before
//    var random_2 = Math.floor(Math.random() * num_type_2);  // Type 2 before
//    var random_3 = Math.floor(Math.random() * num_type_3);  // Type 3 after
//    var random_4 = Math.floor(Math.random() * num_type_4);  // Type 4 after

    function dispatchAssignConditionEvent() {
        let eventTitle = "AssignHintConditionEvent";
        let prompt1 = random_before;
        let prompt2 = random_after;
        var event = new CustomEvent(eventTitle, {
            detail: {
                prompt1: prompt1,
                prompt2: prompt2
            }
        });
        let intervalId = setInterval(function () {
            if (event.result != "Received") {
                document.dispatchEvent(event);
            } else {
                clearInterval(intervalId);
            }
        }, 500);
    };

    dispatchAssignConditionEvent();

    function load_ipython_extension() {


        if (window.performance && window.performance.navigation.type == window.performance.navigation.TYPE_RELOAD) {
            //    var navVar = "reload";
            random_before = Number(localStorage.getItem("random_before"));
            random_after = Number(localStorage.getItem("random_after"));
            console.log("reloaded");
            console.log(random_before);
            console.log(random_after);
        }
        else if (window.performance && window.performance.navigation.type == window.performance.navigation.TYPE_BACK_FORWARD) {
            //    var navVar = "back_forward";
            random_before = Number(localStorage.getItem("random_before"));
            random_after = Number(localStorage.getItem("random_after"));
            console.log("back_forward");
            console.log(random_before);
            console.log(random_after);
        }
        else {
            random_before = Number(localStorage.getItem("random_before"));
            random_after = Number(localStorage.getItem("random_after"));
            console.log("0");
            console.log(random_before);
            console.log(random_after);

        }


    //	var random_before = 0;
    //	var random_after = 0;


        // type: <hint/prompt>
        // typeId: <1/2>
        function dispatchHintEvent(type, typeId = null, hint = null) {
            let mapTypeToEventName = {
                list: "OpenHintListEvent", // regiesterd in jupyterevents.js
                hintChosen: "HintChosenEvent", // registed in jupyterevents.js
                prompt: "OpenHintPromptEvent", // registed in jupyterevents.js
                hint: "OpenHintAnswerEvent", // registed in jupyterevents.js
                next: "ClickHintNextEvent",
                response: "HintUserResponse" // regiesterd in jupyterevents.js
            };
            let eventTitle = mapTypeToEventName[type];
            hint.type = type;
            hint.type_id = typeId;
            var event = new CustomEvent(eventTitle, {
                detail: {
                    hint: hint
                }
            });
            document.dispatchEvent(event);
        }

        var oldSaveNotebook = function (check_last_modified) {
            if (check_last_modified === undefined) {
                check_last_modified = true;
            }

            var error;
            if (!Jupyter.notebook._fully_loaded) {
                error = new Error("Load failed, save is disabled");
                Jupyter.notebook.events.trigger('notebook_save_failed.Notebook', error);
                return Promise.reject(error);
            } else if (!Jupyter.notebook.writable) {
                error = new Error("Notebook is read-only");
                Jupyter.notebook.events.trigger('notebook_save_failed.Notebook', error);
                return Promise.reject(error);
            }

            // Trigger an event before save, which allows listeners to modify
            // the notebook as needed.
            Jupyter.notebook.events.trigger('before_save.Notebook');

            // Create a JSON model to be sent to the server.
            var model = {
                type: "notebook",
                content: Jupyter.notebook.toJSON()
            };
            // time the ajax call for autosave tuning purposes.
            var start = new Date().getTime();

            var that = Jupyter.notebook;
            var _save = function () {
                return that.contents.save(that.notebook_path, model).then(
                    $.proxy(that.save_notebook_success, that, start),
                    function (error) {
                        that.events.trigger('notebook_save_failed.Notebook', error);
                    }
                );
            };

            if (check_last_modified) {
                return Jupyter.notebook.contents.get(Jupyter.notebook.notebook_path, {content: false}).then(
                    function (data) {
                        var last_modified = new Date(data.last_modified);
                        // We want to check last_modified (disk) > that.last_modified (our last save)
                        // In some cases the filesystem reports an inconsistent time,
                        // so we allow 0.5 seconds difference before complaining.
                        if ((last_modified.getTime() - that.last_modified.getTime()) > 500) {  // 500 ms
                            console.warn("Last saving was done on `" + that.last_modified + "`(" + that._last_modified + "), " +
                                "while the current file seem to have been saved on `" + data.last_modified + "`");
                            if (that._changed_on_disk_dialog !== null) {
                                // update save callback on the confirmation button
                                that._changed_on_disk_dialog.find('.save-confirm-btn').click(_save);
                                // redisplay existing dialog
                                that._changed_on_disk_dialog.modal('show');
                            } else {
                                // create new dialog
                                that._changed_on_disk_dialog = dialog.modal({
                                    notebook: that,
                                    keyboard_manager: that.keyboard_manager,
                                    title: i18n.msg._("Notebook changed"),
                                    body: i18n.msg._("The notebook file has changed on disk since the last time we opened or saved it. "
                                        + "Do you want to overwrite the file on disk with the version open here, or load "
                                        + "the version on disk (reload the page)?"),
                                    buttons: {
                                        Reload: {
                                            class: 'btn-warning',
                                            click: function () {
                                                window.location.reload();
                                            }
                                        },
                                        Cancel: {},
                                        Overwrite: {
                                            class: 'btn-danger save-confirm-btn',
                                            click: function () {
                                                _save();
                                            }
                                        },
                                    }
                                });
                            }
                        } else {
                            return _save();
                        }
                    }, function (error) {
                        // maybe it has been deleted or renamed? Go ahead and save.
                        return _save();
                    }
                );
            } else {
                return _save();
            }
        }



        function showing_hint(Hints, part_id){


            // Get the list of hints used
            if (part_id == "fyhrwlzq") {
                var which_used_hint_list = used_hint_1;
                var which_all_used = all_used_1;
            } else if (part_id == "ufxqepry") {
                var which_used_hint_list = used_hint_2;
                var which_all_used = all_used_2;
            } else {
                var which_used_hint_list = used_hint_3;
                var which_all_used = all_used_3;
            }

            // if hints are not all used-up
            if (which_used_hint_list.length != which_all_used) {

                if (random_before === 0) {
                    list_of_hints(Hints, part_id);
                    // hint_text(hint.hint_text, hint);
                } else if (random_before === 1) {
                    type_1_before(Hints, part_id);
                } else {
                    type_2_before(Hints, part_id);
                }
            } else {
                // if hints are all used-up
                $("#show-hint" + part_id).text("No More Hints to Show");
                $("#show-hint" + part_id).attr("disabled", "disabled");
            }
            // Save notebook everytime
            oldSaveNotebook();
        }

        function list_of_hints(Hints, part_id){

            var temporary = {
                "hint_id": "TBD",
                "part_id": part_id,
                "hint_order": "TBD",
                "hint_text": "TBD"
            };


           dispatchHintEvent("list", "000", temporary)
            var $q1_hint_list = $(`
                <h4> List of hints for this questions <br><br>
                    <form>
                        <input type="radio" id="1-1" name="q_hint" value="1">
                        <label for="1-1">1-1</label><br>
                        <input type="radio" id="1-2" name="q_hint" value="2">
                        <label for="1-2">1-2</label><br>
                        <input type="radio" id="1-3" name="q_hint" value="3">
                        <label for="1-3">1-3</label>
                    </form>
                </h4>
                `);

            var $q2_hint_list = $(`
                <h4> List of hints for this questions <br><br>
                    <form>
                        <input type="radio" id="2-1" name="q_hint" value="1">
                        <label for="2-1">2-1</label><br>
                        <input type="radio" id="2-2" name="q_hint" value="2">
                        <label for="2-2">2-2</label><br>
                    </form>
                </h4>
                `);

            var $q3_hint_list = $(`
                <h4> List of hints for this questions <br><br>
                    <form>
                        <input type="radio" id="3-1" name="q_hint" value="1">
                        <label for="3-1">What is \`re.VERBOSE\`?</label><br>
                        <input type="radio" id="3-2" name="q_hint" value="2">
                        <label for="3-2">3-2</label><br>
                        <input type="radio" id="3-3" name="q_hint" value="3">
                        <label for="3-3">3-3</label>
                        <input type="radio" id="3-3" name="q_hint" value="4">
                        <label for="3-3">3-4</label>
                    </form>
                </h4>s
                `);

            if (part_id == "fyhrwlzq") {
                var $which_list = $q1_hint_list;
            } else if (part_id == "ufxqepry") {
                var $which_list = $q2_hint_list;
            } else {
                var $which_list = $q3_hint_list;
            }


            var array_hints = new Array();
            $.each(Hints, function (index, hint) {
                var temp = {
                    "hint_id": index,
                    "part_id": hint.part_id,
                    "hint_order": hint.hint_order,
                    "hint_text": hint.hint_text
                };
                array_hints.push(temp);
            });


            var form_0 = $("<form></form>").attr("id", "form_0");
            form_0.append($which_list);

            dialog.modal({
                title: i18n.msg._(' '),
                keyboard_manager: Jupyter.notebook.keyboard_manager,
                body: form_0,
                open: function () {
                    console.log("close")
                    $('.close').css('display', 'none');
                },
                backdrop: "static",
                keyboard: false,
                buttons: {
                    'Next': {
                        'class': 'btn-primary', 'id': 'next',
                        'click': function () {
                            var chosenHintList = document.getElementsByName('q_hint');

                            for(i = 0; i < chosenHintList.length; i++) {
                                if(chosenHintList[i].checked){
                                    var chosenHint = array_hints[chosenHintList[i].value - 1]; //chosenHint[i].value==hint_order
                                    // Todo: Should I require hint reponses?
                                   insertHint(chosenHint, part_id);
                                } else {
                                    console.log("close")
                                    $('.close').css('display', 'none');
                                }
                            }
                            dispatchHintEvent('hintChosen', '000', hint)
                        }
                    }
                }
            })

        }


        function type_1_before(Hints, part_id) {
            var temp = {
                "hint_id": "TBD",
                "part_id": part_id,
                "hint_order": "TBD",
                "hint_text": "TBD"
            };
            dispatchHintEvent("prompt", "1", temp);
            var random_1 = Math.floor(Math.random() * num_type_1);  // Type 1 before
            var form = $("<form></form>").attr("id", "form");
            var prompt = $("<h4>" + "Prompt: " + type_1_questions[random_1] + "</h4>").attr("id", "prompt");
            var ans = $("<div><textarea rows='5' style='max-width: 100%; width: 100%' id='ans' placeholder = 'Your Answer'/></div>");
            form.append(prompt);
            form.append(ans);

            dialog.modal({
                title: i18n.msg._(' '),
                keyboard_manager: Jupyter.notebook.keyboard_manager,
                body: form,
                open: function () {
                    console.log("close")
                    $('.close').css('display', 'none');
                },
                backdrop: "static",
                keyboard: false,
                buttons: {
                    'Next': {
                        'class': 'btn-primary', 'id': 'next',
                        'click': function () {
                            temp.user_answer = $('#ans').val();
                            temp.prompt = type_1_questions[random_1]
                            dispatchHintEvent('response', '1', temp)
                            list_of_hints(Hints, part_id)

                        }
                    }
                }
            });
        }

        function type_2_before(Hints, part_id) {
            var temp = {
                "hint_id": "TBD",
                "part_id": part_id,
                "hint_order": "TBD",
                "hint_text": "TBD"
            };
            dispatchHintEvent("prompt", "2", temp);
            var random_2 = Math.floor(Math.random() * num_type_2);  // Type 2 before
            var form = $("<form></form>").attr("id", "form");
            var prompt = $("<h4>"  + "Prompt: " + type_2_questions[random_2] + "</h4>").attr("id", "prompt");
            var ans = $("<div><textarea rows='5' style='max-width: 100%; width: 100%' id='ans' placeholder = 'Your Answer'/></div>");
            form.append(prompt);
            form.append(ans);

            var temp = {
                "hint_id": "TBD",
                "part_id": part_id,
                "hint_order": "TBD",
                "hint_text": "TBD"
            };

            dialog.modal({
                title: i18n.msg._(' '),
                body: form,
                open: function () {
                    console.log("close")
                    $('.close').css('display', 'none');
                },
                backdrop: "static",
                keyboard: false,
                keyboard_manager: Jupyter.notebook.keyboard_manager,
                buttons: {
                    'Next': {
                        'class': 'btn-primary', 'id': 'next',
                        'click': function () {
                            temp.user_answer = $('#ans').val();
                            temp.prompt = type_2_questions[random_2]
                            dispatchHintEvent('response', '2', temp)
                            list_of_hints(Hints, part_id)
                            // dispatchHintEvent("next", "2", hint);
                        }
                    }
                }
            });
        }

        function hint_text(hintText, chosenHint) {
            var hint = chosenHint;
            dispatchHintEvent("hint", "non-prompt", hint);

            var converter = new showdown.Converter(),
            text = hintText,
            htmltext = converter.makeHtml(text);

            var form = $("<form></form>").attr("id", "form");
//            var hint_ar = $("<h4>" + hintText + "</div></h4>").attr("id", "prompt");
            var hint_ar = $("<h4>" + htmltext + "</h4>").attr("id", "prompt");
            form.append(hint_ar);
            dialog.modal({
                title: i18n.msg._('Hint'),
                body: form,
                open: function () {
                    console.log("close")
                    $('.close').css('display', 'none');
                },
                backdrop: "static",
                keyboard: false,
                keyboard_manager: Jupyter.notebook.keyboard_manager,
                buttons: {
                    'Next': {
                        'class': 'btn-primary', 'id': 'next',
                        'click': function () {
                            // dispatchHintEvent("next", null, hint);
                            if (random_after == 3) {
                                type_3_after(hint);
                            } else if (random_after == 4) {
                                type_4_after(hint);
                            } else {
                                console.log("1");
                            }
                        }
                    }
                }
            });
        }

        function type_3_after(hint) {
            dispatchHintEvent("prompt", "3", hint);
            var random_3 = Math.floor(Math.random() * num_type_3);  // Type 3 after
            var form = $("<form></form>").attr("id", "form");
            var prompt = $("<h4>" + "Prompt: " + type_3_questions[random_3] + "</h4>").attr("id", "prompt");
            var ans = $("<div><textarea rows='5' style='max-width: 100%; width: 100%' id='ans' placeholder = 'Your Answer'/></div>");
            Jupyter.keyboard_manager.register_events(ans);
            form.append(prompt);
            form.append(ans);
            dialog.modal({
                title: i18n.msg._(' '),
                body: form,
                open: function () {
                    console.log("close")
                    $('.close').css('display', 'none');
                },
                backdrop: "static",
                keyboard: false,
                keyboard_manager: Jupyter.notebook.keyboard_manager,
                buttons: {
                    'Next': {
                        'class': 'btn-primary', 'id': 'next',
                        'click': function () {
                            hint.user_answer = $('#ans').val();
                            hint.prompt = type_3_questions[random_3]
                            dispatchHintEvent('response', '3', hint)
                            // dispatchHintEvent("next", "3", hint);
                        }
                    }
                }
            });
        }

        function type_4_after(hint) {
            dispatchHintEvent("prompt", "4", hint);
            var random_4 = Math.floor(Math.random() * num_type_4);  // Type 4 after
            var form = $("<form></form>").attr("id", "form");
            var prompt = $("<h4>" + "Prompt: " + type_4_questions[random_4] + "</h4>").attr("id", "prompt");
            var ans = $("<div><textarea rows='5' style='max-width: 100%; width: 100%' id='ans' placeholder = 'Your Answer'/></div>");
            Jupyter.keyboard_manager.register_events(ans);
            form.append(prompt);
            form.append(ans);
            dialog.modal({
                title: i18n.msg._(' '),
                body: form,
                open: function () {
                    console.log("close")
                    $('.close').css('display', 'none');
                },
                backdrop: "static",
                keyboard: false,
                keyboard_manager: Jupyter.notebook.keyboard_manager,
                buttons: {
                    'Next': {
                        'class': 'btn-primary', 'id': 'next',
                        'click': function () {
                            hint.user_answer = $('#ans').val();
                            hint.prompt = type_4_questions[random_4]
                            dispatchHintEvent('response', '4', hint)
                            // dispatchHintEvent("next", "4", hint);
                        }
                    }
                }
            });
        }


        function insertHint(chosenHint, part_id) {
            var hint = chosenHint
            // Insert a markdown cell called "hint"
            var cells = Jupyter.notebook.get_cells();
            var index_hint = 0;
            var index = hint.hint_id;

            if (part_id == "fyhrwlzq") {
                var which_used_hint_list = used_hint_1;
                var which_all_used = all_used_1;
            } else if (part_id == "ufxqepry") {
                var which_used_hint_list = used_hint_2;
                var which_all_used = all_used_2;
            } else {
                var which_used_hint_list = used_hint_3;
                var which_all_used = all_used_3;
            }

            which_used_hint_list.push(index);

            cells.forEach(function (cell, index) {
                if (cell.metadata.mentor_academy_cell_type == "part_student_solution_code" && cell.metadata.part_id == part_id) {
                    student_solution_code_index = index;
                }
                if (cell.metadata.mentor_academy_cell_type == "part_description" && cell.metadata.part_id == part_id) {
                    part_description_index = index;
                }
            });


            // inscripting the hint cell
            if (which_used_hint_list.includes(index)){
                // but if this particular hint has been inscripted as a cell already
                // do nothing.
                // or repeat everything except inscripting the hint cell
                hint_text(hint.hint_text, hint);
            }

            else {
                // if this is a request to a new hint
                hint_text(hint.hint_text, hint);
                index_hint = student_solution_code_index;
                Jupyter.notebook.insert_cell_at_index("markdown", index_hint);
                var cell = IPython.notebook.get_cell(index_hint);
                cell.code_mirror.doc.setValue(hint.hint_text);
                cell.metadata = {
                    "part_id": part_id,
                    "hint_id": hint.hint_id,
                    "mentor_academy_cell_type": "hint",
                    "hint_order": hint.hint_order
                };
                cell.focus_editor();
                cell.set_text(hint.hint_text);
                cell.unrender();
                cell.render();
                if (arra == array_hints.length - 1) {
                    // If it's the last hint.
                    cell.metadata = {
                        "part_id": part_id,
                        "hint_id": hint.hint_id,
                        "mentor_academy_cell_type": "hint",
                        "hint_order": hint.hint_order,
                        "last_hint": true
                    };
                    $("#show-hint" + part_id).text("No More Hints to Show");
                    $("#show-hint" + part_id).attr("disabled", "disabled");
                }
            }


            // Save notebook everytime
            oldSaveNotebook();
        }

        // todo: change the all_used_n value to be automatically extracted
        var used_hint_1 = new Array();
        var all_used_1 = 3;
        all_used_1 = all_used_1-1;
        var used_hint_2 = new Array();
        var all_used_2 = 2;
        all_used_2 = all_used_2-1;
        var used_hint_3 = new Array();
        var all_used_3 = 4;
        all_used_3 = all_used_3-1;


        var cells = Jupyter.notebook.get_cells();
        cells.forEach(function (cell, index) {
            var part_id = cell.metadata.part_id;

            if (cell.metadata.mentor_academy_cell_type == "part_student_solution_code" && cell.metadata.if_hint) {

                var hintbutton = $("<button>Show Hint</button>").attr("id", "show-hint" + part_id).attr("class", "show-hint").css("margin-left", "auto").css("margin-top", "5px").css("margin-bottom", "3px");

                if (cells[index - 1].metadata.last_hint) {
                    hintbutton.text("No More Hints to Show");
                    hintbutton.attr("disabled", "disabled");
                }
                hintbutton.bind("click", function () {
                    var xml = new XMLHttpRequest();
                    xml.onreadystatechange = function () {
                        if (xml.readyState == 4 && xml.status == 200) {
                            // starting the whole process
                            showing_hint(JSON.parse(xml.responseText), part_id);
                        }
                    }
                    var data = {"part_id": part_id};
                    var url = getUrl.getUrlForConfig("showHint");
                    xml.open("POST", url, true);
                    xml.setRequestHeader('Content-type', 'application/json');
                    xml.setRequestHeader('Access-Control-Allow-Methods', 'Post, Get, Options');
                    xml.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xml.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
                    xml.send(JSON.stringify(data));
                });

                $($("#notebook-container").children()[index]).prepend(hintbutton);
            }
        });

    }

    var nb_content = JSON.parse(JSON.stringify(Jupyter.notebook));
    if (IPython.notebook.metadata.umich.submit === "yes") {
        if (nb_content.cells[0].metadata.submit != "submit") {
            return {
                load_ipython_extension: load_ipython_extension
            };
        }
    }
});
