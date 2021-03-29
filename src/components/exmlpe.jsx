// Define custom icon
import $ from "jquery";
import React from "react";
import rangy from "rangy";
import { FroalaEditor } from "froala-editor";

FroalaEditor.DefineIcon("testButtonIcon", { NAME: "plus" });
FroalaEditor.RegisterCommand("testButton", {
  title: "Button title",
  icon: "testButtonIcon",
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.html.set(this.html.get() + "<hr>");
  },
  refresh: function ($btn) {},
});

// Define custom popup
// Define popup template.
$.extend($.FroalaEditor.POPUP_TEMPLATES, {
  "customPlugin.popup": "[_BUTTONS_][_CUSTOM_LAYER_]",
});

// Define popup buttons.
$.extend($.FroalaEditor.DEFAULTS, {
  popupButtons: ["popupClose", "|", "popupButton1", "popupButton2"],
});

// The custom popup is defined inside a plugin (new or existing).
$.FroalaEditor.PLUGINS.customPlugin = function (editor) {
  // Create custom popup.
  function initPopup() {
    // Load popup template.
    var template = $.FroalaEditor.POPUP_TEMPLATES.customPopup;
    if (typeof template == "function") template = template.apply(editor);

    // Popup buttons.
    var popup_buttons = "";

    // Create the list of buttons.
    if (editor.opts.popupButtons.length > 1) {
      popup_buttons += '<div class="fr-buttons">';
      popup_buttons += editor.button.buildList(editor.opts.popupButtons);
      popup_buttons += "</div>";
    }

    // Load popup template.
    var template = {
      buttons: popup_buttons,
      custom_layer: '<div class="custom-layer">Hello World!</div>',
    };

    // Create popup.
    var $popup = editor.popups.create("customPlugin.popup", template);

    return $popup;
  }

  // Show the popup
  function showPopup({ $container = editor.$tb, top, left } = {}) {
    // Get the popup object defined above.
    var $popup = editor.popups.get("customPlugin.popup");

    // If popup doesn't exist then create it.
    // To improve performance it is best to create the popup when it is first needed
    // and not when the editor is initialized.
    if (!$popup) $popup = initPopup();

    // Set the editor toolbar as the popup's container.
    editor.popups.setContainer("customPlugin.popup", $container);

    // If the editor is not displayed when a toolbar button is pressed, then set BODY as the popup's container.
    // editor.popups.setContainer('customPlugin.popup', $('body'));

    // Trigger refresh for the popup.
    // editor.popups.refresh('customPlugin.popup');

    // This custom popup is opened by pressing a button from the editor's toolbar.
    // Get the button's object in order to place the popup relative to it.
    var $btn = editor.$tb.find('.fr-command[data-cmd="myButton"]');

    // Compute the popup's position.
    var left = left || $btn.offset().left + $btn.outerWidth() / 2;
    var top =
      top ||
      $btn.offset().top +
        (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);

    // Show the custom popup.
    // The button's outerHeight is required in case the popup needs to be displayed above it.
    editor.popups.show("customPlugin.popup", left, top, $btn.outerHeight());
  }

  // Hide the custom popup.
  function hidePopup() {
    editor.popups.hide("customPlugin.popup");
  }

  // Methods visible outside the plugin.
  return {
    showPopup: showPopup,
    hidePopup: hidePopup,
  };
};

// Define an icon and command for the button that opens the custom popup.
$.FroalaEditor.DefineIcon("buttonIcon", { NAME: "star" });
$.FroalaEditor.RegisterCommand("myButton", {
  title: "Show Popup",
  icon: "buttonIcon",
  undo: false,
  focus: false,
  popup: true,
  // Buttons which are included in the editor toolbar should have the plugin property set.
  plugin: "customPlugin",
  callback: function () {
    if (!this.popups.isVisible("customPlugin.popup")) {
      this.customPlugin.showPopup();
    } else {
      if (this.$el.find(".fr-marker")) {
        this.events.disableBlur();
        this.selection.restore();
      }
      this.popups.hide("customPlugin.popup");
    }
  },
});

// Define custom popup close button icon and command.
$.FroalaEditor.DefineIcon("popupClose", { NAME: "times" });
$.FroalaEditor.RegisterCommand("popupClose", {
  title: "Close",
  undo: false,
  focus: false,
  callback: function () {
    this.customPlugin.hidePopup();
  },
});

// Define custom popup 1.
$.FroalaEditor.DefineIcon("popupButton1", { NAME: "edit" });
$.FroalaEditor.RegisterCommand("popupButton1", {
  title: "Apply class",
  undo: true,
  focus: false,
  callback: function () {
    debugger;
    let customClass = "selected";
    let selection = document.getSelection();
    let text = selection.toString();
    let $parent = $(selection.focusNode.parentElement);
    let oldHtml = $parent.html();
    let newHtml;
    if ($parent.hasClass(customClass)) {
      newHtml = oldHtml;
    } else {
      newHtml = oldHtml.replace(
        text,
        `<span class='${customClass}'>${text}</span>`
      );
    }
    $parent.html(newHtml);
    if (selection.removeAllRanges) {
      selection.removeAllRanges();
    } else if (selection.empty) {
      selection.empty();
    }
    this.customPlugin.hidePopup();
  },
});

// Define custom popup 2.
$.FroalaEditor.DefineIcon("popupButton2", { NAME: "bullhorn" });
$.FroalaEditor.RegisterCommand("popupButton2", {
  title: "Button 2",
  undo: false,
  focus: false,
  callback: function () {
    alert("popupButton2");
  },
});

// Custom dropdown

$.FroalaEditor.DefineIcon("my_dropdown", { NAME: "cog" });
$.FroalaEditor.RegisterCommand("my_dropdown", {
  title: "Advanced options",
  type: "dropdown",
  focus: false,
  undo: false,
  refreshAfterCallback: true,
  options: {
    v1: "Option 1",
    v2: "Option 2",
  },
  callback: function (cmd, val) {
    console.log(val);
  },
  // Callback on refresh.
  refresh: function ($btn) {
    console.log("do refresh");
  },
  // Callback on dropdown show.
  refreshOnShow: function ($btn, $dropdown) {
    console.log("do refresh when show");
  },
});

// Custom quick insert button

$.FroalaEditor.DefineIcon("buttonIcon", { NAME: "star" });

// Define a button.
$.FroalaEditor.RegisterQuickInsertButton("myButton", {
  // Icon name.
  icon: "buttonIcon",

  // Tooltip.
  title: "My Button",

  // Callback for the button.
  callback: function () {
    // Call any editor method here.
    this.html.insert("Hello Froala!");
  },

  // Save changes to undo stack.
  undo: true,
});

export default class FroalaEditorComponent extends React.Component {
  constructor(props) {
    super(props);
    let datasource = [
      {
        id: 1,
        username: "alejandrochvs",
        name: "Alejandro",
        lastName: "Chaves",
      },
      {
        id: 2,
        username: "mariaviiia",
        name: "Maria",
        lastName: "Ochoa",
      },
      {
        id: 3,
        username: "sombrasombrosa",
        name: "Sombra",
        lastName: "Asombrosa",
      },
    ];

    this.state = {
      config: {
        at: "@",
        data: datasource,
        searchKey: "username",
        displayTpl:
          "<li data-id='${id}'>${name} ${lastName} <small>${username}</small></li>",
        insertTpl:
          '<a href="http://www.instagram.com/${username}" target="_blank">@${name} ${lastName}</a>',
        limit: 200,
      },
      content: ``,
      froalaOptions: {
        toolbarInline: false,
        toolbarSticky: true,
        toolbarStickyOffset: 15,
        charCounterCount: true,
        fontFamilySelection: true,
        fontSizeSelection: true,
        paragraphFormatSelection: true,
        toolbarBottom: false,
        shortcutsHint: true,
        tabSpaces: 4,
        iconsTemplate: "font_awesome_5",
        toolbarButtons: [
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "subscript",
          "superscript",
          "color",
          "align",
          "formatOL",
          "formatUL",
          "indent",
          "outdent",
          "undo",
          "redo",
          "html",
          "-",
          "insertImage",
          "insertLink",
          "insertFile",
          "insertVideo",
          "insertTable",
          "|",
          "emoticons",
          "fontAwesome",
          "specialCharacters",
          "insertHR",
          "selectAll",
          "clearFormatting",
          "print",
          "spellChecker",
          "help",
          "-",
          "fontFamily",
          "|",
          "fontSize",
          "|",
          "paragraphFormat",
          "|",
          "embedly",
          "testButton",
          "myButton",
          "my_dropdown",
        ],
        quickInsertButtons: ["image", "table", "ol", "ul", "myButton"],
        editorClass: "custom-class",
        spellcheck: true,
        theme: "dark",
      },
      editor: null,
    };
  }
  componentDidMount() {
    let $froala = $("div#froala-editor");
    const self = this;
    $froala
      .on("froalaEditor.initialized", (e, editor) => {
        self.setState({
          editor,
        });
        editor.$el.atwho(self.state.config);
        editor.events.on(
          "keydown",
          (e) => {
            if (
              e.which == $.FroalaEditor.KEYCODE.ENTER &&
              editor.$el.atwho("isSelecting")
            ) {
              return false;
            }
          },
          true
        );
      })
      .on("froalaEditor.contentChanged", (e, editor) => {
        let content = editor.$el.html();
        self.setState({
          content,
        });
      })
      .on("froalaEditor.click", (e, editor) => {
        let selection = rangy.getSelection();

        if (selection.focusOffset !== selection.anchorOffset) {
          let options = {};
          let $container = editor.$sc;
          const startPos = window
            .getSelection()
            .getRangeAt(0)
            .getClientRects()[0];
          const left = startPos.left + startPos.width / 2;
          const top = startPos.top + startPos.height;
          options = { $container, top, left };
          return editor.customPlugin.showPopup(options);
        }
      })
      .on("inserted.atwho", (atEvent, $li, browserEvent) => {
        setTimeout(() => {
          self.setState({
            content: $froala.froalaEditor("html.get"),
          });
        }, 0);
      })
      .froalaEditor(self.state.froalaOptions)
      .froalaEditor("html.set", self.state.content);
  }
  render() {
    return (
      <div class="body container-fluid">
        <div class="row">
          <div class="col-12 col-md mb-3 p-0" id="froala-editor" />
          <div class="col-12 col-md mb-3 fr-view text-preview">
            <h3 class="preview-title">Preview text</h3>
            <span
              class="d-inline-block pt-5 preview-content"
              dangerouslySetInnerHTML={{ __html: this.state.content }}
            />
          </div>
        </div>
      </div>
    );
  }
}
