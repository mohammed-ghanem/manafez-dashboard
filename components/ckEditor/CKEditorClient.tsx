// "use client";

// import { FC } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import {
//   ClassicEditor,
//   Autoformat,
//   Bold,
//   Italic,
//   Underline,
//   BlockQuote,
//   Base64UploadAdapter,
//   Essentials,
//   Heading,
//   Image,
//   ImageCaption,
//   ImageResize,
//   ImageStyle,
//   ImageToolbar,
//   ImageUpload,
//   PictureEditing,
//   Indent,
//   IndentBlock,
//   Link,
//   List,
//   Font,
//   FontSize,
//   FontFamily,
//   Alignment,
//   Paragraph,
//   PasteFromOffice,
//   Table,
//   TableColumnResize,
//   TableToolbar,
//   TextTransformation,
//   SourceEditing,
//   Code,
//   CodeBlock,
//   Highlight,
//   HorizontalLine,
//   MediaEmbed,
//   RemoveFormat,
//   SpecialCharacters,
//   Strikethrough,
//   Subscript,
//   Superscript,
//   WordCount,
// } from "ckeditor5";

// import "ckeditor5/ckeditor5.css";
// import "./style.css";
// import { CkEditorConfig  } from "./types";

// interface CkEditorProps {
//   editorData: string;
//   setEditorData: (value: string) => void;
//   handleOnUpdate: (value: string, field: string) => void;
//   config?: CkEditorConfig;
// }

// const CkEditorClient: FC<CkEditorProps> = ({
//   editorData,
//   setEditorData,
//   handleOnUpdate,
//   config,
// }) => {
//   return (
//     <div className="ckeditor-container">
//       <CKEditor
//         editor={ClassicEditor}
//         data={editorData}
//         config={{
//           licenseKey: "GPL",
//           language: config?.language ?? "en",
//           plugins: [
//             Autoformat,
//             BlockQuote,
//             Bold,
//             Essentials,
//             Heading,
//             Image,
//             ImageCaption,
//             ImageResize,
//             ImageStyle,
//             ImageToolbar,
//             ImageUpload,
//             Base64UploadAdapter,
//             Indent,
//             IndentBlock,
//             Italic,
//             Link,
//             Font,
//             FontSize,
//             FontFamily,
//             Alignment,
//             List,
//             Paragraph,
//             PasteFromOffice,
//             PictureEditing,
//             Table,
//             TableColumnResize,
//             TableToolbar,
//             TextTransformation,
//             Underline,
//             SourceEditing,
//             Code,
//             CodeBlock,
//             Highlight,
//             HorizontalLine,
//             MediaEmbed,
//             RemoveFormat,
//             SpecialCharacters,
//             Strikethrough,
//             Subscript,
//             Superscript,
//             WordCount,
//           ],
//         }}
//         onChange={(_, editor) => {
//           const data = editor.getData();
//           setEditorData(data);
//           handleOnUpdate?.(data, "description");
//         }}
//       />
//     </div>
//   );
// };

// export default CkEditorClient;
