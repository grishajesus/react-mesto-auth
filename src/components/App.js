import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Api from "../utils/api";
import AuthApi from "../utils/auth-api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";

const App = () => {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);

  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = React.useState(false);

  const [userLoading, setUserLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState(null);

  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState(null);

  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setisAddPlacePopupOpen(true);
  const handleCardClick = (card) => setSelectedCard(card);

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setisAddPlacePopupOpen(false);

    setSelectedCard(null);
  };

  const handleLogin = async (payload) => {
    const { email, password } = payload;

    try {
      const response = await AuthApi.login(email, password);

      if (response.token) {
        localStorage.setItem("token", response.token);

        const userResponse = await AuthApi.getCurrentUser();

        setCurrentUser(userResponse.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async (payload) => {
    const { email, password } = payload;

    try {
      await AuthApi.register(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.setItem("token", null);

    setCurrentUser(null);
  };

  const handleUpdateUser = async (data) => {
    try {
      const updatedUser = await Api.updateUser(data);

      setCurrentUser(updatedUser);

      closeAllPopups();
    } catch (error) {
      console.error("handleUpdateUser", error);
    }
  };

  const handleUpdateAvatar = async (data) => {
    const { avatar } = data;

    try {
      const updatedUser = await Api.updateUserAvatar(avatar);

      setCurrentUser(updatedUser);

      closeAllPopups();
    } catch (error) {
      console.error("handleUpdateAvatar", error);
    }
  };

  const handleCardLike = async (card) => {
    const isLiked = card.likes.some((like) => like._id === currentUser._id);

    try {
      const newCard = await Api.changeLikeCardStatus(card._id, isLiked);

      setCards((state) =>
        state.map((stateCard) =>
          stateCard._id === card._id ? newCard : stateCard
        )
      );
    } catch (error) {
      console.error("handleCardLike", error);
    }
  };

  const handleCardDelete = async (card) => {
    try {
      await Api.deleteCard(card._id);

      setCards((state) =>
        state.filter((stateCard) => stateCard._id !== card._id)
      );
    } catch (error) {
      console.error("handleCardDelete", error);
    }
  };

  const handleAddPlaceSubmit = async (data) => {
    try {
      const newCard = await Api.createCard(data);

      setCards((state) => [newCard, ...state]);

      closeAllPopups();
    } catch (error) {
      console.error("handleAddPlaceSubmit", error);
    }
  };

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);

        const response = await AuthApi.getCurrentUser();

        setCurrentUser(response.data);
      } catch (error) {
        console.error("fetchUserData error", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, []);

  React.useEffect(() => {
    const fetchCards = async () => {
      try {
        const cardsData = await Api.getPlaces();

        setCards(cardsData);
      } catch (error) {
        console.error("fetchCards error", error);
      }
    };

    fetchCards();
  }, []);

  if (userLoading) {
    return null;
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <BrowserRouter>
        <div className="root">
          <Header onLogout={handleLogout} />

          <Routes>
            <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />

            <Route
              path="/sign-up"
              element={<Register onRegister={handleRegister} />}
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Main
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                currentUser ? (
                  <Navigate replace to="/" />
                ) : (
                  <Navigate replace to="/sign-in" />
                )
              }
            />
          </Routes>

          {currentUser ? <Footer /> : null}

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />

          <PopupWithForm
            name="sure"
            title="Вы уверены?"
            buttonText="Сохранить"
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
};

export default App;
