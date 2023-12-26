"use client";
import React from "react";
import { useEdgeStore } from "~/lib/edgestore";

const UploadFileButton = () => {
  const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();
  return (
    <div className="mx-4">
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0]);
        }}
      />
      <button
        onClick={async () => {
          if (file) {
            const res = await edgestore.publicFiles.upload({
              file,
              onProgressChange: (progress) => {
                // you can use this to show a progress bar
                console.log(progress);
              },
            });
            // you can run some server action or api here
            // to add the necessary data to your database
            console.log(res);
          }
        }}
      >
        Upload
      </button>
    </div>
  );
};

export default UploadFileButton;
