// Import necessary libraries, including React, react-dom/client, react-dropzone, csv-utils, and mindmap.

// `React` is the main library that the app is built on 
import * as React from "react";
// `react-dom/client` is used to create a root node for the React app
import { createRoot } from "react-dom/client";
// `useDropzone` is a hook from a library called `react-dropzone` that enables drag-and-drop file uploading
import { useDropzone } from "react-dropzone";
// `parseCsv` and `createMindmap` are functions from custom modules that are used to parse the CSV file and generate a mind map, respectively
import { parseCsv } from "./csv-utils";
import { createMindmap } from "./mindmap";

// Defines a constant called `dropzoneStyles`, which contains a set of styles for the drag-and-drop area where the user can upload their CSV file. These styles are later applied to the drop zone container element. 
const dropzoneStyles = {
  display: "flex",
  height: "100%",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  border: "3px dashed rgba(41, 128, 185, 0.5)",
  color: "rgba(41, 128, 185, 1.0)",
  fontWeight: "bold",
  fontSize: "1.2em",
} as const;

// The `App` component is defined using the `React.FC` type. This component sets up the `files` state using `useState` hook, which tracks the uploaded CSV files. It also uses the `useDropzone` hook to enable drag-and-drop file uploading. When a file is dropped into the drop zone, the `onDrop` callback is fired, which sets the uploaded file to the `files` state.
const App: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const dropzone = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDrop: (droppedFiles) => {
      setFiles([droppedFiles[0]]);
    },
  });

// The `handleCreate` function is defined, which is called when the user clicks the "Create Mind Map" button. This function iterates through each of the uploaded files, parses their contents using the `parseCsv` function, and generates a mind map using the `createMindmap` function. If there is an error while parsing or creating the mind map, the file is added to the `failed` array and an error is logged to the console. Finally, the `files` state is reset to an empty array.
  const handleCreate = async () => {
    const failed = [];
    for (const file of files) {
      try {
        const contents = await parseCsv(file);
        await createMindmap(contents);
      } catch (e) {
        failed.push(file);
        console.error(e);
      }
    }

    setFiles([]);
  };

// The `style` constant is defined using the `useMemo` hook, which generates a style object for the drop zone container element based on the `dropzoneStyles` constant and the state of the `useDropzone` hook. The `isDragAccept` and `isDragReject` properties are used to change the border color of the container element when a file is being dragged over it.
  const style = React.useMemo(() => {
    let borderColor = "rgba(41, 128, 185, 0.5)";
    if (dropzone.isDragAccept) {
      borderColor = "rgba(41, 128, 185, 1.0)";
    }

    if (dropzone.isDragReject) {
      borderColor = "rgba(192, 57, 43,1.0)";
    }
    return {
      ...dropzoneStyles,
      borderColor,
    };
  }, [dropzone.isDragActive, dropzone.isDragReject]);

// The `return` statement of the `App` component contains the JSX code that defines the UI of the app. It contains a `div` element with the class `dnd-container`, which contains a paragraph with instructions on how to upload a CSV file. The `div` element also contains the drop zone container element, which is created using the `getRootProps` and `getInputProps` functions provided by the `useDropzone` hook. If a file is being dragged over the drop zone, the text changes to "Drop your CSV file are here". Otherwise, a button and a text element appear that tell the user to either select a file or drop it into the container.    
  return (
    <div className="dnd-container">
      <p>Select your CSV file to import it as a mind map</p>
      <div {...dropzone.getRootProps({ style })}>
        <input {...dropzone.getInputProps()} />
        {dropzone.isDragAccept ? (
          <p className="dnd-text">Drop your CSV file are here</p>
        ) : (
          <>
            <div>
              <button
                type="button"
                className="button button-primary button-small"
              >
                Select CSV file
              </button>
              <p className="dnd-text">Or drop your CSV file here</p>
            </div>
          </>
        )}
      </div>
      {files.length > 0 && (
        <>
          <ul className="dropped-files">
            {files.map((file, i) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>

          <button
            onClick={handleCreate}
            className="button button-small button-primary"
          >
            Create Mind Map
          </button>
        </>
      )}
    </div>
  );
};

// The `container` and `root` constants are defined and the `App` component is rendered to the root node using the `createRoot` function from the `react-dom/client` library.    
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);