import React from "react";

import Api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";

const App = () => {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);

  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState({});
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
        const userData = await Api.getCurrentUser();

        setCurrentUser(userData);
      } catch (error) {
        console.error("fetchUserData error", error);
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header />
        <Main
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
        />
        <Footer />

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

        <PopupWithForm name="sure" title="Вы уверены?" buttonText="Сохранить" />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;
