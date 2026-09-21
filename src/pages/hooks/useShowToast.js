import Swal from "sweetalert2";
import { useCallback } from "react";

const useShowToast = () => {
  const showToast = useCallback((title, text, icon, timer = 2000) => {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      timer: timer,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }, []);

  return showToast;
};

export default useShowToast;
