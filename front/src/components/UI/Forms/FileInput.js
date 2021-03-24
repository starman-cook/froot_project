import React, { useRef, useState } from "react";
import "./FileInput.css"

const FileInput = ({ name, label, onChange }) => {
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
        placeholder="Счет на оплату"
        disabled
        label={label}
        value={filename}
        onClick={activateInput}
      />
      <button className="FileInput__btn" type="button" onClick={activateInput}>
        Загрузить файл
      </button>
    </>
  );
};

export default FileInput;
