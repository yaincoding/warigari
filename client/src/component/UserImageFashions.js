import React, { useContext } from "react";
import { UserImageFashionsContext } from "../context/UserImageFashionsContextProvider";
import { funcdo } from "../utils/image_utils/feature_extractor";

const UserImageFashions = () => {
  const { state, contextDispatch } = useContext(UserImageFashionsContext);

  const onImageChange = (e) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const img = new Image();
      img.addEventListener("load", () => {
        funcdo(img, contextDispatch);
      });
      img.src = reader.result;
    });
    reader.readAsDataURL(e.target.files[0]);
  };

  const { originalImage, items } = state;

  return (
    <div>
      <input
        type="file"
        accept="image/jpg,image/png,image/jpeg,image/gif"
        name="img"
        onChange={onImageChange}
      />
      {originalImage && <img src={originalImage}></img>}
      <div id="fashions"></div>
    </div>
  );
};

export default UserImageFashions;
