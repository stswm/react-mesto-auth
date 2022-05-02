import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ImagePopup from "../ImagePopup/ImagePopup";
import api from "../../utils/Api";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import EditProfilePopup from "../EditProfilePopup/EditProfilePopup";
import EditAvatarPopup from "../EditAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "../AddPlacePopup/AddPlacePopup";
import ConfirmDelete from "../ConfirmDelete/ConfirmDelete";
import Login from "../Login/Login";
import Register from "../Register/Register";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import PopupWithForm from "../PopupWithForm/PopupWithForm";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setisInfoTooltipOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [deleteCard, setDeleteCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmPopupOpen, setisConfirmPopupOpen] = useState(false)
  const [cards, setCards] = useState([]);
  useEffect(() => {
    Promise.all([api.getProfile(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => console.log(err));
  }, []);
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleInfoTooltipClick() {
    setisInfoTooltipOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleonfirmDeleteClick(card) {
    setisConfirmPopupOpen(true);
    setDeleteCard(card)

  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setisConfirmPopupOpen(false)
    setisInfoTooltipOpen(false)
    setSelectedCard({});
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .toggleLikeCards(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((item) => item.filter((c) => c._id !== card._id && c));
        setIsLoading(false);
        closeAllPopups()
      })
      .catch((err) => console.log(err));
  }
  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api
      .changeAvatar(avatar)
      .then(() => {
        setCurrentUser({ ...currentUser, avatar });
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }
  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api
      .addCard(data.name, data.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUserInfo({ name, about }) {
    setIsLoading(true);
    api
      .editProfile(name, about)
      .then((test) => {
        setCurrentUser(test);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Switch>
          <Route path="/sign-up">
            <Register />
          </Route>
          <Route  path="/sign-in">
            <Login />
          </Route>
        </Switch>
        <Main
          cards={cards}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleonfirmDeleteClick}
        />
        <InfoTooltip 
        onClose={closeAllPopups} 
        isOpen={isInfoTooltipOpen}
        ></InfoTooltip>


        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleUpdateAvatar}
          isLoading={isLoading}
        ></EditAvatarPopup>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleUpdateUserInfo}
          isLoading={isLoading}
        ></EditProfilePopup>

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleAddPlaceSubmit}
          isLoading={isLoading}
        ></AddPlacePopup>
        <ConfirmDelete
        isOpen={isConfirmPopupOpen}
        onClose={closeAllPopups}
        onSubmit={handleDelete}
        isLoading={isLoading}
        card={deleteCard}
        >
        </ConfirmDelete>
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
