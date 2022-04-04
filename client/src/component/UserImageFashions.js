import React, { useState, useContext, useEffect } from "react";
import { funcdo } from "../utils/image_utils/feature_extractor";

const UserImageFashions = () => {
  const [searchData, setSearchData] = useState(null);

  const itemToFrame = (item) => {
    const img = item.cropImage;
    const label = item.label;

    const span = document.createElement("span");

    const p = document.createElement("p");
    p.innerText = label;
    span.appendChild(img);
    span.appendChild(p);

    return span;
  };

  const renderImage = (img, original = false) => {
    const frame = document.getElementById("fashions");
    if (original) {
      while (frame.lastChild) {
        frame.removeChild(document.getElementById("fashions").lastChild);
      }
      const div = document.createElement("div");
      div.appendChild(img);
      frame.appendChild(div);
    } else {
      frame.appendChild(img);
    }
  };

  useEffect(() => {
    if (searchData) {
      const { originalImage, items } = searchData;
      renderImage(originalImage, true);
      for (const item of items) {
        renderImage(itemToFrame(item));
      }
    }
  });

  const onImageChange = (e) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const img = new Image();
      img.addEventListener("load", () => {
        funcdo(img, setSearchData);
      });
      img.src = reader.result;
    });
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpg,image/png,image/jpeg,image/gif"
        name="img"
        onChange={onImageChange}
      />
      <div id="fashions"></div>
    </div>
  );
};

export default UserImageFashions;
