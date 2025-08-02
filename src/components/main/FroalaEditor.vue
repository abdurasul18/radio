<script setup lang="ts">

import "froala-editor/css/froala_editor.pkgd.min.css";
// allowJS
import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min.js";
let editor = ref();
let props = defineProps<{
  value: string;
  id?: string;
  landscape?: boolean;
  width?: string;
  viewMode?: boolean;
  hasVideo?: boolean;
}>();
let emits = defineEmits(["update:value"]);
let text = computed({
  get() {
    return props.value;
  },
  set(val) {
    emits("update:value", val);
  },
});

function initFroala() {
  editor.value = null;
  editor.value = new FroalaEditor(`#${props.id}`, {
    tableStyles: {
      class1: "No borders",
    },
    embedlyScriptPath: "",
    imageInsertButtons: ["imageUpload", "|", "imageByURL"],
    htmlAllowedEmptyTags : ["span"],
    language: "ru",
    events: {
      "image.beforeUpload": function (files: any) {
        let editor = this as any;
        if (files.length > 0) {
          let reader = new FileReader();
          reader.onload = (e: any) => {
            let result = e.target.result;
            editor.image.insert(result, {}, {}, editor.image.get());
          };
          reader.readAsDataURL(files[0]);
        }
        editor.popups.hideAll();
        return false;
      },
      keyup: function () {
        text.value = (this as any).html.get();
      },
      click: function () {
        text.value = (this as any).html.get();
      },
      "commands.before": function () {},
      "commands.after": function () {
        text.value = (this as any).html.get();
      },
      "paste.after": function () {
        text.value = (this as any).html.get();
      },
      "html.set": function () {
        text.value = (this as any).html.get();
      },
      initialized: function () {
        // Define custom button
        FroalaEditor.DefineIcon("tabIcon", { NAME: "arrow-right", SVG_KEY: "indent" });
        FroalaEditor.RegisterCommand("customTab", {
          title: "Indent Text",
          icon: "tabIcon",
          focus: false,
          undo: true,
          refreshAfterCallback: false,
          callback: function () {
            
            editor.value?.selection?.restore?.();
            editor.value?.html?.insert(
              "<span style='width:32pt;display:inline-block;'></span>"
            );
          },
          refresh: function ($btn: any) {
            const selection = this.selection.element();
            // Check if the first child has the correct text-indent style
            if (
              selection &&
              selection.firstElementChild &&
              window.getComputedStyle(selection.firstElementChild).width === "32pt"
            ) {
              $btn[0].classList.add("fr-active"); // Activate button
            } else {
              $btn[0].classList.remove("fr-active"); // Deactivate button
            }
          },
        });
      },
    },
    documentReady: true,
    fontSize: [
      "3",
      "4",
      "6",
      "8",
      "9",
      "10",
      "11",
      "12",
      "14",
      "16",
      "18",
      "22",
      "24",
      "30",
      "36",
      "48",
      "60",
      "72",
      "96",
    ],
    fontFamilyDefaultSelection: "Arial",
    // imageUploadRemoteUrls: false,
    toolbarButtons: props.viewMode
      ? []
      : props.hasVideo
      ? [
          "fullscreen",
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "subscript",
          "superscript",
          "textColor",
          "backgroundColor",
          // "|",
          "fontFamily",
          "fontSize",
          // "color",
          // "inlineClass",
          // "inlineStyle",
          // "paragraphStyle",
          "lineHeight",
          "|",
          "paragraphFormat",
          "align",
          "formatOL",
          "formatUL",
          // "outdent",
          // "indent",
          // "quote",
          // "-",
          // "insertLink",
          "insertImage",
          "insertVideo",
          //   "embedly",
          //   "insertFile",
          "insertTable",
          "html",
          "|",
          //   "emoticons",
          //   "fontAwesome",
          "specialCharacters",
          // "insertHR",
          // "selectAll",
          // "clearFormatting",
          // "|",
          //   "print",
          //   "getPDF",
          //   "spellChecker",
          // "help",

          //   "|",
          //   "undo",
          //   "redo",
          "trackChanges",
          "translate",
          "addPlace",
          "customTab",
        ]
      : [
          "fullscreen",
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "subscript",
          "superscript",
          "textColor",
          "backgroundColor",
          "|",
          "fontFamily",
          "fontSize",
          "color",
          // "inlineClass",
          "inlineStyle",
          "paragraphStyle",
          "lineHeight",
          "|",
          "paragraphFormat",
          "align",
          "formatOL",
          "formatUL",
          // "outdent",
          // "indent",
          "quote",
          "-",
          "insertLink",
          "insertImage",
          // "insertVideo",
          //   "embedly",
          "insertFile",
          "insertTable",
          "html",
          "|",
          // "emoticons",
          "fontAwesome",
          "specialCharacters",
          "insertHR",
          "selectAll",
          "clearFormatting",
          // "|",
          //   "print",
          //   "getPDF",
          "spellChecker",
          "help",

          "|",
          "undo",
          "redo",
          "trackChanges",
          "translate",
          "addPlace",
          "customTab",
        ],
    charCounterCount: false,
    tabSpaces: 4,
    height: 600,
    fontSizeUnit: "pt",
    placeholderText: "",
    fontFamilySelection: true,
  });
}

onMounted(() => {
  initFroala();
});
onUnmounted(() => {
  editor.value = null;
});
//

</script>
<template>
  <div
    class="no-licence"
    style="position: relative !important"
    :class="{
      landscape: props.landscape,
      'view-mode': props.viewMode,
      isLarge: props.width,
    }"
  >
    <div class="wrap-editor">
      <textarea :value="props.value" :id="props.id"></textarea>
    </div>
  </div>

</template>
<style lang="scss">

</style>
