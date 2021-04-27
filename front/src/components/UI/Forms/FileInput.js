import React, { useRef, useState } from "react";
import ButtonWhite from "../Buttons/ButtonWhite/ButtonWhite";
import "./FileInput.css"

const FileInput = ({ name, label, placeholder, onChange }) => {
  const inputRef = useRef();
  const [filename, setFilename] = useState("");

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setFilename(e.target.files[0].name);
    } else {
      setFilename("");
    }
    onChange(e);
  };
  const activateInput = () => {
    inputRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        name={name}
        style={{ display: "none" }}
        onChange={onFileChange}
        ref={inputRef}
      />
      <input className="FileInput__input"
        placeholder={placeholder}
        disabled
        label={label}
        value={filename}
        onClick={activateInput}
      />
      <ButtonWhite text="Загрузить файл" type="button" onClickHandler={activateInput}/>
    </>
  );
};

export default FileInput;
