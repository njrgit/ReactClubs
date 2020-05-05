import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icon, Header } from "semantic-ui-react";

interface IProps {
  setFiles: (files: object[]) => void;
}

const dropZoneStyles = {
  border: "dashed 3px",
  borderColor: "#eee",
  borderRadius: "5px",
  paddingTop: "30px",
  textAlign: "center" as 'center',
  height: "200px"
};

const dropzoneActiveStlyes = {
    borderColor:'green'
}

const PhotoUploadWidgetDropzone: React.FC<IProps> = ({ setFiles }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file: Object) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style ={isDragActive ? {...dropZoneStyles, ...dropzoneActiveStlyes} : dropZoneStyles }>
          <input {...getInputProps()} />
          <Icon name ='upload' size='huge'/>
          <Header content ='Drop Image Here'/>
    </div>
  );
};

export default PhotoUploadWidgetDropzone;
