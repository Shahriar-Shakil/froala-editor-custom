import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.css";
// import "file-loader?name=[name].[ext]!./custombutton.html";

import FroalaEditor from "react-froala-wysiwyg";
import React, { useState } from "react";
import Froalaeditor from "froala-editor";
import { Modal, Input } from "antd";

Froalaeditor.DefineIcon("clear", { NAME: "remove", SVG_KEY: "remove" });
Froalaeditor.RegisterCommand("clear", {
  title: "Clear HTML",
  focus: false,
  undo: true,
  refreshAfterCallback: true,
  callback: function () {
    this.html.set("");
    this.events.focus();
  },
});

export default function CustomFroalaEditor() {
  const [content, setContent] = useState("");

  const [visiblePopup, setVisiblePopup] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const handleModelChange = (model) => {
    setContent(model);
  };

  const handleModalClose = () => {
    setVisiblePopup(false);
  };
  const handleOkPopup = () => {
    setContent((prevState) => {
      const newContent =
        prevState +
        `<iframe width="1000" height="345" src=${pdfUrl}>
      </iframe>`;
      return newContent;
    });
    setVisiblePopup(false);
  };
  Froalaeditor.DefineIcon("insert", { NAME: "plus", SVG_KEY: "add" });
  Froalaeditor.RegisterCommand("insert", {
    title: "Insert PDF",
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback: function () {
      //   this.html.insert("My New HTML");
      setVisiblePopup(true);
    },
  });
  return (
    <div>
      <FroalaEditor
        tag="textarea"
        model={content}
        onModelChange={handleModelChange}
        config={{
          pluginsEnabled: ["align", "link"],
          language: "ro",
          toolbarButtons: [
            ["undo", "redo", "bold"],
            ["clear", "insert"],
          ],
        }}
      />
      <Modal
        visible={visiblePopup}
        onCancel={handleModalClose}
        closable={false}
        onOk={handleOkPopup}
      >
        <Input
          placeholder="Insert the link here"
          onChange={(e) => setPdfUrl(e.target.value)}
        />
      </Modal>
    </div>
  );
}
