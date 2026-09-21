import { useState } from "react";
import imageCompression from "browser-image-compression";
import useShowToast from "./useShowToast";

// const usePreviewImg = () => {
//   const [imgUrl, setImgUrl] = useState(null);
//   const showToast = useShowToast();
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         setImgUrl(reader.result);
//       };

//       reader.readAsDataURL(file);
//     } else {
//       showToast("Invalid file type", " Please select an image file", "error");
//       setImgUrl(null);
//     }
//   };
//   return { handleImageChange, imgUrl, setImgUrl };
// };

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log(`originalFile size ${file.size / 1024 / 1024} MB`);
    if (file && file.type.startsWith("image/")) {
      try {
        // Compress the image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 800, // Maximum width or height
          useWebWorker: true, // Use web worker for faster compression
        });

        // Convert the compressed image to a Data URL
        // const reader = new FileReader();
        // reader.onloadend = () => {
        //   setImgUrl(reader.result);
        // };
        //   reader.readAsDataURL(compressedFile);
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);
        
          setImgUrl(compressedFile);
         return compressedFile;
      
      } catch (error) {
        showToast("Compression error", "Failed to compress image", "warning");
        setImgUrl(null);
      }
    } else {
      showToast("Invalid file type", "Please select an image file", "warning");
      setImgUrl(null);
    }
  };

  return { handleImageChange, imgUrl, setImgUrl };
};

export const useKYCPreviewImg = () => {
  const showToast = useShowToast();

  const handleImageChange = async (e) => {
    console.log("enter2");
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        // Compress the image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 800, // Maximum width or height
          useWebWorker: true, // Use web worker for faster compression
        });

        // Return the compressed image file directly
        return compressedFile;
      } catch (error) {
        showToast("Compression error", "Failed to compress image", "warning");
        return null; // Return null in case of an error
      }
    } else {
      showToast("Invalid file type", "Please select an image file", "warning");
      return null; // Return null if no valid file
    }
  };

  return { handleImageChange };
};

export default usePreviewImg;
