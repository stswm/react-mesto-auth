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
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import auth from "../../utils/auth";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setisInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [deleteCard, setDeleteCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmPopupOpen, setisConfirmPopupOpen] = useState(false);
  const [isRegistrate, setIsRegistrate] = useState(false);
  const [emailAuthorized, setEmailAuthorized] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [cards, setCards] = useState([]);
  const history = useHistory();

  useEffect(() => {
    Promise.all([api.getProfile(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (loggedIn) {
      history.push("/");
      return;
    }
    history.push("sign-in");
  }, [history, loggedIn]);

  useEffect(() => {
    handleTokenCheck();
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
  function handleInfoTooltipOpen() {
    setisInfoTooltipOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleConfirmDeleteClick(card) {
    setisConfirmPopupOpen(true);
    setDeleteCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setisConfirmPopupOpen(false);
    setisInfoTooltipOpen(false);
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
        closeAllPopups();
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
  // ! new func
  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then(() => {
        setIsRegistrate(true);
        history.push("/sign-in");
      })
      .catch((err) => {
        console.log(err);
        setIsRegistrate(false);
      })
      .finally(() => {
        handleInfoTooltipOpen();
      });
  }

  function handleAuthorize(email, password) {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setLoggedIn(true);
          handleTokenCheck();
        }
      })
      .catch((err) => console.log(err));
  }

  function handleTokenCheck() {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
          }
          setEmailAuthorized(res.data.email);
        })
        .catch((err) => console.log(err));
    }
  }

  function handleLogOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          emailAuthorized={emailAuthorized}
          onLogOut={handleLogOut}
        />
        <Switch>
          <Route path="/sign-up">
            <Register onRegister={handleRegister} />
          </Route>
          <Route path="/sign-in">
            <Login onLogIn={handleAuthorize} />
          </Route>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            cards={cards}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleConfirmDeleteClick}
          />
          <Route path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>

        <Footer loggedIn={loggedIn} />

        <InfoTooltip
          onClose={closeAllPopups}
          isOpen={isInfoTooltipOpen}
          isRegistrate={isRegistrate}
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
        ></ConfirmDelete>
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
