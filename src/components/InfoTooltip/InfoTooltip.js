import React from "react";
import pic from "../../img/SuccessPic.svg";
import pic2 from "../../img/FailPic.svg";

export default function InfoTooltip({onClose, isOpen}) {
  return (
    <div className={`popup popup_type_Info ${isOpen ? 'popup_opend' : ''}`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__close buttonEffect"
          onClick={onClose}
        />
        <div className="InfoTooltipShell">
          <img className="InfoTooltip__Img" src={pic && pic2} />
          <p className="InfoTooltip__text">
            Что-то пошло не так! Попробуйте ещё раз.
          </p>
        </div>
      </div>
    </div>
  );
}
